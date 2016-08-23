/*
  GiveFeedbackListContainer
  <GiveFeedbackListContainer />
*/

import React from 'react';
import FeedbackRow from './FeedbackRow';

var GiveFeedbackListContainer = React.createClass({
    render() {
        var numberOfFeedbackRequests = Object.keys(this.props.feedbackPeople).length;

        return (
            <div>
                <h2>Openstaande verzoeken ({numberOfFeedbackRequests})</h2>

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
                            Object.keys(this.props.feedbackPeople).map((key) => {
                                return <FeedbackRow key={key} index={key} feedbackType="give" details={this.props.feedbackPeople[key]}/>;
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    },
});

export default GiveFeedbackListContainer;
