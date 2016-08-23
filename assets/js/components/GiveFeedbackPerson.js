/*
  GiveFeedbackPerson
  <GiveFeedbackPerson/>
*/

import React from 'react';

var GiveFeedbackPerson = React.createClass({

    // Set contextType for route to be able to go back and forth in History.
    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        const postIndex = this.props.feedbackPeople.findIndex((post) => post.id === parseInt(this.props.params.feedbackId, 0));
        return {
            post: this.props.feedbackPeople[postIndex],
        };
    },

    saveFeedback() {
        const personalFeedbackQuestion = this.refs.personalFeedbackQuestion.value;
        const personalFeedbackAnswer = this.refs.personalFeedbackAnswer.value;
        const { feedbackId } = this.props.params;
        const { feedbackPositives, feedbackImprovements } = this.props.addFeedback;

        this.props.saveFeedback(feedbackId, feedbackPositives, feedbackImprovements, personalFeedbackQuestion, personalFeedbackAnswer);

        this.context.router.push('/');
    },

    render() {
        let person = this.state.post;

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

                    <a onClick={this.context.router.goBack} className="action--button neutral"><i className="fa fa-chevron-left"></i> Vorige</a>
                    <a onClick={this.saveFeedback} className="action--button is-right">Opslaan <i className="fa fa-chevron-right"></i></a>
                </div>
            </div>
        );
    },
});

export default GiveFeedbackPerson;
