# Copyright (c) 2012-2016 Seafile Ltd.
import os
import logging

from django.conf import settings
from PIL import Image, ImageDraw, ImageFont

# Get an instance of a logger
logger = logging.getLogger(__name__)

def get_ttc_font_path():
    return os.path.join(settings.MEDIA_ROOT, 'font/font.ttc')

def add_text_to_image(img, user, email):
    try:
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
    except Exception as e:
        logger.error(e)
    copyImgsize = img.size[0] if img.size[0] < img.size[1] else img.size[1]
    font_size = (copyImgsize - 200) / 200 * 3 + 11

    # calc the background size
    font_path = get_ttc_font_path()
    font = ImageFont.truetype(font_path, font_size)
    test_overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    image_draw = ImageDraw.Draw(test_overlay)

    # calc the test size and position
    margin_ = (copyImgsize - 200) / 200 * 1 + 5
    margin = [margin_, margin_]
    test_size_x, test_size_y = image_draw.textsize(user, font=font)
    test_size_email_x, test_size_email_y = image_draw.textsize(email, font=font)
    text_xy_user = (img.size[0] - test_size_x - margin[0], img.size[1] - 2 * test_size_y - margin[1])
    text_xy_email = (img.size[0] - test_size_email_x - margin[0], img.size[1] - test_size_email_y - margin[1])
    max_width = max(test_size_x, test_size_email_x)

    # draw the background of rect , and draw  the watermark
    image_draw.rectangle([img.size[0] - max_width - 2 * margin[0],
                          img.size[1] - 2 * test_size_y - 2 * margin[1],
                          img.size[0] + margin[0],
                          img.size[1] + margin[1]],
                         fill=(0, 0, 0, 88))
    image_draw.text(text_xy_user, user, font=font, fill=(255, 255, 245, 255))
    image_draw.text(text_xy_email, email, font=font, fill=(255, 255, 245, 255))
    image_width_text = Image.alpha_composite(img, test_overlay)
    return image_width_text
