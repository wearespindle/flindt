import { createStore, compse } from 'redux';
import { syncHistoryWithStore} from 'react-router-redux';
import { browserHistory } from 'react-router';

// Import rootReducer.
import rootReducer from '../reducers/index';

import feedbackPeople from '../sample-data/feedbackPeople';
import feedbackReceived from '../sample-data/feedbackReceived';

// Create an object for the default data.
const defaultState = {
    feedbackPeople,
    feedbackReceived,
    addFeedback: null,
};

// Set devToolsExtension to be able to see the store and state in
// the Redux devtools.
const store = createStore(rootReducer, defaultState, window.devToolsExtension && window.devToolsExtension());

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
