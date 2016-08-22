/*
  Home
  <Home/>
*/

import React from 'react';
import FeedbackRow from './FeedbackRow';

var Home = React.createClass({

    renderFeedbackRow(key) {
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
                            {Object.keys(this.props.feedbackPeople).map(this.renderFeedbackRow)}
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
                            <tr>
                                <td data-label="Persoon">Erwin</td>
                                <td data-label="Rol">Planner voor VoIPGRID</td>
                                <td data-label="Cirkel">VoIPGRID</td>
                                <td data-label="Gegeven op">1 sept. 2016</td>
                                <td data-label="Acties"><a href="receive-feedback.html"><i className="fa fa-eye"></i> Feedback bekijken</a></td>
                            </tr>
                            <tr>
                                <td data-label="Persoon">Erwin</td>
                                <td data-label="Rol">Planner voor VoIPGRID</td>
                                <td data-label="Cirkel">VoIPGRID</td>
                                <td data-label="Gegeven op">1 sept. 2016</td>
                                <td data-label="Acties"><a href="receive-feedback.html"><i className="fa fa-eye"></i> Feedback bekijken</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },
});

export default Home;
