from django.conf.urls import url

from seahub.api2.endpoints.reviews import FileReviews, \
        FileReview, FileReviewComments

urlpatterns = [
    url(r'^$', FileReviews.as_view(), name='api-v2.1-reviews'),
    url(r'^(?P<review_id>\d+)/$', FileReview.as_view(), name='api-v2.1-review'),
    url(r'^(?P<review_id>\d+)/comments/$', FileReviewComments.as_view(), name='api-v2.1-review-comment'),
]
