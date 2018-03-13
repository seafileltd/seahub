import React from 'react';
import ReactDOM from 'react-dom';
window.React = React;

import App from './components/App';
import storeFactory from './store';


const store = storeFactory();
window.store = store

const render = () =>
      ReactDOM.render(
          <App store={store} />,
        document.getElementById("main"));

// store.subscribe(render);
render()
