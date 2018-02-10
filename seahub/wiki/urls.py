# Copyright (c) 2012-2016 Seafile Ltd.
from django.conf.urls import patterns, url

from .views import *

urlpatterns = patterns(
    '',
    url(r'^$', wiki_list, name='wiki_list'),
    url(r'^(?P<slug>[^/]+)/$', slug, name='slug'),
    url(r'^(?P<slug>[^/]+)/(?P<page_name>[^/]+)/$', slug, name='slug'),
)
