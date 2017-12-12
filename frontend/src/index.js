import React from 'react';
import ReactDOM from 'react-dom';
import './assets/sass/styles.css';
import App from './App';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './utils/history';
import configureStore from './store/store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('main')
);
