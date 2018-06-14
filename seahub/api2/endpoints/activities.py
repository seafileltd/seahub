# Copyright (c) 2012-2016 Seafile Ltd.

import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from seahub.base.templatetags.seahub_tags import translate_commit_desc_escape, \
        translate_seahub_time
from seahub.utils import EVENTS_ENABLED, is_org_context, \
        get_org_user_activities, get_user_activities, convert_cmmt_desc_link
from seahub.utils.timeutils import datetime_to_timestamp, utc_to_local
from seahub.api2.utils import api_error
from seahub.api2.throttling import UserRateThrottle
from seahub.api2.authentication import TokenAuthentication
from seahub.base.templatetags.seahub_tags import email2nickname
from seahub.avatar.templatetags.avatar_tags import api_avatar_url

logger = logging.getLogger(__name__)

class ActivitiesView(APIView):
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated, )
    throttle_classes = (UserRateThrottle, )

    def get(self, request, format=None):
        if not EVENTS_ENABLED:
            events = None
            return api_error(status.HTTP_404_NOT_FOUND, 'Events not enabled.')

        start = request.GET.get('start', '')
        count = request.GET.get('count', '')

        if not start:
            start = 0
        else:
            try:
                start = int(start)
            except ValueError:
                return api_error(status.HTTP_400_BAD_REQUEST, 'Start must be an integer')

        if not count:
            count = 15
        else:
            try:
                count = int(count)
                if count < 1:
                    raise RuntimeError()
            except Exception as e:
                logging.error(e)
                return api_error(status.HTTP_400_BAD_REQUEST, 'Count must be an integer and greater than 1.')

        email = request.user.username

        if is_org_context(request):
            org_id = request.user.org.org_id
            events, events_more_offset = get_org_user_activities(org_id, email,
                                                                 start,
                                                                 count + 1)
        else:
            events, events_more_offset = get_user_activities(email, start,
                                                             count + 1)
        events_more = False
        if events and len(events) == count + 1:
            events_more = True
            events = events[:-1]

        events_list = []
        for e in events:
            d = dict(op_type=e.op_type)
            d['obj_type'] = e.obj_type
            events_list.append(d)
            if e.op_type in ['create', 'rename', 'delete','recover'] and e.obj_type == 'repo':
                d['repo_id'] = e.repo_id
                d['repo_name'] = e.repo_name
                d['author'] = e.op_user
                d['time'] = datetime_to_timestamp(e.timestamp)
            elif e.op_type == 'clean-up-trash':
                d['repo_id'] = e.repo_id
                d['author'] = e.op_user
                d['time'] = datetime_to_timestamp(e.timestamp)
                d['days'] = e.days
                d['repo_name'] = e.repo_name
            else:
                d['author'] = e.commit.creator_name
                d['time'] = e.commit.ctime
                d['desc'] = e.commit.desc
                d['repo_id'] = e.repo_id
                d['repo_name'] = e.repo.repo_name
                d['commit_id'] = e.commit.id
                d['converted_cmmt_desc'] = translate_commit_desc_escape(convert_cmmt_desc_link(e.commit))
                d['repo_encrypted'] = e.repo.encrypted

            size = request.GET.get('size', 36)
            url, is_default, date_uploaded = api_avatar_url(d['author'], size)
            d['name'] = email2nickname(d['author'])
            d['avatar_url'] = request.build_absolute_uri(url)
            d['time_relative'] = translate_seahub_time(utc_to_local(e.timestamp))

        ret = {
            'events': events_list,
            'more': events_more,
            'more_offset': events_more_offset,
            }
        return Response(ret)
