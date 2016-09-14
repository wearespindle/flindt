/*
  FeedbackList
  <FeedbackList />
*/

import React from 'react';
import FeedbackRow from '../FeedbackRow';

class FeedbackList extends React.Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedbackAsReceiver(accessToken);
    }

    render() {
        const { feedback, loading, error } = this.props.as_receiver_data;

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

        return (
            <div>
                <div className="feedbacklist--wrapper">
                    <h2>Ontvangen feedback</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Persoon</th>
                                <th>Rol</th>
                                <th>Cirkel</th>
                                <th>Gekregen op</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                feedback.filter((feedbackObject) => {
                                    // Only display completed feedback.
                                    return feedbackObject.status === 1;
                                }).map((feedbackObject) =>
                                    <FeedbackRow
                                        key={feedbackObject.id}
                                        index={feedbackObject.id}
                                        feedbackType="received"
                                        details={feedbackObject}
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
    fetchFeedbackAsReceiver: React.PropTypes.func,
    as_receiver_data: React.PropTypes.object,
    accessToken: React.PropTypes.string,
    user: React.PropTypes.object,
};

export default FeedbackList;
