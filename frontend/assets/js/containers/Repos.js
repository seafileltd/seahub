import { connect } from 'react-redux';

import { removeRepo, sortRepos } from '../actions';
import RepoList from '../components/RepoList';
import { sortReposFunc } from '../utils';

export const Repos = connect(
    (state) => ({
        repos: [...state.repos].sort(sortReposFunc(state.sort))
    }),
    (dispatch) => ({
        onRemove(id) {
            dispatch(removeRepo(id));
        },
        onSort(sortBy) {
            dispatch(sortRepos(sortBy));
        }
    })
)(RepoList);
