import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { fetchRepos } from '../actions';
import { NewRepo } from './NewRepo';
import { Repos } from './repos';
import LoadingMsg from '../components/LoadingMsg';
import Whoops404 from '../components/Whoops404';
import PageTemplate from '../components/PageTemplate';

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
            <PageTemplate>
                <div className="app col-md-9">
                    {
                        (loading) ?
                            <LoadingMsg /> :
                            <div >
                                <NewRepo  />
                                <Repos />
                            </div>
                    }

                    {(error) ? <p>Error loading libraries: {error.message}</p> : ''}
                </div>
            </PageTemplate>
        );
    }
}

function mapStateToProps (state) {
    const { loading, error } = state;
    return {
        loading,
        error
    };
}

export default connect(
    mapStateToProps,
    null
)(App);

