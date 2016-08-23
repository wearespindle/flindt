import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedbackPeople from './feedbackPeople';
import feedbackReceived from './feedbackReceived';
import addFeedback from './addFeedback';

const rootReducer = combineReducers({feedbackPeople, feedbackReceived, addFeedback, routing: routerReducer});

export default rootReducer;
