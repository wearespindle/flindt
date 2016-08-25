/*
  FeedbackFormGeneral
  <FeedbackFormGeneral/>
*/

import React from 'react';
import FeedbackRow from './FeedbackRow';
import { Link, History } from 'react-router';

var FeedbackFormGeneral = React.createClass({

    // Set contextType for route to be able to go back and forth in History.
    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },

    componentWillMount() {
        this.props.fetchFeedbackAsSender();
    },

    handleSubmit(postIndex) {
        let positiveFeedback = this.refs.positiveFeedback.value;
        let improvementFeedback = this.refs.improvementFeedback.value;
        this.props.createFeedback({positiveFeedback, improvementFeedback, postIndex});
    },

    openModal(roleId) {
        let info = {
            roleId,
        };

        this.props.showModal(info);
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
                                <li>Feedback op rollen</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback op rollen</h2>

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

        const postIndex = incomplete.findIndex((post) => post.id === parseInt(this.props.params.feedbackId, 0));

        let person = incomplete[postIndex];
        let circle, role;

        circle = person.circles[0];
        role = person.roles[0];

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback geven</li>
                            <li>Feedback op rollen</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback op rollen</h2>

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Persoon</th>
                                    <th>Rol</th>
                                    <th>Subcirkel</th>
                                    <th>Cirkel</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Persoon">
                                        { person.name }
                                    </td>
                                    <td data-label="Rol">
                                        { role.name } <a href="#" onClick={this.openModal.bind(null, role.id)} className="show--modal"><i className="fa fa-info-circle"></i></a>
                                    </td>
                                    <td data-label="Subcirkel">
                                        Sales and Support <a href="#" onClick={this.openModal.bind(null, 891021)}><i className="fa fa-info-circle"></i></a>
                                    </td>
                                    <td data-label="Cirkel">
                                        { circle.name} <a href="#"><i className="fa fa-info-circle"></i></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="feedback-form--row">
                            <div className="l-5 feedback-form--row-smiley">
                                <img src="/frontend/compiled-assets/images/positive-feedback.png" alt="Wat gaat er goed?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <label htmlFor="what-is-going-well">Wat gaat er goed?</label>
                                <textarea id="what-is-going-well" ref="positiveFeedback" rows="5"></textarea>
                                <a href="#" className="feedback-form--row-button"><i className="fa fa-plus"></i> Voeg nog een positief punt toe</a>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-5 feedback-form--row-smiley">
                                <img src="/frontend/compiled-assets/images/negative-feedback.png" alt="Wat kan er beter?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <label htmlFor="what-can-be-better">Wat kan er beter?</label>
                                <textarea id="what-can-be-better" ref="improvementFeedback" rows="5"></textarea>
                                <a href="#" className="feedback-form--row-button negative"><i className="fa fa-plus"></i> Voeg nog een verbeterpunt toe</a>
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral"><i className="fa fa-chevron-left"></i> Terug naar overzicht</Link>
                    <a onClick={this.handleSubmit.bind(null, postIndex)} className="action--button is-right">Opslaan</a>

                </div>
            </div>
        );
    },
});

export default FeedbackFormGeneral;
