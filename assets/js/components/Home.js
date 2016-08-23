/*
  Home
  <Home/>
*/

import React from 'react';
import FeedbackRow from './FeedbackRow';

var Home = React.createClass({

    renderFeedbackRow(key, type) {
        return <FeedbackRow key={key} index={key} details={this.props.feedbackPeople[key]}/>;
    },

    render() {
        var numberOfFeedbackRequests = Object.keys(this.props.feedbackPeople).length;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback geven</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
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

                    <h2>Gegeven feedback</h2>

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
            </div>
        );
    },
});

export default Home;
