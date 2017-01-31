import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import { fetchFeedbackAsReceiver } from '../actions/feedback';
import FeedbackRow from '../components/feedback_row';

class ReceivedFeedbackList extends Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;
        this.props.fetchFeedbackAsReceiver(accessToken);
    }

    render() {
        if (!this.props.feedback.length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Received feedback</li>
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

        let feedback = this.props.feedback;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    feedback.filter((feedbackObject) =>
                                        // Only display completed feedback.
                                        feedbackObject.status === 1
                                    ).map((feedbackObject) =>
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
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback_as_receiver.feedback,
    user: state.User.data,
    user_data: state.User.user_data,
});

ReceivedFeedbackList.propTypes = {
    feedback: React.PropTypes.array,
    fetchFeedbackAsReceiver: React.PropTypes.func,
    user: React.PropTypes.object,
};

export default connect(mapStateToProps, {fetchFeedbackAsReceiver})(ReceivedFeedbackList);
