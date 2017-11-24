import React from 'react';
import propTypes from 'prop-types';
import Time from 'react-time';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Header from '../components/Header';
import RatingRows from '../components/RatingRow';
import RoleModalButton from '../components/RoleModalButton';
import { cleanFeedback, fetchFeedback } from '../actions/feedback';

const moment = require('moment');

class CheckRoleFeedback extends React.Component {
  componentWillMount() {
    let accessToken = this.props.user.user.access_token;

    this.props.fetchFeedback(accessToken, this.props.params.feedbackId);

    this.state = {
      id: this.props.params.feedbackId
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
            <Header />
            <div className="content--header-breadcrumbs">
              <ul>
                <li>Check feedback</li>
                <li>Feedback on role</li>
              </ul>
            </div>
          </div>

          <div className="content">
            <h2>Feedback on the role </h2>

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
    let role = feedback.role.role;
    let isEditable, isRated;
    let closedReason = "The round has been closed, this means you can't edit your feedback anymore.";

    if (feedback.round) {
      // Round isn't a required field, so only check for end date if there's a round.
      isEditable = moment().isBefore(moment(feedback.round.end_date));
    } else {
      // Otherwise disable editing if feedback was completed more than a week ago.
      isEditable = moment(feedback.date)
        .add('7', 'days')
        .isAfter(moment());
    }

    if (feedback.how_recognizable && feedback.how_valuable) {
      isEditable = false;
      isRated = true;
      closedReason = 'Your feedback was rated and is not editable anymore.';
    }

    const accessToken = this.props.user.user.access_token;

    return (
      <div className="content--wrapper">
        <div className="content--header">
          <Header />
          <div className="content--header-breadcrumbs">
            <ul>
              <li>Check feedback</li>
              <li>Feedback on role</li>
            </ul>
          </div>
        </div>

        <div className="content">
          <h2>Feedback on the role {feedback.role.role.name}</h2>

          {!isEditable && (
            <div className="label--neutral">
              <i className="fa fa-info-circle" />
              {closedReason}
            </div>
          )}

          <div className="feedback-form--wrapper">
            <table className="feedback-form--meta">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Circle</th>
                  <th>Given on</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Person">
                    {person.first_name} {person.last_name}
                  </td>
                  <td data-label="Role">
                    <RoleModalButton accessToken={accessToken} role={role.id}>
                      {role.name}
                    </RoleModalButton>
                  </td>
                  <td data-label="Circle">
                    {role.parent && (
                      <RoleModalButton accessToken={accessToken} role={role.parent.id}>
                        {role.parent.name}
                      </RoleModalButton>
                    )}
                  </td>
                  <td data-label="Received on">
                    <Time value={feedback.date} locale="EN" format="D MMMM YYYY" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <RatingRows remarks={feedback.role.remarks} />
            </div>

            {isRated && (
              <div className="feedback-form--row padding-bottom-0">
                <div className="rated-feedback-spacer" />
                <div className="feedback-form--form">
                  <div className="feedback-form--row">
                    <div className="feedback-content">
                      <h3>Rating</h3>
                      <strong>This is how recognizable {person.first_name} found your feedback.</strong>

                      <div className="feedback-form--finalgrade">
                        <div style={{ width: `${feedback.how_recognizable * 10}%` }} />
                      </div>

                      <span>{feedback.how_recognizable} / 10</span>
                    </div>
                  </div>

                  <div className="feedback-form--row">
                    <div className="feedback-content">
                      <strong>This is how valuable {person.first_name} found your feedback.</strong>

                      <div className="feedback-form--finalgrade">
                        <div style={{ width: `${feedback.how_valuable * 10}%` }} />
                      </div>

                      <span>{feedback.how_valuable} / 10</span>
                    </div>
                  </div>

                  <div className="feedback-form--row">
                    <div className="feedback-content">
                      <div>
                        <div>
                          <strong>
                            Does {person.first_name}
                            &nbsp;want to do something with your feedback?
                          </strong>
                          <p>{feedback.actionable ? 'Yes' : 'No'}</p>
                        </div>
                        {feedback.actionable_content && (
                          <div>
                            <strong>Reason:</strong>
                            <p>{feedback.actionable_content}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/give-feedback" className="action--button neutral">
            <i className="fa fa-chevron-left" /> Back to overview
          </Link>

          {isEditable && (
            <Link to={`/give-feedback/role/${this.state.id}/edit`} className="action--button is-right">
              Edit feedback
            </Link>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feedback: state.Feedback.feedback,
  user: state.User.data,
  user_data: state.User.user_data
});

CheckRoleFeedback.propTypes = {
  cleanFeedback: propTypes.func,
  feedback: propTypes.object,
  fetchFeedback: propTypes.func,
  user: propTypes.object,
  params: propTypes.object
};

export default connect(mapStateToProps, { cleanFeedback, fetchFeedback })(CheckRoleFeedback);
