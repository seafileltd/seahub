import React from 'react';
import ReactDOM from 'react-dom';
window.React = React;

import App from './components/App';
import storeFactory from './store';
import { Provider } from 'react-redux';

const store = storeFactory();

const render = () =>
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        document.getElementById("main"));

render()
