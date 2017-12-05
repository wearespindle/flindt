import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import { showRoleModal } from '../actions/modal';

const ModalButton = props => (
  <a onClick={() => props.showRoleModal(props.accessToken, props.role)}>
    {props.children}
    <i className="fa fa-info-circle" />
  </a>
);

ModalButton.propTypes = {
  accessToken: propTypes.string,
  role: propTypes.number,
  showRoleModal: propTypes.func,
  children: propTypes.string
};

export default connect(null, { showRoleModal })(ModalButton);
