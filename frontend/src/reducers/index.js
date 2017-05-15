import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import {reducer as Notifications} from 'react-notification-system-redux';

import FeedbackReducer from './reducer_feedback';
import UserReducer from './reducer_user';
import QuestionReducer from './reducer_question';
import ModalReducer from './reducer_modal';
import HappinessReducer from './reducer_happiness';

const rootReducer = combineReducers({
    Feedback: FeedbackReducer,
    User: UserReducer,
    form: formReducer,
    Question: QuestionReducer,
    Notifications,
    Modal: ModalReducer,
    Happiness: HappinessReducer,
});

export default rootReducer;
