import axios from 'axios';
import { API_URL } from '../constants/constants';

export const SHOW_ROLE_MODAL = 'SHOW_ROLE_MODAL';
export const SHOW_SKIP_FEEDBACK_MODAL = 'SHOW_SKIP_FEEDBACK_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

const ROOT_URL = `${API_URL}/api/v1`;

export function showRoleModal(accessToken, id) {
  const request = axios({
    method: 'GET',
    url: `${ROOT_URL}/roles/${id}/`,
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return {
    type: SHOW_ROLE_MODAL,
    payload: request
  };
}

export function showSkipFeedbackModal() {
  return {
    type: SHOW_SKIP_FEEDBACK_MODAL
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  };
}
