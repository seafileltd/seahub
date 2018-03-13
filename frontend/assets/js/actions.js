import C from './constants';

export const loadRepos = (repos) =>
  ({
    type: C.LOAD_REPOS,
    repos
  })

export const addRepo = (name, mtime_relative='just now', size_formatted='0 bytes') =>
  ({
    type: C.ADD_REPO,
    name,
    mtime_relative,
    size_formatted
  })

export const removeRepo = (repo_id) =>
  ({
    type: C.REMOVE_REPO,
    repo_id
  })

export const sortRepos = sortBy =>
  (sortBy === "mtime") ?
  ({
    type: C.SORT_REPOS,
    sortBy: "SORTED_BY_MTIME"
  }) :
    (sortBy === "name") ?
      ({
        type: C.SORT_REPOS,
        sortBy: "SORTED_BY_NAME"
      }) :
        ({
          type: C.SORT_REPOS,
          sortBy: "SORTED_BY_SIZE"
        })
