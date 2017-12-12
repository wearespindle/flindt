import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import Notifications from 'react-notification-system-redux';
import history from '../utils/history';
import FeedbackContent from '../components/ReceivedFeedbackContent';
import Header from '../components/Header';
import {
  cleanFeedback,
  editFeedback,
  fetchFeedback
} from '../actions/feedback';

const moment = require('moment');

// renderField component for reduxForms.
const renderInput = ({ input, meta: { touched, error }, ...props }) => (
  <span>
    <input {...input} {...props} />
  </span>
);

renderInput.propTypes = {
  input: propTypes.object,
  meta: propTypes.object,
  type: propTypes.string
};

const renderTextArea = ({ input, meta: { touched, error } }) => (
  <div>
    <textarea {...input} rows="5" />
    {touched && error && <span className="label--alert">{error}</span>}
  </div>
);

renderTextArea.propTypes = {
  input: propTypes.object,
  meta: propTypes.object
};

let ReceivedFeedbackClass = class ReceivedFeedback extends React.Component {
  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);

    this.state = {
      id: this.props.match.params.feedbackId
    };
  }

  componentWillMount() {
    let accessToken = this.props.user.user.access_token;

    this.props
      .fetchFeedback(accessToken, this.props.match.params.feedbackId)
      .then(response => {
        if (response.payload.status === 200) {
          const {
            how_recognizable,
            how_valuable,
            actionable,
            actionable_content
          } = response.payload.data;
          // eslint-disable-next-line camelcase
          this.props.change('how_recognizable', how_recognizable || 6);
          // eslint-disable-next-line camelcase
          this.props.change('how_valuable', how_valuable || 6);
          this.props.change('actionable', actionable ? 'true' : 'false');
          this.props.change('actionable_content', actionable_content);
        }
      });
  }

  componentWillUnmount() {
    this.props.cleanFeedback();
  }

  _handleSubmit(values) {
    const { how_recognizable, how_valuable, actionable } = values;
    const accessToken = this.props.user.user.access_token;
    const { id } = this.state;

    // Get this value separately, because values doesn't contain empty fields so if you
    // empty a field after having posted one before, it doesn't update.
    const actionableContent = values.actionable_content || '';

    this.props
      .editFeedback(
        {
          id,
          actionable,
          how_recognizable,
          how_valuable,
          actionable_content: actionableContent
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
              message: 'Your feedback is succesfully saved! Thanks!',
              position: 'tr',
              autoDismiss: 2
            })
          );

          // Send the user back to his feedback overview after a succesful action.
          history.push('/received-feedback');
        }
      });
  }

  render() {
    const { feedback } = this.props.feedback;

    if (!feedback.recipient) {
      return (
        <div className="content--wrapper">
          <div className="content--header">
            <Header />
            <div className="content--header-breadcrumbs">
              <ul>
                <li>Received feedback</li>
                <li>Received</li>
              </ul>
            </div>
          </div>

          <div className="content">
            <h2>Received feedback</h2>

            <div className="feedback-form--wrapper">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    let isEditable;

    let person = feedback.sender;
    let receiver = feedback.recipient;
    const { handleSubmit, rangeValues } = this.props;

    if (feedback.round) {
      // Round isn't a required field, so only check for end date if there's a round.
      isEditable = moment().isBefore(moment(feedback.round.end_date));
    } else {
      // Otherwise disable editing if feedback was completed more than a week ago.
      isEditable = moment(feedback.date)
        .add('7', 'days')
        .isAfter(moment());
    }

    return (
      <div className="content--wrapper">
        <div className="content--header">
          <Header />
          <div className="content--header-breadcrumbs">
            <ul>
              <li>Received feedback</li>
              <li>Feedback from {person.first_name}</li>
            </ul>
          </div>
        </div>

        <div className="content">
          <h2>Received feedback</h2>

          {!isEditable && (
            <div className="label--neutral">
              <i className="fa fa-info-circle" />
              The round has been closed, this means you can&apos;t edit your
              feedback anymore.
            </div>
          )}

          <div className="feedback-form--wrapper">
            <FeedbackContent
              {...this.props}
              person={person}
              receiver={receiver}
              feedback={feedback}
            />

            <div className="feedback-form--row padding-bottom-0">
              <div className="feedback-form--form">
                <form onSubmit={handleSubmit(this._handleSubmit)}>
                  <div className="feedback-form--row">
                    <div>
                      <strong>
                        How valuable is the feedback you received from{' '}
                        {person.first_name}?
                      </strong>

                      {isEditable && (
                        <div>
                          <Field
                            name="how_valuable"
                            component={renderInput}
                            className="feedback-form--range"
                            type="range"
                            step="1"
                            min="1"
                            max="10"
                          />
                          <ul className="range-input-list">
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                            <li>6</li>
                            <li>7</li>
                            <li>8</li>
                            <li>9</li>
                            <li>10</li>
                          </ul>

                          <div className="range-input-list-output">
                            Grade: <span>{rangeValues.how_valuable}</span>
                          </div>
                        </div>
                      )}

                      {!isEditable && (
                        <div>
                          <div className="feedback-form--finalgrade">
                            <div
                              style={{
                                width: `${feedback.how_valuable * 10}%`
                              }}
                            />
                          </div>

                          <span>{feedback.how_valuable} / 10</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="feedback-form--row">
                    <div>
                      <strong>
                        How recognizable is the feedback you received from{' '}
                        {person.first_name}?
                      </strong>

                      {isEditable && (
                        <div>
                          <Field
                            name="how_recognizable"
                            component={renderInput}
                            className="feedback-form--range"
                            type="range"
                            step="1"
                            min="1"
                            max="10"
                          />
                          <ul className="range-input-list">
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                            <li>6</li>
                            <li>7</li>
                            <li>8</li>
                            <li>9</li>
                            <li>10</li>
                          </ul>

                          <div className="range-input-list-output">
                            Grade: <span>{rangeValues.how_recognizable}</span>
                          </div>
                        </div>
                      )}

                      {!isEditable && (
                        <div>
                          <div className="feedback-form--finalgrade">
                            <div
                              style={{
                                width: `${feedback.how_recognizable * 10}%`
                              }}
                            />
                          </div>

                          <span>{feedback.how_recognizable} / 10</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="feedback-form--row">
                    <div>
                      <strong>
                        Are you planning on doing anything with this feedback?
                      </strong>
                      {isEditable && (
                        <div>
                          <ul className="feedback--form-radiolist">
                            <li>
                              <Field
                                name="actionable"
                                component={renderInput}
                                type="radio"
                                id="yes"
                                value="true"
                              />
                              <label htmlFor="yes">Yes, because</label>
                            </li>
                            <li>
                              <Field
                                name="actionable"
                                component={renderInput}
                                type="radio"
                                id="no"
                                value="false"
                              />
                              <label htmlFor="no">No</label>
                            </li>
                          </ul>

                          <Field
                            name="actionable_content"
                            component={renderTextArea}
                          />
                        </div>
                      )}

                      {!isEditable && (
                        <div>
                          <p>{feedback.actionable ? 'Yes' : 'No'}</p>
                          {feedback.actionable_content && (
                            <div>
                              <strong>Reason:</strong>
                              <p>{feedback.actionable_content}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/received-feedback/"
                    className="action--button neutral"
                  >
                    <i className="fa fa-chevron-left" /> Back to overview
                  </Link>

                  {isEditable && (
                    <button className="action--button is-right" type="submit">
                      Save
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const selector = formValueSelector('GivePersonalFeedbackForm');

const mapStateToProps = state => ({
  feedback: state.Feedback.feedback,
  user: state.User.data,
  user_data: state.User.user_data,
  question: state.Question,
  // Set values on state to show them on mobile, when the range input has a
  // limited UI.
  rangeValues: selector(state, 'how_valuable', 'how_recognizable')
});

// reduxForm validate function.
function validate(values) {
  const errors = {};

  if (values.actionable === 'true' && !values.actionable_content) {
    errors.actionable_content =
      'Please fill what you want to do with this feedback';
  }

  return errors;
}

ReceivedFeedbackClass.propTypes = {
  change: propTypes.func,
  cleanFeedback: propTypes.func,
  dispatch: propTypes.func,
  editFeedback: propTypes.func,
  feedback: propTypes.object,
  fetchFeedback: propTypes.func,
  handleSubmit: propTypes.func,
  params: propTypes.object,
  rangeValues: propTypes.object,
  user: propTypes.object
};

ReceivedFeedbackClass.contextTypes = {
  router: propTypes.object
};

// Connect reduxForm to our class.
ReceivedFeedbackClass = reduxForm({
  form: 'GivePersonalFeedbackForm',
  validate
})(ReceivedFeedbackClass);

export default connect(mapStateToProps, {
  cleanFeedback,
  editFeedback,
  fetchFeedback
})(ReceivedFeedbackClass);
