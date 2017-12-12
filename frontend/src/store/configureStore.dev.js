import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import reducer from '../reducers';

// const nextReducer = require('../reducers');

export default function(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(promise),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  return finalCreateStore(reducer, initialState);
}
