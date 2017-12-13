import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchFeedbackAsReceiver } from '../actions/feedback';
import FeedbackRow from '../components/FeedbackRow';
import Header from '../components/header';

class ReceivedFeedbackList extends Component {
  componentWillMount() {
    this.get(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.get(nextProps, this.props);
  }

  get = (nextProps = {}, oldProps = {}) => {
    if (nextProps.access_token && !oldProps.access_token) {
      this.props.fetchFeedbackAsReceiver(nextProps.access_token);
    }
  };

  render() {
    if (!this.props.feedback.length) {
      return (
        <div className="content--wrapper">
          <div className="content--header">
            <Header />
            <div className="content--header-breadcrumbs">
              <ul>
                <li>Received feedback</li>
              </ul>
            </div>
          </div>

          {this.props.loading && (
            <div className="content">
              <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
              </div>
            </div>
          )}
          {!this.props.loading && (
            <div className="content is-text-center has-margin-top-100">
              <h3>Unfortunately nobody has given you feedback yet!</h3>
              <div className="content--no-feedback received" />
            </div>
          )}
        </div>
      );
    }

    let feedback = this.props.feedback;

    return (
      <div className="content--wrapper">
        <div className="content--header">
          <Header />
          <div className="content--header-breadcrumbs">
            <ul>
              <li>Received feedback</li>
            </ul>
          </div>
        </div>

        <div className="content">
          <div className="feedbacklist--wrapper">
            <h2>Received feedback</h2>

            <table>
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Role</th>
                  <th>Circle</th>
                  <th>Received on</th>
                  <th>Rated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback
                  .filter(
                    feedbackObject =>
                      // Only display completed feedback.
                      feedbackObject.status === 1
                  )
                  .map(feedbackObject => (
                    <FeedbackRow
                      key={feedbackObject.id}
                      index={feedbackObject.id}
                      feedbackType="received"
                      details={feedbackObject}
                      completed
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feedback: state.Feedback.feedback_as_receiver.feedback,
  access_token: state.User.data.user.access_token,
  loading: state.Feedback.feedback_as_receiver.loading,
  user: state.User.data,
  user_data: state.User.user_data
});

ReceivedFeedbackList.propTypes = {
  feedback: propTypes.array,
  fetchFeedbackAsReceiver: propTypes.func,
  user: propTypes.object,
  loading: propTypes.bool
};

export default connect(mapStateToProps, { fetchFeedbackAsReceiver })(ReceivedFeedbackList);
