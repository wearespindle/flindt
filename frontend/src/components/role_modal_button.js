import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showRoleModal } from '../actions/modal';

const ModalButton = (props) => (
    <a onClick={() => props.showRoleModal(props.accessToken, props.role)}>
        { props.children }
        <i className="fa fa-info-circle" />
    </a>
);

ModalButton.propTypes = {
    accessToken: React.PropTypes.string,
    role: React.PropTypes.number,
    showRoleModal: React.PropTypes.func,
    children: React.PropTypes.string,
};

export default connect(null, {showRoleModal})(ModalButton);
