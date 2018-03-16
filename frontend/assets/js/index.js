import React from 'react';
import ReactDOM from 'react-dom';
window.React = React;
import { HashRouter } from 'react-router-dom';

import Root from './containers/Root';
import storeFactory from './store';

const store = storeFactory();

ReactDOM.render(
    <HashRouter>
        <Root store={store} />
    </HashRouter>,
    document.getElementById('main'));
