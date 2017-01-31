import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import { fetchFeedbackAsSender } from '../actions/feedback';
import FeedbackRow from '../components/feedback_row';

class GiveFeedbackList extends Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;
        this.props.fetchFeedbackAsSender(accessToken);
    }

    render() {
        if (!this.props.feedback.length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Give feedback</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <div className="spinner">
                            <div className="bounce1" />
                            <div className="bounce2" />
                            <div className="bounce3" />
                        </div>
                    </div>
                </div>
            );
        }

        let complete = [];
        let incomplete = [];

        this.props.feedback.map((feedbackObject) => {
            if (feedbackObject.status === 0) {
                incomplete.push(feedbackObject);
            } else {
                complete.push(feedbackObject);
            }

            return null;
        });

        const numberOfIncompletedRequests = Object.keys(incomplete).length;
        const numberOfCompletedRequests = Object.keys(complete).length;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Give feedback</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <div className="feedbacklist--wrapper">
                        <h2>Incoming feedback requests ({numberOfIncompletedRequests})</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>Person</th>
                                    <th>Role</th>
                                    <th>Circle</th>
                                    <th>Closing date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                incomplete.map((incompleteObject) =>
                                    <FeedbackRow
                                      key={incompleteObject.id}
                                      index={incompleteObject.id}
                                      feedbackType="give"
                                      details={incompleteObject}
                                    />
                                )
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="feedbacklist--wrapper">
                        <h2>Given feedback ({numberOfCompletedRequests})</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>Person</th>
                                    <th>Role</th>
                                    <th>Circle</th>
                                    <th>Given on</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    complete.map((completeObject) =>
                                        <FeedbackRow
                                          key={completeObject.id}
                                          index={completeObject.id}
                                          details={completeObject}
                                        />
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback_as_sender.feedback,
    user: state.User.data,
    user_data: state.User.user_data,
});

GiveFeedbackList.propTypes = {
    feedback: React.PropTypes.array,
    fetchFeedbackAsSender: React.PropTypes.func,
    user: React.PropTypes.object,
};

export default connect(mapStateToProps, {fetchFeedbackAsSender})(GiveFeedbackList);
