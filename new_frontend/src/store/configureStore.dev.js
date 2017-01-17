import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import reducer from '../reducers';

const nextReducer = require('../reducers');

export default function configureStore(initialState) {
    const finalCreateStore = compose(
        applyMiddleware(promise),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore);

    const store = finalCreateStore(reducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
