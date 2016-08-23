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
        const { complete, incomplete } = feedback;

        if (loading || !complete) {
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

        return (
            <div>
                <h2>Openstaande verzoeken ()</h2>

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
                            Object.keys(complete).map((key) => {
                                return <FeedbackRow key={complete[key].id} index={key} feedbackType="give" details={complete[key]}/>;
                            })
                        }
                    </tbody>
                </table>

                <h2>Gegeven Feedback ()</h2>

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
                            Object.keys(incomplete).map((key) => {
                                return <FeedbackRow key={incomplete[key].id} index={key} details={incomplete[key]}/>;
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    },
});

export default FeedbackList;
