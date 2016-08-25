/*
  FeedbackFormPerson
  <FeedbackFormPerson/>
*/

import React from 'react';
import { Link } from 'react-router';

var FeedbackFormPerson = React.createClass({

    // Set contextType for route to be able to go back and forth in History.
    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },

    componentWillMount() {
        this.props.fetchFeedbackAsSender();
    },

    saveFeedback() {
        // const personalFeedbackQuestion = this.refs.personalFeedbackQuestion.value;
        // const personalFeedbackAnswer = this.refs.personalFeedbackAnswer.value;
        // const { feedbackId } = this.props.params;
        // const { feedbackPositives, feedbackImprovements } = this.props.addFeedback;
        //
        // this.props.saveFeedback(feedbackId, feedbackPositives, feedbackImprovements, personalFeedbackQuestion, personalFeedbackAnswer);
    },

    render() {
        const { feedback, loading, error } = this.props.as_sender_data;
        let incomplete = [];

        Object.keys(feedback).map((key) => {
            if (feedback[key].status === 'incomplete') {
                incomplete.push(feedback[key]);
            }
        });

        if (!incomplete.length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing"></div>
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Feedback geven</li>
                                <li>Feedback op persoon</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback op persoon</h2>

                        <div className="feedback-form--wrapper">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const postIndex = incomplete.findIndex((post) => post.id === parseInt(this.props.params.personId, 0));

        let person = incomplete[postIndex];

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback geven</li>
                            <li>Feedback op persoon</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback op persoon</h2>

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Persoon</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Persoon">
                                        { person.name }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label>Als { person.name } een auto zou zijn wat voor auto zou hij dan zijn?</label>
                                <textarea ref="personalFeedbackQuestion" rows="5"></textarea>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label>Waarom vind je dat?</label>
                                <textarea ref="personalFeedbackAnswer" rows="5"></textarea>
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral"><i className="fa fa-chevron-left"></i> Terug naar overzicht</Link>
                    <a onClick={this.handleSubmit} className="action--button is-right">Opslaan</a>
                </div>
            </div>
        );
    },
});

export default FeedbackFormPerson;
