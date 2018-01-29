# -*- coding: utf-8 -*-

from seahub.test_utils import BaseTestCase
import json

from django.core.urlresolvers import reverse

class ThumbnailCreateTest(BaseTestCase):
    def setUp(self):
        self.login_as(self.user)
        self.image_name = self.image

    def tearDown(self):
        self.remove_repo(self.repo.id)

    def test_repo_not_exist(self):
        url = reverse('thumbnail_create', kwargs={
            'repo_id': '349f89d3-ea03-4bbe-bb3a-e3b3b8032fad'
        })
        resp = self.client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(400, resp.status_code)

    def test_path_not_exit(self):
        url = reverse('thumbnail_create', kwargs={
            'repo_id': self.repo.id
        })
        resp = self.client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(400, resp.status_code)

    def test_thumbnail_create(self):
        url = reverse('thumbnail_create', kwargs={
            'repo_id': self.repo.id
        })
        url = url + '?path=/' + self.image_name + '&size=60'
        resp = self.client.get(url, HTTP_X_REQUESTED_WITH='XMLHttpRequest')

        json_resp = json.loads(resp.content)
        assert json_resp['encoded_thumbnail_src'] == 'thumbnail/%s/60/%s' % (self.repo.id, self.image_name)
        self.assertEqual(200, resp.status_code)


class ThumbnailGetTest(BaseTestCase):
    def setUp(self):
        self.login_as(self.user)
        self.image_name = self.image

    def test_thumbnail_get(self):
        url = reverse('thumbnail_get', kwargs={
            'repo_id': self.repo.id,
            'size': 77,
            'path': self.image_name
        })
        resp = self.client.get(url)
        self.assertEqual(200, resp.status_code)
