/*
  GiveFeedback
  <GiveFeedback/>
*/

import React from 'react';
import autobind from 'autobind-decorator';
import FeedbackRow from './FeedbackRow';
import {Link} from 'react-router';

var GiveFeedback = React.createClass({

    getInitialState() {
        // This would normally be an API call to get the open feedback data
        // but for now I'm using a sample data JSON file to render the
        // components.
        return {
            feedbackRows: require('../sample-data/data'),
            post: null,
        };
    },


    componentDidMount() {
        const postIndex = this.state.feedbackRows.findIndex((post) => post.id === parseInt(this.props.params.feedbackId, 0));
        const post = this.state.feedbackRows[postIndex];

        this.setState({
            post,
        });
    },

    openModal(roleId) {
        let info = {
            roleId,
        };

        this.props.showModal(info);
    },

    render() {
        let person = this.state.post;
        let circle, role;

        if (!person) {
            return null;
        }

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
                                <img src="/compiled-assets/images/positive-feedback.png" alt="Wat gaat er goed?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <label htmlFor="what-is-going-well">Wat gaat er goed?</label>
                                <textarea id="what-is-going-well" rows="5"></textarea>
                                <a href="#" className="feedback-form--row-button"><i className="fa fa-plus"></i> Voeg nog een positief punt toe</a>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-5 feedback-form--row-smiley">
                                <img src="/compiled-assets/images/negative-feedback.png" alt="Wat kan er beter?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <label htmlFor="what-can-be-better">Wat kan er beter?</label>
                                <textarea id="what-can-be-better" rows="5"></textarea>
                                <a href="#" className="feedback-form--row-button negative"><i className="fa fa-plus"></i> Voeg nog een verbeterpunt toe</a>
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral"><i className="fa fa-chevron-left"></i> Terug naar overzicht</Link>
                    <Link to="give-feedback-person" className="action--button is-right">Opslaan en feedback geven op persoon <i className="fa fa-chevron-right"></i></Link>
                </div>
            </div>
        );
    },
});

export default GiveFeedback;
