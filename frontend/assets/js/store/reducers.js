import C from '../constants';

export const repo = (state={}, action) => {
  switch (action.type) {
    case C.ADD_REPO:
    return {
      name: action.name,
      mtime_relative: action.mtime_relative,
      size_formatted: action.size_formatted
    }

    default:
    return state
  }
}

export const repos = (state=[], action) => {
  switch (action.type) {
    case C.LOAD_REPOS:
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

