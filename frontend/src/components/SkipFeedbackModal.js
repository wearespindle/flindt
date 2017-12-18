import React, { Component } from 'react';
import propTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Notifications from 'react-notification-system-redux';

import { matchPath } from 'react-router';

import history from '../utils/history';

import { hideModal } from '../actions/modal';
import { editFeedback } from '../actions/feedback';

// renderField component for reduxForms.
const renderField = ({ input, meta: { touched, error } }) => (
  <div>
    <textarea {...input} />
    {touched && error && <span className="label--alert">{error}</span>}
  </div>
);

renderField.propTypes = {
  input: propTypes.object,
  meta: propTypes.object
};

class SkipFeedbackModal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  // Close the modal when pressing escape.
  escFunction = e => {
    if (e.keyCode === 27) {
      this.props.hideModal();
    }
  };

  getFeedbackId() {
    const match = matchPath(history.location.pathname, {
      path: '/give-feedback/role/:feedbackId/new'
    });

    return match.params.feedbackId;
  }

  _handleSubmit = values => {
    const feedbackId = this.getFeedbackId();
    const accessToken = this.props.user.user.access_token;
    const skippedFeedbackReason = values.skippedFeedbackReason;

    this.props
      .editFeedback(
        {
          id: feedbackId,
          status: 2,
          skipped_feedback_reason: skippedFeedbackReason
        },
        accessToken
      )
      .then(response => {
        if (response.payload.status !== 200) {
          this.props.dispatch(
            Notifications.error({
              title: 'Error!',
              message: 'Something went wrong while saving the data!',
              position: 'tr',
              autoDismiss: 2
            })
          );
        } else {
          this.props.dispatch(
            Notifications.success({
              title: 'Sweet success!',
              message: 'Feedback succesfully saved! Thanks!',
              position: 'tr',
              autoDismiss: 2
            })
          );

          this.props.hideModal();

          // Send the user back to his feedback overview after a succesful action.
          history.push('/give-feedback');
        }
      });
  };

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const { handleSubmit } = this.props;

    return (
      <div>
        <div className="modal--wrapper show skip--feedback">
          <a onClick={() => this.props.hideModal()} className="modal--close">
            <i className="fa fa-close" />
          </a>

          <h2>Are you sure?</h2>

          <div className="modal--content">
            <p>
              The general idea is that people are aware of other roles in the
              circles they are in. This means we expect people to be able to
              give feedback to those roles as well.
            </p>

            <p>
              If you cannot give feedback in any way, this is a good moment to
              think about your or their presence in the circle. Saying something
              about this is also feedback.
            </p>

            <a
              className="action--button neutral"
              onClick={() => this.props.hideModal()}
            >
              Give feedback
            </a>

            <h2 className="no-padding-left">Skip</h2>

            <p>
              If it really impossible to give feedback, please tell why you
              can't give feedback.
            </p>

            <form onSubmit={handleSubmit(this._handleSubmit)}>
              <label htmlFor="skippedFeedbackReason">
                <strong>Reason</strong>
                <span className="is-required">*</span>
              </label>
              <Field name="skippedFeedbackReason" component={renderField} />

              <button
                className="action--button has-padding-right-10"
                type="submit"
              >
                Skip role feedback
              </button>
            </form>
          </div>
        </div>
        <div className="overlay show" />
      </div>
    );
  }
}

// reduxForm validate function.
function validate(values) {
  const errors = {};

  if (!values.skippedFeedbackReason) {
    errors.skippedFeedbackReason = 'Please fill in a reason';
  }

  return errors;
}

const mapStateToProps = state => ({
  user: state.User.data
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      editFeedback,
      hideModal,
      dispatch
    },
    dispatch
  );
}

SkipFeedbackModal.contextTypes = {
  router: propTypes.object
};

SkipFeedbackModal.propTypes = {
  hideModal: propTypes.func,
  isOpen: propTypes.bool,
  editFeedback: propTypes.func,
  dispatch: propTypes.func,
  user: propTypes.object,
  params: propTypes.object
};

// Connect reduxForm to our class.
SkipFeedbackModal = reduxForm({
  form: 'GivePersonalFeedbackForm',
  validate
})(SkipFeedbackModal);

export default connect(mapStateToProps, mapDispatchToProps)(SkipFeedbackModal);
