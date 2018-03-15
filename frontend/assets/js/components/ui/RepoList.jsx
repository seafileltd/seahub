import { Component } from 'react';
import { Link } from 'react-router-dom';


const RepoListHeader = ({ onSort=f=>f }) => (
    <thead>
      <tr>
        <th width="4%"></th>
        <th width="42%" onClick={() => onSort('name')}>Name</th>
        <th width="14%" onClick={() => onSort('size')}>Size</th>
        <th width="20%" onClick={() => onSort('mtime')}>Last Update</th>
        <th width="20%"></th>
      </tr>
    </thead>
)

const RepoListItem = ({ id, name, size_formatted, mtime_relative, onRemove=f=>f }) => (
    <tr>
      <td></td>
      <td><Link to={`libs/${id}`}>{name}</Link></td>
      <td>{size_formatted}</td>
      <td dangerouslySetInnerHTML={{__html: mtime_relative}}></td>
      <td><a href="javascript:void(0)" onClick={onRemove} >Delete</a></td>
    </tr>
)


const RepoListBody = ({ repos, onRemove=f=>f}) => {
    return (
        <tbody>
          {repos.map((repo, i) =>
          <RepoListItem key={i} {...repo} onRemove={() => onRemove(repo.id)} />)}
        </tbody>
    )
}

const RepoListTable = ({ repos, onRemove=f=>f, onSort=f=>f}) =>
          <table>
          <RepoListHeader onSort={onSort}/>
          <RepoListBody repos={repos} onRemove={onRemove} />
          </table>;

const RepoList = ({ repos, onRemove=f=>f, onSort=f=>f }) =>{

    return (
        <div>
          {(repos.length !== 0) ?
              <RepoListTable repos={repos} onRemove={onRemove} onSort={onSort}/> :
                  <span>You don't have any libraries.</span>
                  }
        </div>
    )
}

export default RepoList;
