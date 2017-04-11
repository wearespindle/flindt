import {
    SHOW_ROLE_MODAL,
    SHOW_SKIP_FEEDBACK_MODAL,
    HIDE_MODAL,
} from '../actions/modal';

const INITIAL_STATE = {
    data: { },
    isOpen: false,
    skipFeedbackModalisOpen: false,
    skipFeedbackModalData: { },
};

export default function(state = INITIAL_STATE, action) {
    let error,
        i;

    switch (action.type) {
    case SHOW_ROLE_MODAL:
        return { ...state, data: action.payload.data, isOpen: true };

    case SHOW_SKIP_FEEDBACK_MODAL:
        return { ...state, skipFeedbackModalisOpen: true };

    case HIDE_MODAL:
        return INITIAL_STATE;

    default:
        return state;
    }
}
