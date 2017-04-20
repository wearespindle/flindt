import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import { fetchFeedbackAsSender } from '../actions/feedback';
import FeedbackRow from '../components/feedback_row';
import Header from '../components/header';

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
                        <Header />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Give feedback</li>
                            </ul>
                        </div>
                    </div>

                    {
                        this.props.loading &&
                        <div className="content">
                            <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </div>
                    }
                    {
                        !this.props.loading &&
                        <div className="content is-text-center has-margin-top-100">
                            <h3>Unfortunately there are currently no feedback requests for you!</h3>
                            <div className="content--no-feedback" />
                        </div>
                    }
                </div>
            );
        }

        let complete = [];
        let incomplete = [];
        let skipped = [];

        this.props.feedback.map((feedbackObject) => {
            if (feedbackObject.status === 0) {
                incomplete.push(feedbackObject);
            } else if (feedbackObject.status === 2) {
                skipped.push(feedbackObject);
            } else {
                complete.push(feedbackObject);
            }

            return null;
        });

        const numberOfIncompletedRequests = Object.keys(incomplete).length;
        const numberOfCompletedRequests = Object.keys(complete).length;
        const numberOfSkippedRequests = Object.keys(skipped).length;

        // Set to four to only show 4 complete objects.
        complete.length = 4;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <Header />
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
                                    <th>Requested on</th>
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
                        <h2>Latest given feedback</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>Person</th>
                                    <th>Role</th>
                                    <th>Circle</th>
                                    <th>Given on</th>
                                    <th>Rated</th>
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
                                          completed
                                        />
                                    )
                                }
                            </tbody>
                        </table>
                        <Link to="/give-feedback/archive" className="action--button neutral is-right">
                            <i className="fa fa-archive" /> View all given feedback
                        </Link>

                    </div>

                    { skipped.length > 0 &&
                        <div className="feedbacklist--wrapper">
                            <h2>Skipped feedback ({numberOfSkippedRequests})</h2>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Person</th>
                                        <th>Role</th>
                                        <th>Circle</th>
                                        <th>Skipped on</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        skipped.map((completeObject) =>
                                            <FeedbackRow
                                              key={completeObject.id}
                                              index={completeObject.id}
                                              details={completeObject}
                                              skipped
                                            />
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback_as_sender.feedback,
    loading: state.Feedback.feedback_as_sender.loading,
    user: state.User.data,
    user_data: state.User.user_data,
});

GiveFeedbackList.propTypes = {
    feedback: React.PropTypes.array,
    fetchFeedbackAsSender: React.PropTypes.func,
    user: React.PropTypes.object,
    loading: React.PropTypes.bool,
};

export default connect(mapStateToProps, {fetchFeedbackAsSender})(GiveFeedbackList);
