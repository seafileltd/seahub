import React from 'react';
import ReactDOM from 'react-dom';
window.React = React;
import { HashRouter } from 'react-router-dom';

import Root from './components/Root';
import storeFactory from './store';

const store = storeFactory();

const render = () =>
      ReactDOM.render(
          <HashRouter>
          <Root store={store} />
          </HashRouter>,
        document.getElementById("main"));

render()
