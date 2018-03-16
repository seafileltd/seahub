import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import Whoops404 from '../components/Whoops404';
import PageTemplate from '../components/PageTemplate';

const Root = ({ store }) => (
    <Provider store={store}>
    <div>
      <Switch>
        <Route exact path="/libs/:id" component={({ match }) => <PageTemplate><p>{match.params.id}</p></PageTemplate>} />
        <Route exact path="/" component={App} />
        <Route component={Whoops404} />
      </Switch>
    </div>
    </Provider>
)

Root.propTypes = {
    store: PropTypes.object.isRequired,
}

export default Root;
