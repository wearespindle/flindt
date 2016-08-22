import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import feedbackPeople from './feedbackPeople';

const rootReducer = combineReducers({feedbackPeople, routing: routerReducer});

export default rootReducer;
