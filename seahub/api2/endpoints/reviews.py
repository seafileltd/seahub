# Copyright (c) 2012-2016 Seafile Ltd.
import json
import logging

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from seaserv import seafile_api

from seahub.api2.utils import api_error
from seahub.api2.authentication import TokenAuthentication
from seahub.api2.throttling import UserRateThrottle

from seahub.review.utils import get_review_info
from seahub.review.models import Review, ReviewComment, \
        REVIEW_STATUS_CANCELED, REVIEW_STATUS_FINISHED

from seahub.views import check_folder_permission
from seahub.utils.timeutils import datetime_to_isoformat_timestr

logger = logging.getLogger(__name__)


class FileReviews(APIView):

    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated,)
    throttle_classes = (UserRateThrottle,)

    def get(self, request):
        """ Get all reviews of a file.

        If no parameter passed, return all file reviews of current user;
        If `repo_id` and `path` passed, return all review of this file.

        Permission checking:
        1. User can view this file.
        """

        reviews = []
        username = request.user.username

        repo_id = request.GET.get('repo_id', None)
        path = request.GET.get('path', None)

        # If no parameter passed, return all file reviews of current user;
        if not repo_id and not path:
            reviews = Review.objects.filter(reviewer = username)

        # If `repo_id` and `path` passed, return all review of this file.
        if repo_id and path:

            repo = seafile_api.get_repo(repo_id)
            if not repo:
                error_msg = 'Library %s not found.' % repo_id
                return api_error(status.HTTP_404_NOT_FOUND, error_msg)

            try:
                file_id = seafile_api.get_file_id_by_path(repo_id, path)
            except Exception as e:
                logger.error(e)
                error_msg = 'Internal Server Error'
                return api_error(status.HTTP_500_INTERNAL_SERVER_ERROR, error_msg)

            if not file_id:
                error_msg = 'File %s not found.' % path
                return api_error(status.HTTP_404_NOT_FOUND, error_msg)

            # permission check
            if not check_folder_permission(request, repo_id, '/'):
                error_msg = 'Permission denied.'
                return api_error(status.HTTP_403_FORBIDDEN, error_msg)

            reviews = Review.objects.get_reviews_by_path(repo_id, path)

        # get reviews info
        result = []
        for review in reviews:
            info = get_review_info(review)
            result.append(info)

        return Response(result)

    def post(self, request):
        """ Add a review.

        Permission checking:
        1. User can view this file.
        """

        # argument check
        repo_id = request.data.get('repo_id', None)
        if not repo_id:
            error_msg = 'repo_id invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        path = request.data.get('path', None)
        if not path:
            error_msg = 'path invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        # resource check
        repo = seafile_api.get_repo(repo_id)
        if not repo:
            error_msg = 'Library %s not found.' % repo_id
            return api_error(status.HTTP_404_NOT_FOUND, error_msg)

        try:
            file_id = seafile_api.get_file_id_by_path(repo_id, path)
        except Exception as e:
            logger.error(e)
            error_msg = 'Internal Server Error'
            return api_error(status.HTTP_500_INTERNAL_SERVER_ERROR, error_msg)

        if not file_id:
            error_msg = 'File %s not found.' % path
            return api_error(status.HTTP_404_NOT_FOUND, error_msg)

        # permission check
        if check_folder_permission(request, repo_id, '/') != 'rw':
            error_msg = 'Permission denied.'
            return api_error(status.HTTP_403_FORBIDDEN, error_msg)

        # add a review
        username = request.user.username
        review = Review.objects.add_review(username, repo_id, path)
        review_info = get_review_info(review)
        return Response(review_info)


class FileReview(APIView):

    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated,)
    throttle_classes = (UserRateThrottle,)

    def put(self, request, review_id):
        """ Update status of a review.

        Cancel of finish a review.

        Permission checking:
        1. Only reviewer can update status of a review.
        """

        # argument check
        review_status = request.data.get('status', None)
        if not review_status:
            error_msg = 'status invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        review_status = review_status.lower()
        if review_status not in (REVIEW_STATUS_CANCELED, REVIEW_STATUS_FINISHED):
            error_msg = 'status invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        # resource check
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            error_msg = 'Review %s not found.' % review_id
            return api_error(status.HTTP_404_NOT_FOUND, error_msg)

        # permission check
        reviewer = review.reviewer
        username = request.user.username
        if username != reviewer:
            error_msg = 'Permission denied.'
            return api_error(status.HTTP_403_FORBIDDEN, error_msg)

        # add a review
        review = Review.objects.update_review_status(review_id, review_status)
        review_info = get_review_info(review)
        return Response(review_info)


class FileReviewComments(APIView):

    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = (IsAuthenticated,)
    throttle_classes = (UserRateThrottle,)

    def _get_comment_info(self, comment):
        info = {}
        info['review_id'] = comment.review_id
        info['comment_id'] = comment.id
        info['content'] = comment.content
        info['time'] = datetime_to_isoformat_timestr(comment.time)
        return info

    def get(self, request, review_id):
        """ Get all comments of a file review

        Permission checking:
        1. User can view this file.
        """

        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            error_msg = 'Review %s not found.' % review_id
            return api_error(status.HTTP_404_NOT_FOUND, error_msg)

        try:
            comments = ReviewComment.objects.filter(review_id=review)
        except Exception as e:
            logger.error(e)
            error_msg = 'Internal Server Error'
            return api_error(status.HTTP_500_INTERNAL_SERVER_ERROR, error_msg)

        result = []
        for comment in comments:
            info = self._get_comment_info(comment)
            result.append(info)

        return Response(result)

    def post(self, request, review_id):
        """ Add comment in a file review.

        Permission checking:
        1. User can view this file.
        """

        # argument check
        content = request.data.get('content', None)
        if not content:
            error_msg = 'content invalid.'
            return api_error(status.HTTP_400_BAD_REQUEST, error_msg)

        # resource check
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            error_msg = 'Review %s not found.' % review_id
            return api_error(status.HTTP_404_NOT_FOUND, error_msg)

        # add a comment
        # TODO
        more_data = None
        if more_data:
            more_data = json.dumps()

        try:
            comment = ReviewComment.objects.add_review_comment(review.id,
                    content, more_data)
        except Exception as e:
            logger.error(e)
            error_msg = 'Internal Server Error'
            return api_error(status.HTTP_500_INTERNAL_SERVER_ERROR, error_msg)

        info = self._get_comment_info(comment)

        return Response(info)

