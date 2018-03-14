import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addRepo, removeRepo, sortRepos } from '../actions';
import AddRepoForm from './ui/AddRepoForm';
import RepoList from './ui/RepoList';
import { sortReposFunc } from '../utils';


export const NewRepo = connect(
    null,
    (dispatch) => ({
        onNewRepo(name) {
            dispatch( addRepo(name) );
        }
    })
)(AddRepoForm);

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
