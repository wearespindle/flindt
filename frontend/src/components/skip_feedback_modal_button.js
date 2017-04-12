import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showSkipFeedbackModal } from '../actions/modal';

const SkipFeedbackModalButton = (props) => (
    <a className="action--button neutral skip--button is-right" onClick={() => props.showSkipFeedbackModal()} >
        Skip this feedback
    </a>
);


SkipFeedbackModalButton.propTypes = {
    showSkipFeedbackModal: React.PropTypes.func,
};

export default connect(null, {showSkipFeedbackModal})(SkipFeedbackModalButton);
