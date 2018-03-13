import PropTypes from 'prop-types';
import { Component } from 'react';
import RepoList from './RepoList';
import AddRepoForm from './AddRepoForm';
import { getRepoList, removeRepo } from '../SeafileAPI';
import { sortRepos } from '../utils';
import { loadRepos } from '../actions';
import { sortReposFunc } from '../utils';

class App extends Component {
    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            store: this.props.store
        }
    }

    componentWillMount() {
        console.log('will mount');

        this.unsubscribe = store.subscribe(
            () => this.forceUpdate()
        );

        getRepoList().then(
            repos => {
                console.log('success get repos');
                // this.setState({repos, loading: false});
                store.dispatch(loadRepos(repos));
            },
            error => {
                console.log('error get repos');
                // this.setState({error, loading: false});
            }
        );
    }

    componentDidMount() {
        console.log('did mount');
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillUpdate() {
        console.log('will update');
    }

    render() {
        const { repos, sort } = store.getState();
        const sortedRepos = [...repos].sort(sortReposFunc(sort));

        return (
            <div className="app">
              <AddRepoForm  />
              <RepoList repos={sortedRepos} />
            </div>
        )
    }
}

App.propTypes = {
    store: PropTypes.object.isRequired
}

App.childContextTypes = {
    store: PropTypes.object.isRequired
}

export default App;

