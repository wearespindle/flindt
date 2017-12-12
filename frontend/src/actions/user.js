import axios from 'axios';
import { API_URL } from '../constants/constants';

export const USER_LOGOUT = 'USER_LOGOUT';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const GET_USER_DATA = 'GET_USER_DATA';
export const GET_USER_DATA_SUCCESS = 'GET_USER_DATA_SUCCESS';
export const GET_USER_DATA_FAILURE = 'GET_USER_DATA_FAILURE';

export const GET_BACKEND_TOKEN = 'GET_BACKEND_TOKEN';

export function userLogout() {
  return {
    type: USER_LOGOUT
  };
}

export function userLogin(googleToken) {
  const request = axios({
    method: 'post',
    url: `${API_URL}/api-social-auth/convert-token/`,
    data: {
      grant_type: 'convert_token',
      client_id: 'DsHaTowmFoOr3GQLOOoJaXQpViaV6NsIFzOVY3ME',
      backend: 'google-plus',
      token: googleToken
    }
  });

  return {
    type: USER_LOGIN,
    payload: request
  };
}

export function userLoginSuccess(results) {
  return {
    type: USER_LOGIN_SUCCESS,
    payload: results
  };
}

export function userLoginFailure(error) {
  return {
    type: USER_LOGIN_FAILURE,
    payload: error
  };
}

export function getUserData(token) {
  const request = axios({
    method: 'GET',
    url: `${API_URL}/api/v1/get_user_by_request/`,
    headers: { Authorization: `Bearer ${token}` }
  });

  return {
    type: GET_USER_DATA,
    payload: request
  };
}

export function getUserDataSuccess(results) {
  return {
    type: GET_USER_DATA_SUCCESS,
    payload: results
  };
}

export function getUserDataFailure(error) {
  return {
    type: GET_USER_DATA_FAILURE,
    payload: error
  };
}
