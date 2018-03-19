# encoding: utf-8

'''
diff result

1. 目录下有1个非空文件 b->ba

{u'status': u'mov', u'new_name': u'ba/3/3333/git.jpg.enc', u'name': u'b/3/3333/git.jpg.enc'}

1.1 目录下有多个非空文件 ba->cb

{u'status': u'mov', u'new_name': u'cb/3/3333/git.jpg.enc', u'name': u'ba/3/3333/git.jpg.enc'}
{u'status': u'mov', u'new_name': u'cb/xx.jpg', u'name': u'ba/xx.jpg'}
{u'status': u'del', u'new_name': None, u'name': u'ba/3/3333/22/aa'}
{u'status': u'del', u'new_name': None, u'name': u'ba/3/3333/22/b.txt'}
{u'status': u'deldir', u'new_name': None, u'name': u'ba/3/3333/22'}
{u'status': u'deldir', u'new_name': None, u'name': u'ba/3/3333'}
{u'status': u'deldir', u'new_name': None, u'name': u'ba/3'}
{u'status': u'deldir', u'new_name': None, u'name': u'ba/b1'}
{u'status': u'del', u'new_name': None, u'name': u'ba/git.jpg'}
{u'status': u'deldir', u'new_name': None, u'name': u'ba'}
{u'status': u'add', u'new_name': None, u'name': u'cb/3/3333/22/aa'}
{u'status': u'add', u'new_name': None, u'name': u'cb/3/3333/22/b.txt'}
{u'status': u'newdir', u'new_name': None, u'name': u'cb/b1'}
{u'status': u'add', u'new_name': None, u'name': u'cb/git.jpg'}


2 目录下有1个空文件 zzz->aaa

{u'status': u'add', u'new_name': None, u'name': u'xxx/aa'}
{u'status': u'del', u'new_name': None, u'name': u'zzz/aa'}
{u'status': u'deldir', u'new_name': None, u'name': u'zzz'}

2.1. 目录下有多个空文件 yyy->zzz


{u'status': u'del', u'new_name': None, u'name': u'yyy/aa'}
{u'status': u'del', u'new_name': None, u'name': u'yyy/fadsf'}
{u'status': u'deldir', u'new_name': None, u'name': u'yyy'}
{u'status': u'add', u'new_name': None, u'name': u'zzz/aa'}
{u'status': u'add', u'new_name': None, u'name': u'zzz/fadsf'}



3. 重命名空文件 foo.txt->bar.txt

{u'status': u'add', u'new_name': None, u'name': u'bar.txt'}
{u'status': u'del', u'new_name': None, u'name': u'foo.txt'}

4. 重命名空目录 bar -> rab

{u'status': u'deldir', u'new_name': None, u'name': u'bar'}
{u'status': u'newdir', u'new_name': None, u'name': u'rab'}

'''

from django.core.urlresolvers import reverse

from seahub.test_utils import BaseTestCase

class ConvertCmmtDescLinkTest(BaseTestCase):
    def setUp(self):
        self.login_as(self.user)

    def test_can_render(self):
        pass
        # resp = self.client.get(reverse('convert_cmmt_desc_link') + '?repo_id=' + self.repo.id + '&cmmt_id=xxx' + '&nm=foo')

        # self.assertEqual(200, resp.status_code)
