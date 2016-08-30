import {
    FETCH_FEEDBACK_AS_SENDER,
    FETCH_FEEDBACK_AS_SENDER_SUCCESS,
    FETCH_FEEDBACK_AS_SENDER_FAILURE,
    RESET_FETCH_FEEDBACK_AS_SENDER,
    CREATE_FEEDBACK,
    CREATE_FEEDBACK_SUCCESS,
    CREATE_FEEDBACK_FAILURE,
    RESET_CREATE_FEEDBACK,
} from '../actions/FetchFeedbackAsSender';

const INITIAL_STATE = {
    data: { feedback: [], error: null, loading: false },
};

export default function(state = INITIAL_STATE, action) {
    let error,
        i;
    switch (action.type) {

    case FETCH_FEEDBACK_AS_SENDER:
        return { ...state, data: {feedback: [], error: null, loading: true} };
    case FETCH_FEEDBACK_AS_SENDER_SUCCESS:
        return { ...state, data: {feedback: action.payload.data, error: null, loading: false} };
    case FETCH_FEEDBACK_AS_SENDER_FAILURE:
        error = action.payload.data || {message: action.payload.message};
        return { ...state, data: {feedback: [], error, loading: false} };
    case RESET_FETCH_FEEDBACK_AS_SENDER:
        return { ...state, data: {feedback: [], error: null, loading: false} };
    case CREATE_FEEDBACK:
        return { ...state, data: {feedback: [], error: null, loading: true} };
    case CREATE_FEEDBACK_SUCCESS:
        i = action.payload.data.postIndex;
        // Because we can never assign anything directly in the state, we need
        // to create a new array, with everything except the one we're changing
        // we change that one and assign it back.
        return Object.assign({}, state, { data: {
            feedback: state.data.feedback.map((item, index) => {
                if (index === action.payload.data.postIndex) {
                    return Object.assign({}, item, {
                        status: 'complete',
                    });
                }
                return item;
            }),
        }});
    case CREATE_FEEDBACK_FAILURE:
        error = action.payload.data || {message: action.payload.message};
        return { ...state, data: {feedback: [], error, loading: false} };
    case RESET_CREATE_FEEDBACK:
        return { ...state, data: {feedback: [], error: null, loading: true }};

    default:
        return state;
    }
}
