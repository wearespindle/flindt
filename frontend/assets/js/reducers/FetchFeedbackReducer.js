import {
    EDIT_FEEDBACK,
    EDIT_FEEDBACK_SUCCESS,
    EDIT_FEEDBACK_FAILURE,
    FETCH_FEEDBACK_AS_SENDER,
    FETCH_FEEDBACK_AS_SENDER_SUCCESS,
    FETCH_FEEDBACK_AS_SENDER_FAILURE,
    RESET_FETCH_FEEDBACK_AS_SENDER,
    FETCH_FEEDBACK_AS_RECEIVER,
    FETCH_FEEDBACK_AS_RECEIVER_SUCCESS,
    FETCH_FEEDBACK_AS_RECEIVER_FAILURE,
    RESET_FETCH_FEEDBACK_AS_RECEIVER,
    FETCH_FEEDBACK,
    FETCH_FEEDBACK_SUCCESS,
    FETCH_FEEDBACK_FAILURE,
    FETCH_FEEDBACK_RESET,
} from '../actions/FetchFeedback';

const INITIAL_STATE = {
    feedback_as_sender: { feedback: [], error: null, loading: false },
    feedback_as_receiver: { feedback: [], error: null, loading: false },
    feedback: { feedback: {}, error: null, loading: true },
};

export default function(state = INITIAL_STATE, action) {
    let error;
    let i;

    switch (action.type) {
        case FETCH_FEEDBACK_AS_SENDER:
            return { ...state, feedback_as_sender: { feedback: [], error: null, loading: true } };
        case FETCH_FEEDBACK_AS_SENDER_SUCCESS:
            return { ...state, feedback_as_sender: { feedback: action.payload.data, error: null, loading: false } };
        case FETCH_FEEDBACK_AS_SENDER_FAILURE:
            error = action.payload.data || { message: action.payload.message };
            return { ...state, feedback_as_sender: { feedback: [], error, loading: false } };
        case RESET_FETCH_FEEDBACK_AS_SENDER:
            return { ...state, feedback_as_sender: { feedback: [], error: null, loading: false } };

        case FETCH_FEEDBACK_AS_RECEIVER:// start fetching posts and set loading = true
            return { ...state, feedback_as_receiver: { feedback: [], error: null, loading: true } };
        case FETCH_FEEDBACK_AS_RECEIVER_SUCCESS:// return list of posts and make loading = false
            return { ...state, feedback_as_receiver: { feedback: action.payload.data, error: null, loading: false } };
        case FETCH_FEEDBACK_AS_RECEIVER_FAILURE:// return error and make loading = false
            error = action.payload.data || { message: action.payload.message };
            return { ...state, feedback_as_receiver: { feedback: [], error, loading: false } };
        case RESET_FETCH_FEEDBACK_AS_RECEIVER:// reset postList to initial state
            return { ...state, feedback_as_receiver: { feedback: [], error: null, loading: false } };

        case FETCH_FEEDBACK:
            return { ...state, feedback: { feedback: {}, error: null, loading: true } };
        case FETCH_FEEDBACK_SUCCESS:
            return { ...state, feedback: { feedback: action.payload.data, error: null, loading: false } };
        case FETCH_FEEDBACK_FAILURE:
            error = action.payload.data || { message: action.payload.message };
            return { ...state, feedback: { feedback: {}, error, loading: false } };
        case FETCH_FEEDBACK_RESET:
            return { ...state, feedback: { feedback: {}, error: null, loading: false } };

        case EDIT_FEEDBACK:
            return { ...state, feedback: { error: null, loading: true } };
        case EDIT_FEEDBACK_SUCCESS:
            return { ...state, feedback: { feedback: action.payload.data, error: null, loading: true } };
        case EDIT_FEEDBACK_FAILURE:
            error = action.payload.data || { message: action.payload.message };
            return { ...state, feedback: { error, loading: false } };

    default:
        return state;
    }
}
