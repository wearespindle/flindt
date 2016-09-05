import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import {reducer as Notifications} from 'react-notification-system-redux';

import FetchFeedbackReducer from './FetchFeedbackReducer';
import FetchRatingsReducer from './FetchRatingsReducer';
import UserReducer from './UserReducer';

const rootReducer = combineReducers({
    FetchFeedback: FetchFeedbackReducer,
    FetchRatings: FetchRatingsReducer,
    User: UserReducer,
    Notifications,
});

export default rootReducer;
