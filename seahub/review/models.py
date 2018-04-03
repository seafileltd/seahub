import os
import datetime
from django.db import models

from seaserv import seafile_api

from seahub.tags.models import FileUUIDMap
from seahub.review.utils import get_review_info
from seahub.utils import normalize_file_path

# Create your models here.

REVIEW_STATUS_STARTED = 'started'
REVIEW_STATUS_CANCELED = 'canceled'
REVIEW_STATUS_FINISHED = 'finished'

class ReviewManager(models.Manager):

    def _get_file_uuid_map(self, repo_id, file_path):

        file_path = normalize_file_path(file_path)
        parent_path = os.path.dirname(file_path)
        file_name = os.path.basename(file_path)
        fileuuidmap = FileUUIDMap.objects.get_or_create_fileuuidmap(
                repo_id, parent_path, file_name, False)

        return fileuuidmap

    def get_review_info(self, review_id):

        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return None

        if review:
            info = get_review_info(review)
            return info
        else:
            return None

    def add_review(self, username, repo_id, file_path):

        file_uuid_map = self._get_file_uuid_map(repo_id, file_path)
        file_id = seafile_api.get_file_id_by_path(repo_id, file_path)

        # create file review record
        review = self.model(file_uuid=file_uuid_map, file_version=file_id,
                status=REVIEW_STATUS_STARTED, reviewer=username)
        review.save(using=self._db)

        return review

    def update_review_status(self, review_id, status):

        review = self.get(id=review_id)

        if status == REVIEW_STATUS_CANCELED:
            review.cancel_time = datetime.datetime.now()

        if status == REVIEW_STATUS_FINISHED:
            review.finish_time = datetime.datetime.now()

        review.status = status
        review.save()

        return review

    def get_reviews_by_path(self, repo_id, file_path):

        file_uuid_map = self._get_file_uuid_map(repo_id, file_path)
        file_uuid = file_uuid_map.uuid
        reviews = self.filter(file_uuid=file_uuid)

        return reviews


class Review(models.Model):
    file_uuid = models.ForeignKey(FileUUIDMap, on_delete=models.CASCADE)
    file_version = models.CharField(max_length=255)
    start_time = models.DateTimeField(default=datetime.datetime.now)
    cancel_time = models.DateTimeField(blank=True, null=True)
    finish_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=255, db_index=True) # finished, canceled, started
    reviewer = models.EmailField(db_index=True)

    objects = ReviewManager()


class ReviewCommentManager(models.Manager):

    def add_review_comment(self, review_id, content, more_data=None):

        review = Review.objects.get(id=review_id)
        comment = self.model(review=review, content=content,
                more_data=more_data)
        comment.save(using=self._db)

        return comment


class ReviewComment(models.Model):

    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    content = models.TextField()
    time = models.DateTimeField(default=datetime.datetime.now)
    more_data = models.TextField(blank=True, null=True)

    objects = ReviewCommentManager()
