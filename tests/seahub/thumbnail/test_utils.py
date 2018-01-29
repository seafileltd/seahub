# -*- coding: utf-8 -*-

from seahub.test_utils import BaseTestCase
from seahub.thumbnail.utils import generate_thumbnail, _create_thumbnail_common
from seaserv import seafile_api, get_file_id_by_path, get_repo

import os
import shutil
from mock import patch

from django.test import RequestFactory

class GenerateThumbnailTest(BaseTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.image_name = self.image
        url = '/thumbnail/%s/create/' % self.repo.id
        self.request = self.factory.get(url)

    def tearDown(self):
        self.remove_repo(self.repo.id)

    def test_no_file_id(self):
        success, status_code = generate_thumbnail(self.request, self.repo.id, 48, '')
        assert success is False
        assert status_code == 400

    def test_enable_video_thumnail_false(self):
        # if ENABLE_VIDEO_THUMBNAIL = False
        seafile_api.post_empty_file(self.repo.id,
                                    '/',
                                    filename='video_test.mp4',
                                    username=self.user.username)

        success, status_code = generate_thumbnail(self.request, self.repo.id, 48, 'video_test.mp4')
        assert success is False
        assert status_code == 400

    @patch('seahub.thumbnail.utils.get_file_size')
    def test_thumbnail_exists(self, mock_get_file_size):
        mock_get_file_size.return_value = 12612
        mock_get_file_size.assert_called_once()
        success, status_code = generate_thumbnail(self.request, self.repo.id, 60, self.image_name)
        assert status_code == 200

    @patch("seahub.thumbnail.utils.THUMBNAIL_IMAGE_SIZE_LIMIT", 0)
    def test_file_size_gt_thumbnail_limit(self):
        success, status_code = generate_thumbnail(self.request, self.repo.id, 61, self.image_name)
        assert status_code == 400

    def test_generate_thumbnail(self):
        success, status_code = generate_thumbnail(self.request, self.repo.id, 48, self.image_name)
        assert success is True
        assert status_code == 200

class CreateThumbnailCommonTest(BaseTestCase):
    def setUp(self):
        self.thumbnail_dir = os.path.join('tests/seahub/thumbnail/thumbnail_tmp/', str(48))
        if not os.path.exists(self.thumbnail_dir):
            os.makedirs(self.thumbnail_dir)

    def tearDown(self):
        shutil.rmtree('tests/seahub/thumbnail/thumbnail_tmp')

    def test_create_jpg_thumbnail(self):
        thumbnail_file = os.path.join(self.thumbnail_dir, '1')
        success, code_status = _create_thumbnail_common(
                                    'media/img/email_bg.jpg',
                                    thumbnail_file, 48)
        assert success == True

    def test_create_psd_thumbnail(self):
        thumbnail_file = os.path.join(self.thumbnail_dir, '2')
        success, code_status = _create_thumbnail_common(
                                    'tests/seahub/thumbnail/origin_image/psd_image.psd',
                                    thumbnail_file, 48)
        assert success == True

    def test_create_tif_thumbnail(self):
        thumbnail_file = os.path.join(self.thumbnail_dir, '3')
        success, code_status = _create_thumbnail_common(
                                    'tests/seahub/thumbnail/origin_image/tif_image.tif',
                                    thumbnail_file, 48)
        assert success == True

    @patch("seahub.thumbnail.utils.THUMBNAIL_IMAGE_ORIGINAL_SIZE_LIMIT", 0)
    def test_image_memory_gt_limit(self):
        thumbnail_file = os.path.join(self.thumbnail_dir, '4')
        success, code_status = _create_thumbnail_common(
                                    'tests/seahub/thumbnail/origin_image/medium.tif',
                                    thumbnail_file, 48)
        assert success == False

