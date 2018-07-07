export const gettext = window.gettext;
export const siteRoot = window.app.config.siteRoot;
export const lang = window.app.config.lang;

export const getUrl = (options) => {
  switch (options.name) {
    case 'user_profile': return siteRoot + 'profile/' + options.username + '/';
    case 'common_lib': return siteRoot + '#common/lib/' + options.repoID + options.path;
  }
}
