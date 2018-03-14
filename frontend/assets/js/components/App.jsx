import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';

import { fetchRepos } from '../actions';
import { NewRepo, Repos } from './containers';
import LoadingMsg from './ui/LoadingMsg';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('will mount');
        const { dispatch } = this.props;
        dispatch( fetchRepos() );
    }

    render() {
        const { loading, error } = this.props;

        return (
            <div className="app">
              {
              (loading) ?
                      <LoadingMsg /> :
                      <div>
                          <NewRepo  />
                          <Repos />
                      </div>
              }

              {(error) ? <p>Error loading libraries: {error.message}</p> : ""}
            </div>
        )
    }
}

function mapStateToProps (state) {
    const { loading, error } = state;
    return {
        loading,
        error
    }
}

export default connect(
    mapStateToProps,
    null
)(App);

