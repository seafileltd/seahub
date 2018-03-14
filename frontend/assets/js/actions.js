import C from './constants';
import { getRepoList } from './SeafileAPI';

export const loadRepos = () =>
  ({
    type: C.LOAD_REPOS
  })

export const loadReposSucc = (repos) =>
  ({
    type: C.LOAD_REPOS_SUCC,
    repos
  })

export const loadReposFail = (err) =>
  ({
    type: C.LOAD_REPOS_FAIL,
    err
  })

export const fetchRepos = () => dispatch => {
    dispatch( loadRepos() );
    return getRepoList().then(
      repos => dispatch( loadReposSucc(repos) ),
      error => dispatch( loadReposFail(error) )
    )
}

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
