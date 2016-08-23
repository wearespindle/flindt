import { combineReducers } from 'redux';
import FetchFeedbackAsSenderReducer from './FetchFeedbackAsSenderReducer';
import FetchFeedbackAsReceiverReducer from './FetchFeedbackAsReceiverReducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    FetchFeedbackAsSender: FetchFeedbackAsSenderReducer,
    FetchFeedbackAsReceiver: FetchFeedbackAsReceiverReducer,
});

export default rootReducer;
