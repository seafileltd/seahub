import React from 'react';
import { gettext as _, siteRoot, lang, getUrl } from '../globals';
import Moment from 'react-moment';
import filesize from 'filesize';
import { compose } from 'recompose';

const PER_PAGE = 1;
const repoID = window.app.pageOptions.repoID;
const filePath = encodeURIComponent(window.app.pageOptions.filePath);

const applySetResult = (result) => (prevState) => ({
  data: result.data,
  page: result.page,
  isLoading: false,
  hasMore: result.data.length === PER_PAGE,
});

const applyUpdateResult = (result) => (prevState) => ({
  data: [...prevState.data, ...result.data],
  page: result.page,
  isLoading: false,
  hasMore: result.data.length === PER_PAGE,
});

const getFileHistoryUrl = (repo_id, path, page=1, per_page=PER_PAGE) => {
  return `${siteRoot}api/v2.1/repos/${repoID}/file/new_history/?path=${filePath}&page=${page}&per_page=${per_page}`;
};

class FileHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      page: null,
      isLoading: true,
      hasMore: false
    };
  }

  fetchData = (repo_id, path, page, per_page) => {
    this.setState({ isLoading: true });
    fetch(getFileHistoryUrl(repo_id, path, page, per_page),
      {credentials: 'same-origin'})
      .then(response => response.json())
      .then(result => this.onSetResult(result, page))
      .catch(error => console.error('Fetch Error =\n', error));
  }

  onSetResult = (result, page) => {
    page === 1
      ? this.setState(applySetResult(result))
      : this.setState(applyUpdateResult(result));
  }


  componentDidMount() {
    this.fetchData('', '', 1, PER_PAGE);
  }

  onPaginatedGet = (e) =>
    this.fetchData('', '', this.state.page + 1, PER_PAGE)

  render() {
    return (
      <div>
        <Header />
        <BackNav />
        <Tip />

        <TableWithBreadcrumbAndLoadMore
          data={this.state.data}
          onPaginatedGet={this.onPaginatedGet}
          isLoading={this.state.isLoading}
          hasMore={this.state.hasMore}
          page={this.state.page}
        />

      </div>
    );
  }
}

const Header = () => (
  <h2><span className="op-target">{window.app.pageOptions.fileName}</span> Version History</h2>
);

const BackNav = () => (
  <a href="#" className="go-back" title="Back">
    <span className="icon-chevron-left"></span>
  </a>
);

const Tip = () => (
  <p className="tip">Tip: a new version will be generated after each modification, and you can restore the file to a previous version.</p>
);

class TableRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: false,
    };
  }

  mouseEnter = () => {
    this.setState( {isSelected: true} );
  }

  mouseLeave = () => {
    this.setState( {isSelected: false} );
  }

  render() {
    const { item, idx } = this.props;
    const { isSelected } = this.state;
    return (
      <tr onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}
        className={isSelected ? 'hl' : ''}>
        <td className="time"><span title={item.ctime}><Moment locale={lang} fromNow>{item.ctime}</Moment></span> {idx === 0 && '(current version)'}</td>
        <td><img src={item.creator_avatar_url} width="16" height="16" className="avatar" /> <a href={getUrl({name: 'user_profile', username: item.creator_email})} className="vam">{item.creator_name}</a></td>
        <td>{filesize(item.size, {base: 10})}</td>

        { isSelected ?
          <td>
            {idx !== 0 && <a href="#" className="op" target="_blank">Restore</a>}
            <a href={getUrl({name: 'download_historic_file', repoID: repoID, objID: item.rev_file_id, filePath: filePath})} className="op" target="_blank">Download</a>
            <a href={getUrl({name: 'view_historic_file', repoID: repoID, commitID: item.commit_id, objID: item.rev_file_id, filePath: filePath})} className="op" target="_blank">View</a>
            <a href={getUrl({name: 'diff_historic_file', repoID: repoID, commitID: item.commit_id, filePath: filePath})} className="op" target="_blank">Diff</a>
          </td> :
          <td></td>
        }
      </tr>
    );
  }
}

const Table = ({ data }) => (
  <table className="commit-list">
    <thead>
      <tr>
        <th width="25%">Time</th>
        <th width="25%">Modifer</th>
        <th width="20%">Size</th>
        <th width="30%">Operation</th>
      </tr>
    </thead>

    <tbody>
      {data.map(
        (item, idx) => <TableRow key={item.commit_id} item={item} idx={idx} />
      )}
    </tbody>
  </table>
);

const withBreadcrumb = (Component) => (props) =>
  <div>
    <div className="commit-list-topbar ovhd">
      <p className="path fleft">Current Path:
        <a href={getUrl({name: 'common_lib', repoID: repoID, path: '/'})}>{window.app.pageOptions.repoName}</a>
        {window.app.pageOptions.filePath}
      </p>
    </div>

    <Component {...props} />
  </div>;

const withLoadMore = (conditionFn) => (Component) => (props) =>
  <div>
    <Component {...props} />

    { conditionFn(props) &&
    <div id="history-more">
      { props.isLoading &&
      <div id="history-more-loading">
        <span className="loading-icon loading-tip"></span>
      </div>
      }

      <button id="history-more-btn" onClick={props.onPaginatedGet} className="full-width-btn">{_('More')}</button>
    </div>
    }
  </div>;

const loadMoreCondition = props =>
  props.page !== null && props.hasMore;

const TableWithBreadcrumbAndLoadMore = compose(
  withBreadcrumb,
  withLoadMore(loadMoreCondition),
)(Table);

export default FileHistory;
