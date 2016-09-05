import {
    USER_LOGIN,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,
} from '../actions/User';

const INITIAL_STATE = {
    data: { user: {}, loggedIn: false, error: null, loading: false },
    userdata: { data: null, error: null },
};

export default function(state = INITIAL_STATE, action) {
    let error,
        i;
    switch (action.type) {

    case USER_LOGIN:
        return { ...state, data: {user: {}, loggedIn: false, error: null, loading: true}, userdata: { data: null } };
    case USER_LOGIN_SUCCESS:
        return { ...state, data: {user: action.payload, loggedIn: true, error: null, loading: false}, userdata: { data: null } };
    case USER_LOGIN_FAILURE:
        error = action.payload || {message: action.payload.statusText};
        return { ...state, data: {user: {}, user_meta: {}, loggedIn: false, error, loading: false}, userdata: { data: null } };

    case GET_USER_DATA:
        return { ...state, userdata: { data: null } };
    case GET_USER_DATA_SUCCESS:
        return { ...state, userdata: { data: action.payload } };
    case GET_USER_DATA_FAILURE:
        error = action.payload || {message: action.payload.statusText};
        return { ...state, userdata: { data: null, error} };

    default:
        return state;
    }
}
