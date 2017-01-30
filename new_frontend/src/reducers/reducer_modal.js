import {
    SHOW_MODAL,
    HIDE_MODAL,
} from '../actions/modal';

const INITIAL_STATE = {
    data: { },
    isOpen: false,
};

export default function(state = INITIAL_STATE, action) {
    let error,
        i;

    switch (action.type) {
    case SHOW_MODAL:
        return { ...state, data: action.payload.data, isOpen: true };

    case HIDE_MODAL:
        return INITIAL_STATE;

    default:
        return state;
    }
}
