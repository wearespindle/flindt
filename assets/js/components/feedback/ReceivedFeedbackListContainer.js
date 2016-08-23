/*
  ReceivedFeedbackListContainer
  <ReceivedFeedbackListContainer />
*/

import React from 'react';
import FeedbackRow from './FeedbackRow';

var ReceivedFeedbackListContainer = React.createClass({
    render() {
        return (
            <div>
                <h2>Ontvangen feedback</h2>

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
                            Object.keys(this.props.feedbackReceived).map((key) => {
                                return <FeedbackRow key={key} index={key} details={this.props.feedbackReceived[key]}/>;
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    },
});

export default ReceivedFeedbackListContainer;
