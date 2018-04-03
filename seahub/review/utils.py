import posixpath

from seahub.utils import normalize_file_path
from seahub.utils.timeutils import datetime_to_isoformat_timestr
from seahub.base.templatetags.seahub_tags import email2nickname, \
        email2contact_email

def get_review_info(review):

    info = {}
    info['review_id'] = review.id
    info['status'] = review.status
    info['obj_id'] = review.file_version

    file_uuid_map = review.file_uuid
    info['repo_id'] = file_uuid_map.repo_id

    parent_path = file_uuid_map.parent_path
    file_name = file_uuid_map.filename
    file_path = posixpath.join(parent_path, file_name)
    info['path'] = normalize_file_path(file_path)

    reviewer = review.reviewer
    info['reviewer'] = reviewer
    info['reviewer_name'] = email2nickname(reviewer)
    info['reviewer_contact_email'] = email2contact_email(reviewer)

    info['start_time'] = datetime_to_isoformat_timestr(review.start_time)
    info['cancel_time'] = datetime_to_isoformat_timestr(review.cancel_time)
    info['finish_time'] = datetime_to_isoformat_timestr(review.finish_time)

    return info

