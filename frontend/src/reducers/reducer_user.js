import {
  USER_LOGOUT,
  USER_LOGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  GET_USER_DATA,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE
} from '../actions/user';

const INITIAL_STATE = {
  loading: true,
  isAuthenticated: false,
  data: { user: {}, loggedIn: false, error: null, loading: true },
  userdata: { data: null, error: null }
};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case USER_LOGOUT:
      return {
        loading: false,
        isAuthenticated: false,
        data: { user: {}, loggedIn: false, error: null, loading: false },
        userdata: { data: null, error: null }
      };

    case USER_LOGIN:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
        data: { user: {}, loggedIn: false, error: null, loading: true },
        userdata: { data: null }
      };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
        data: {
          user: action.payload,
          loggedIn: true,
          error: null,
          loading: false
        },
        userdata: { data: null }
      };

    case USER_LOGIN_FAILURE:
      error = action.payload || { message: action.payload.statusText };
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        data: {
          user: {},
          user_meta: {},
          loggedIn: false,
          error,
          loading: false
        },
        userdata: { data: null }
      };

    case GET_USER_DATA:
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
        userdata: { data: null }
      };

    case GET_USER_DATA_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        userdata: { data: action.payload }
      };

    case GET_USER_DATA_FAILURE:
      error = action.payload || { message: action.payload.statusText };
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        userdata: { data: null, error }
      };

    default:
      return state;
  }
}
