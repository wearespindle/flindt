/*
  FeedbackFormGeneral
  <FeedbackFormGeneral/>
*/

import React from 'react';
import { Link, History } from 'react-router';

import FeedbackRow from './FeedbackRow';
import FormComponent from '../addons/FormComponent';
import InfoModalButton from '../addons/InfoModalButton';

class FeedbackFormGeneral extends React.Component {

    componentWillMount() {
        this.props.fetchFeedbackAsSender();
    }

    openModal(roleId) {
        let info = {
            roleId,
        };

        this.props.showModal(info);
    }

    renderElement() {
        return '<p>hoi</p>';
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
                                <li>Feedback op rollen</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback op rollen</h2>

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
            post.id === parseInt(this.props.params.feedbackId, 0));

        let person = incomplete[postIndex];
        let circle,
            role;

        circle = person.circles[0];
        role = person.roles[0];

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
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
                                        { role.name }
                                        <InfoModalButton {...this.props} glassFrogId={role.id} />
                                    </td>
                                    <td data-label="Subcirkel">
                                        Sales and Support
                                        <InfoModalButton {...this.props} glassFrogId={891021} />
                                    </td>
                                    <td data-label="Cirkel">
                                        { circle.name}
                                        <a><i className="fa fa-info-circle" /></a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <FormComponent {...this.props} postIndex={postIndex} />
                </div>
            </div>
        );
    }
}

FeedbackFormGeneral.propTypes = {
    as_sender_data: React.PropTypes.object,
    fetchFeedbackAsSender: React.PropTypes.func,
    params: React.PropTypes.object,
    showModal: React.PropTypes.func,
};

// Set contextType for route to be able to go back and forth in History.
FeedbackFormGeneral.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

export default FeedbackFormGeneral;
