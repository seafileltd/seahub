import { Component } from 'react';
import RepoList from './RepoList';
import AddRepoForm from './AddRepoForm';
import { getRepoList, removeRepo } from '../SeafileAPI';
import { sortRepos } from '../utils';
import { loadRepos } from '../actions';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { store } = this.props;
        console.log('will mount');
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

    componentWillUpdate() {
        console.log('will update');
    }
    
    render() {
        const { store } = this.props;

        return (
            <div className="app">
              <AddRepoForm store={store} />
              <RepoList store={store} />
            </div>
        )
    }
}


export default App;

