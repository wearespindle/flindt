import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Notifications from 'react-notification-system-redux';

import { hideModal } from '../actions/modal';
import { editFeedback} from '../actions/feedback';

class SkipFeedbackModal extends Component {

    constructor(props) {
        super(props);

        this.skipFeedback = this.skipFeedback.bind(this);
    }

    skipFeedback() {
        const feedbackId = this.props.params.feedbackId;
        const accessToken = this.props.user.user.access_token;

        this.props.editFeedback({
            id: feedbackId,
            status: 2,
        }, accessToken).then((response) => {
            let data = response.payload.data;

            if (response.payload.status !== 200) {
                this.props.dispatch(Notifications.error({
                    title: 'Error!',
                    message: 'Something went wrong while saving the data!',
                    position: 'tr',
                    autoDismiss: 2,
                }));
            } else {
                this.props.dispatch(Notifications.success({
                    title: 'Sweet success!',
                    message: 'Feedback succesfully saved! Thanks!',
                    position: 'tr',
                    autoDismiss: 2,
                }));

                this.props.hideModal();

                // Send the user back to his feedback overview after a succesful action.
                this.context.router.push('/give-feedback/');
            }
        });
    }

    render() {
        if (!this.props.isOpen) {
            return null;
        }

        return (
            <div>
                <div className="modal--wrapper show">
                    <a onClick={() => this.props.hideModal()} className="modal--close">
                        <i className="fa fa-close" />
                    </a>

                    <h2>Are you sure?</h2>

                    <div className="modal--content">
                        <p>The general idea is that people are aware of other roles in the circles they are in.
                        This means we expect people to be able to give feedback to those roles as well.</p>

                        <p>If you cannot give feedback in any way, this is a good moment to think about your
                        or their presence in the circle. Saying something about this is also feedback.</p>

                        <a className="action--button neutral" onClick={() => this.props.hideModal()} >Give feedback</a>
                        <a className="action--button has-padding-right-10 is-right" onClick={this.skipFeedback}>Skip feedback</a>

                    </div>
                </div>
                <div className="overlay show" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.User.data,
});


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        editFeedback,
        hideModal,
        dispatch,
    }, dispatch);
}


SkipFeedbackModal.contextTypes = {
    router: propTypes.object,
};

SkipFeedbackModal.propTypes = {
    hideModal: propTypes.func,
    isOpen: propTypes.bool,
    editFeedback: propTypes.func,
    dispatch: propTypes.func,
    user: propTypes.object,
    params: propTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(SkipFeedbackModal);
