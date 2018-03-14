import PropTypes from 'prop-types';
import { addRepo, removeRepo, sortRepos } from '../actions';
import AddRepoForm from './ui/AddRepoForm';
import RepoList from './ui/RepoList';
import { sortReposFunc } from '../utils';


export const NewRepo = (props, { store }) =>
    <AddRepoForm onNewRepo={
        (name) => store.dispatch( addRepo(name) )
    } />;

NewRepo.contextTypes = {
    store: PropTypes.object
};

export const Repos = (props, { store }) => {
    const { repos, sort } = store.getState();
    const sortedRepos = [...repos].sort(sortReposFunc(sort));

    return (
        <RepoList repos={sortedRepos}
                  onRemove={(id) => store.dispatch( removeRepo(id))}
                  onSort={(sortBy) => store.dispatch( sortRepos(sortBy))}
                  />
    )
}

Repos.contextTypes = {
    store: PropTypes.object
};
