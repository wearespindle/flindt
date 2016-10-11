/*
  FeedbackList
  <FeedbackList />
*/

import React from 'react';
import FeedbackRow from '../FeedbackRow';

class FeedbackList extends React.Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedbackAsSender(accessToken);
    }

    render() {
        const { feedback, loading, error } = this.props.as_sender_data;

        let complete = [];
        let incomplete = [];

        feedback.map((feedbackObject) => {
            if (feedbackObject.status === 0) {
                incomplete.push(feedbackObject);
            } else {
                complete.push(feedbackObject);
            }

            return null;
        });

        if (loading) {
            return (
                <div>
                    <h2>Loading...</h2>
                    <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                    </div>
                </div>
            );
        }

        let numberOfIncompletedRequests = Object.keys(incomplete).length;
        let numberOfCompletedRequests = Object.keys(complete).length;

        return (
            <div>
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
        );
    }
}

FeedbackList.propTypes = {
    fetchFeedbackAsSender: React.PropTypes.func,
    as_sender_data: React.PropTypes.object,
    accessToken: React.PropTypes.string,
    user: React.PropTypes.object,
};

export default FeedbackList;
