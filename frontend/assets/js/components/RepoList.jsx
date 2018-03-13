import PropTypes from 'prop-types';
import { Component } from 'react';
import { sortRepos, removeRepo } from '../actions';
import { sortReposFunc } from '../utils';

const RepoListHeader = ({ store }) => (
    <thead>
      <tr>
        <th width="4%"></th>
        <th width="42%" onClick={() => store.dispatch(sortRepos('name'))}>Name</th>
        <th width="14%" onClick={() => store.dispatch(sortRepos('size'))}>Size</th>
        <th width="20%" onClick={() => store.dispatch(sortRepos('mtime'))}>Last Update</th>
        <th width="20%"></th>
      </tr>
    </thead>
)

const RepoListItem = ({ name, size_formatted, mtime_relative, onRemove=f=>f }) => (
    <tr>
      <td></td>
      <td>{name}</td>
      <td>{size_formatted}</td>
      <td dangerouslySetInnerHTML={{__html: mtime_relative}}></td>
      <td><a href="javascript:void(0)" onClick={onRemove} >Delete</a></td>
    </tr>
)


const RepoListBody = ({ store }) => {
    const { repos, sort } = store.getState();
    const sortedRepos = [...repos].sort(sortReposFunc(sort));

    return (
        <tbody>
          {sortedRepos.map((repo, i) =>
          <RepoListItem key={i} {...repo} onRemove={() => store.dispatch(removeRepo(repo.id))} />)}
        </tbody>
    )
}

const RepoListTable = ({ store }) =>
          <table>
          <RepoListHeader store={store} />
          <RepoListBody store={store} />
          </table>;

const RepoList = ({ store }) =>{
    const { repos } = store.getState();

    return (
        <div>
          {(repos.length !== 0) ?
              <RepoListTable store={store} /> :
                  <span>You don't have any libraries.</span>
                  }
        </div>
    )
}

RepoList.propTypes = {
    store: PropTypes.object
};

export default RepoList;
