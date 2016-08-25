/*
  FeedbackList
  <FeedbackList />
*/

import React from 'react';
import FeedbackRow from '../FeedbackRow';

var FeedbackList = React.createClass({
    componentWillMount() {
        this.props.fetchFeedbackAsSender();
    },

    render() {
        const { feedback, loading, error } = this.props.as_sender_data;
        let complete = [];
        let incomplete = [];

        Object.keys(feedback).map((key) => {
            if (feedback[key].status === 'complete') {
                complete.push(feedback[key]);
            }

            if (feedback[key].status === 'incomplete') {
                incomplete.push(feedback[key]);
            }
        });


        if (loading || !complete.length || !incomplete.length) {
            return (
                <div>
                    <h2>Loading...</h2>
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                </div>
            );
        }

        let numberOfIncompletedRequests = Object.keys(incomplete).length;
        let numberOfCompletedRequests = Object.keys(complete).length;

        return (
            <div>
                <div className="feedbacklist--wrapper">
                    <h2>Openstaande verzoeken ({numberOfIncompletedRequests})</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Persoon</th>
                                <th>Rol</th>
                                <th>Cirkel</th>
                                <th>Sluitingsdatum</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(incomplete).map((key) => {
                                    return <FeedbackRow key={incomplete[key].id} index={key} feedbackType="give" details={incomplete[key]}/>;
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="feedbacklist--wrapper">
                    <h2>Gegeven Feedback ({numberOfCompletedRequests})</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Persoon</th>
                                <th>Rol</th>
                                <th>Cirkel</th>
                                <th>Gegeven op</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(complete).map((key) => {
                                    return <FeedbackRow key={complete[key].id} index={key} details={complete[key]}/>;
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },
});

export default FeedbackList;
