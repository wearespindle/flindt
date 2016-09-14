/*
  FeedbackFormPersonal
  <FeedbackFormPersonal/>
*/

import React from 'react';
import { Link } from 'react-router';


class FeedbackFormPersonal extends React.Component {
    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);
        this._setAnswer = this._setAnswer.bind(this);

        this.state = {
            id: this.props.params.feedbackId,
            answer: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.feedback.loading) {
            return false;
        }

        const answer = nextProps.feedback.feedback.individual.answer;

        this.setState({
            answer,
        });

        return true;
    }

    _handleSubmit() {
        const { id, answer } = this.state;

        let accessToken = this.props.user.user.access_token;

        this.props.editFeedback({
            id,
            status: 1,
            individual: {answer},
        }, accessToken);
    }

    _setAnswer(event) {
        this.setState({
            answer: event.target.value,
        });
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);
    }

    render() {
        const { feedback, loading, error } = this.props.feedback;

        if (loading) {
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

        let person = feedback.recipient;

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
                                        {person.first_name} {person.last_name}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label htmlFor="personalFeedbackQuestion">
                                    Als {person.first_name} een auto zou zijn wat voor auto zou hij/zij dan zijn en waarom?
                                </label>
                                <textarea
                                    id="personalFeedbackQuestion"
                                    rows="5"
                                    onChange={this._setAnswer}
                                    value={this.state.answer}
                                />
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Terug naar overzicht
                    </Link>
                    <a onClick={this._handleSubmit} className="action--button is-right">Opslaan</a>
                </div>
            </div>
        );
    }
}

FeedbackFormPersonal.propTypes = {
    fetchFeedbackAsSender: React.PropTypes.func,
    as_sender_data: React.PropTypes.object,
    params: React.PropTypes.object,
};

// Set contextType for route to be able to go back and forth in History.
FeedbackFormPersonal.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

export default FeedbackFormPersonal;
