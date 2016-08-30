/*
  FeedbackFormPerson
  <FeedbackFormPerson/>
*/

import React from 'react';
import { Link } from 'react-router';


class FeedbackFormPerson extends React.Component {

    componentWillMount() {
        this.props.fetchFeedbackAsSender();
    }

    saveFeedback() {
        // const personalFeedbackQuestion = this.refs.personalFeedbackQuestion.value;
        // const personalFeedbackAnswer = this.refs.personalFeedbackAnswer.value;
        // const { feedbackId } = this.props.params;
        // const { feedbackPositives, feedbackImprovements } = this.props.addFeedback;
        //
        // this.props.saveFeedback(feedbackId, feedbackPositives, feedbackImprovements,
        // personalFeedbackQuestion, personalFeedbackAnswer);
    }

    render() {
        const { feedback, loading, error } = this.props.as_sender_data;
        let incomplete = [];

        Object.keys(feedback).map((key) => {
            if (feedback[key].status === 'incomplete') {
                incomplete.push(feedback[key]);
            }
            return null;
        });

        if (!incomplete.length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
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
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const postIndex = incomplete.findIndex((post) =>
            post.id === parseInt(this.props.params.personId, 0));

        let person = incomplete[postIndex];

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
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
                                <label htmlFor="personalFeedbackQuestion">
                                    Als { person.name } een auto zou zijn wat voor auto zou hij dan zijn?
                                </label>
                                <textarea id="personalFeedbackQuestion" rows="5" />
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label htmlFor="whyfeedback">Waarom vind je dat?</label>
                                <textarea id="whyfeedback" rows="5" />
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Terug naar overzicht
                    </Link>
                    <a onClick={this.handleSubmit} className="action--button is-right">Opslaan</a>
                </div>
            </div>
        );
    }
}

FeedbackFormPerson.propTypes = {
    fetchFeedbackAsSender: React.PropTypes.func,
    as_sender_data: React.PropTypes.object,
    params: React.PropTypes.object,
};

// Set contextType for route to be able to go back and forth in History.
FeedbackFormPerson.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

export default FeedbackFormPerson;
