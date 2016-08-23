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
                        
                    </tbody>
                </table>
            </div>
        );
    },
});

export default ReceivedFeedbackListContainer;
