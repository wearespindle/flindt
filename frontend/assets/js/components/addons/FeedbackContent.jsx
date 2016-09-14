import React from 'react';
import Time from 'react-time';
require('moment/locale/nl');

import InfoModalButton from '../addons/InfoModalButton';
import RatingRows from '../addons/RatingRows';

class FeedbackContent extends React.Component {

    render() {
        const { feedback, ratings, person } = this.props;

        let table;

        if (feedback.role) {
            let role = feedback.role.role;

            table = (
                <table className="feedback-form--meta">
                    <thead>
                        <tr>
                            <th>Persoon</th>
                            <th>Rol</th>
                            <th>Subcirkel</th>
                            <th>Cirkel</th>
                            <th>Ontvangen op</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Persoon">
                                { person.first_name } { person.last_name}
                            </td>
                            <td data-label="Rol">
                                { role.name }
                                <InfoModalButton {...this.props} roleId={role.id} />
                            </td>
                            <td data-label="Subcirkel">
                                { role.parent.name }
                                <InfoModalButton {...this.props} roleId={role.parent.id} />
                            </td>
                            <td data-label="Cirkel">
                                Devhouse Spindle
                                <InfoModalButton {...this.props} roleId={role.parent.parent} />
                            </td>
                            <td data-label="Ontvangen op">
                                <Time value={feedback.date} locale='NL' format="D MMMM YYYY" />
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
                            <th>Persoon</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="Persoon">
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
                        <RatingRows ratings={ratings} remarks={feedback.role.remarks} />
                }

                {
                    feedback.individual &&
                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label>
                                    Als {person.first_name}
                                    een auto zou zijn wat voor auto zou hij/zij dan zijn en waarom?
                                </label>
                                <p>{feedback.individual.answer}</p>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default FeedbackContent;
