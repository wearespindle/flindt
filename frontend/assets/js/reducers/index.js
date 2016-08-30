import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import FetchFeedbackAsSenderReducer from './FetchFeedbackAsSenderReducer';
import FetchFeedbackAsReceiverReducer from './FetchFeedbackAsReceiverReducer';

const rootReducer = combineReducers({
    FetchFeedbackAsSender: FetchFeedbackAsSenderReducer,
    FetchFeedbackAsReceiver: FetchFeedbackAsReceiverReducer,
});

export default rootReducer;
