import React, { Component } from 'react';
import Time from 'react-time';
import ModalButton from '../components/modal_button';
import RatingRows from '../components/rating_row';

require('moment/locale/nl');

class ReceivedFeedbackContent extends Component {

    render() {
        const { feedback, person, receiver, question } = this.props;
        const accessToken = this.props.user.user.access_token;

        let table;

        if (feedback.role) {
            let role = feedback.role.role;

            table = (
                <table className="feedback-form--meta">
                    <thead>
                        <tr>
                            <th>Person</th>
                            <th>Role</th>
                            <th>Subcircle</th>
                            <th>Circle</th>
                            <th>Received on</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Person">
                                { person.first_name } { person.last_name}
                            </td>
                            <td data-label="Role">
                                <ModalButton accessToken={accessToken} role={role.id}>
                                    { role.name }
                                </ModalButton>
                            </td>
                            <td data-label="Subcircle">
                                <ModalButton accessToken={accessToken} role={role.parent.id}>
                                    { role.parent.name }
                                </ModalButton>
                            </td>
                            <td data-label="Circle">
                                Devhouse Spindle
                            </td>
                            <td data-label="Received on">
                                <Time value={feedback.date} locale="EN" format="D MMMM YYYY" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        } else {
            table = (
                <table className="feedback-form--meta">
                    <thead>
                        <tr>
                            <th>Person</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Person">
                                { person.first_name } { person.last_name}
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        return (
            <div>
                { table }

                {
                    feedback.role &&
                        <RatingRows remarks={feedback.role.remarks} />
                }

                {
                    feedback.individual &&
                    <div className="feedback-form--row">
                        <div className="feedback-form--answer-container">
                            <strong>
                                { feedback.individual.question.content }
                            </strong>

                            <div className="feedback-form--answer">
                                <p>{feedback.individual.answer}</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

ReceivedFeedbackContent.propTypes = {
    feedback: React.PropTypes.object,
    person: React.PropTypes.object,
    question: React.PropTypes.object,
    receiver: React.PropTypes.object,
    user: React.PropTypes.object,
};

export default ReceivedFeedbackContent;
