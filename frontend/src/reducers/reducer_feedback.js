import {
    EDIT_FEEDBACK,
    FETCH_FEEDBACK_AS_SENDER,
    FETCH_FEEDBACK_AS_RECEIVER,
    FETCH_FEEDBACK,
    CLEAN_FEEDBACK,
} from '../actions/feedback';

const INITIAL_STATE = {
    feedback_as_sender: { feedback: [] },
    feedback_as_receiver: { feedback: [] },
    feedback: { feedback: {} },
};

export default function(state = INITIAL_STATE, action) {
    let error,
        i;

    switch (action.type) {
    case FETCH_FEEDBACK_AS_SENDER:
        return { ...state, feedback_as_sender: { feedback: action.payload.data } };

    case FETCH_FEEDBACK_AS_RECEIVER:
        return { ...state, feedback_as_receiver: { feedback: action.payload.data } };

    case FETCH_FEEDBACK:
        return { ...state, feedback: { feedback: action.payload.data } };

    case EDIT_FEEDBACK:
        return { ...state };

    case CLEAN_FEEDBACK:
        return INITIAL_STATE;

    default:
        return state;
    }
}
