/*
  ReceivedFeedback
  <ReceivedFeedback/>
*/

import React from 'react';
import Time from 'react-time';
import { Link } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, SubmissionError, getFormValues } from 'redux-form';

import Notifications from 'react-notification-system-redux';

import FeedbackContent from '../components/received_feedback_content';

import { fetchFeedback, editFeedback } from '../actions/feedback';

// renderField component for reduxForms.
const renderInput = ({ input, meta: { touched, error }, ...props }) => (
    <span>
        <input {...input} {...props} />
    </span>
);

renderInput.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    type: React.PropTypes.string,
};

const renderTextArea = ({ input, meta: { touched, error } }) => (
    <div>
        <textarea {...input} rows="5" />
        {touched && error && <span className="label--alert">{error}</span>}
    </div>
);

renderTextArea.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
};


let ReceivedFeedbackClass = class ReceivedFeedback extends React.Component {
    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);

        this.state = {
            id: this.props.params.feedbackId,
        };
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId).then((response) => {
            if (response.payload.status === 200) {
                const { how_recognizable, how_valuable, actionable, actionable_content } = response.payload.data;
                this.props.change('how_recognizable', how_recognizable);
                this.props.change('how_valuable', how_valuable);
                this.props.change('actionable', actionable ? 'true' : 'false');
                this.props.change('actionable_content', actionable_content);
            }
        });
    }

    _handleSubmit(values) {
        const { how_recognizable, how_valuable, actionable } = values;
        const accessToken = this.props.user.user.access_token;
        const { id } = this.state;

        // Get this value separately, because values doesn't contain empty fields so if you
        // empty a field after having posted one before, it doesn't update.
        const actionableContent = values.actionable_content || '';

        this.props.editFeedback({
            id,
            actionable,
            how_recognizable,
            how_valuable,
            actionable_content: actionableContent,
        }, accessToken).then((response) => {
            let data = response.payload.data;
            if (response.payload.status !== 200) {
                this.props.dispatch(Notifications.error({
                    title: 'Error! 😱😪',
                    message: 'Something went wrong while saving the data!',
                    position: 'tr',
                    autoDismiss: 4,
                }));
            } else {
                this.props.dispatch(Notifications.success({
                    title: 'Sweet Success! 💪🏼😁',
                    message: 'Your feedback is succesfully saved! Thanks!',
                    position: 'tr',
                    autoDismiss: 4,
                }));

                // Send the user back to his feedback overview after a succesful action.
                this.context.router.push('/received-feedback/');
            }
        });
    }

    render() {
        const { feedback } = this.props.feedback;

        if (!feedback.recipient) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
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

        let table;
        let person = feedback.sender;
        let receiver = feedback.recipient;
        const { handleSubmit } = this.props;
        const accessToken = this.props.user.user.access_token;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Received feedback</li>
                            <li>Feedback from {person.first_name}</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Received feedback</h2>

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
                                        <div className="l-48">
                                            <h3>How valuable is the feedback you received from {person.first_name}?</h3>
                                            <Field
                                              name="how_valuable"
                                              component={renderInput}
                                              className="feedback-form--range"
                                              type="range"
                                              step="1" min="1" max="10"
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
                                        </div>
                                    </div>

                                    <div className="feedback-form--row">
                                        <div className="l-48">
                                            <h3>
                                                How recognizable is the feedback you received from {person.first_name}?
                                            </h3>
                                            <Field
                                              name="how_recognizable"
                                              component={renderInput}
                                              className="feedback-form--range"
                                              type="range"
                                              step="1" min="1" max="10"
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
                                        </div>
                                    </div>

                                    <div className="feedback-form--row">
                                        <div className="l-48">
                                            <h3>Are you planning on doing anything with this feedback?</h3>

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

                                            <Field name="actionable_content" component={renderTextArea} />
                                        </div>
                                    </div>

                                    <Link to="/" className="action--button neutral">
                                        <i className="fa fa-chevron-left" /> Back to overview
                                    </Link>
                                    <button className="action--button is-right" type="submit">Save</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback,
    user: state.User.data,
    user_data: state.User.user_data,
    question: state.Question,
});

// reduxForm validate function.
function validate(values) {
    const errors = {};

    if (values.actionable === 'true' && !values.actionable_content) {
        errors.actionable_content = 'Please fill what you want to do with this feedback';
    }

    return errors;
}

ReceivedFeedbackClass.propTypes = {
    change: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    editFeedback: React.PropTypes.func,
    feedback: React.PropTypes.object,
    fetchFeedback: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    params: React.PropTypes.object,
    user: React.PropTypes.object,
};

ReceivedFeedbackClass.contextTypes = {
    router: React.PropTypes.object,
};

// Connect reduxForm to our class.
ReceivedFeedbackClass = reduxForm({
    form: 'GivePersonalFeedbackForm',
    validate,
})(ReceivedFeedbackClass);

export default connect(mapStateToProps, {editFeedback, fetchFeedback})(ReceivedFeedbackClass);
