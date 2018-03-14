import C from '../constants';

export const repo = (state={}, action) => {
  switch (action.type) {
    case C.ADD_REPO:
    return {
      name: action.name,
      mtime: Date.now(),
      mtime_relative: action.mtime_relative,
      size: 0,
      size_formatted: action.size_formatted
    }

    default:
    return state
  }
}

export const repos = (state=[], action) => {
  switch (action.type) {
    case C.LOAD_REPOS_SUCC:
    return action.repos

    case C.ADD_REPO:
    return [
      repo({}, action),
      ...state
    ]

    case C.REMOVE_REPO:
    return state.filter(
      (r) => r.id !== action.repo_id
    )

    default:
    return state
  }
}

export const sort = (state="SORTED_BY_NAME", action) => {
  switch (action.type) {
    case C.SORT_REPOS:
    return action.sortBy

    default:
    return state
  }
}

export const loading = (state=false, action) => {
  switch (action.type) {
    case C.LOAD_REPOS:
    return true

    case C.LOAD_REPOS_SUCC:
    return false

    case C.LOAD_REPOS_FAIL:
    return false

    default:
    return state
  }
}

export const error = (state=null, action) => {
  switch (action.type) {
    case C.LOAD_REPOS_FAIL:
    return action.err

  default:
    return state
  }
}
