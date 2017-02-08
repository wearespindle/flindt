import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cleanFeedback, fetchFeedback } from '../actions/feedback';

const moment = require('moment');

class CheckPersonalFeedback extends React.Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);

        this.state = {
            id: this.props.params.feedbackId,
        };
    }

    componentWillUnmount() {
        this.props.cleanFeedback();
    }

    render() {
        const { feedback } = this.props.feedback;

        if (!Object.keys(feedback).length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Check feedback</li>
                                <li>Personal feedback</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback on </h2>

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

        let person = feedback.recipient;

        let isEditable;

        if (feedback.round) {
            // Round isn't a required field, so only check for end date if there's a round.
            isEditable = moment().isBefore(moment(feedback.round.end_date));
        } else {
            // Otherwise disable editing if feedback was completed more than a week ago.
            isEditable = moment(feedback.date).add('7', 'days').isAfter(moment());
        }

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Check feedback</li>
                            <li>Personal feedback</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback on { person.first_name }</h2>

                    { !isEditable &&
                        <div className="label--neutral">
                            <i className="fa fa-info-circle" />
                            The round has been closed, this means you can&apos;t edit your feedback anymore.
                        </div>
                    }

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Person</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Person">
                                        { person.first_name } { person.last_name}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="feedback-form--row">
                            <div className="feedback-form--answer-container">
                                <strong>
                                    { feedback.individual.question.content }
                                </strong>

                                <div className="feedback-form--answer">
                                    <p>{feedback.individual.answer}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link to="/give-feedback" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Back to overview
                    </Link>

                    { isEditable &&
                        <Link to={`/give-feedback/personal/${this.state.id}/edit`} className="action--button is-right">
                            Edit feedback
                        </Link>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback,
    user: state.User.data,
    user_data: state.User.user_data,
    question: state.Question,
    Notifications: state.Notifications,
});

CheckPersonalFeedback.propTypes = {
    cleanFeedback: React.PropTypes.func,
    feedback: React.PropTypes.object,
    fetchFeedback: React.PropTypes.func,
    params: React.PropTypes.object,
    user: React.PropTypes.object,
};

export default connect(mapStateToProps, {cleanFeedback, fetchFeedback})(CheckPersonalFeedback);
