import React from 'react';
import Time from 'react-time';
import InfoModalButton from '../addons/InfoModalButton';
import RatingRows from '../addons/RatingRows';

require('moment/locale/nl');

class FeedbackContent extends React.Component {

    render() {
        const { feedback, person, receiver } = this.props;

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
                                { role.name }
                                <InfoModalButton {...this.props} roleId={role.id} />
                            </td>
                            <td data-label="Subcircle">
                                { role.parent.name }
                                <InfoModalButton {...this.props} roleId={role.parent.id} />
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
                            <div className="feedback-form--form">
                                <strong>
                                    If {feedback.recipient.first_name} was a car, which car would he/she be, and why?
                                </strong>
                                <p>{feedback.individual.answer}</p>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default FeedbackContent;
