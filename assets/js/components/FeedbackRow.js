/*
FeedbackRow
<FeedbackRow />
*/

import React from 'react';
import { Link } from 'react-router';

class FeedbackRow extends React.Component {

    render() {
        let person = this.props.details;
        let role = person.roles[0];
        let circle = person.circles[0];
        let dateLabel, action;

        // Change the labels and links in the table row to reuse this component.
        if (this.props.feedbackType === 'give') {
            dateLabel = 'Sluitingsdatum';
            action = <Link to={`/give-feedback/${person.id}`}><i className="fa fa-undo"></i> Feedback geven</Link>;
        } else {
            dateLabel = 'Gegeven op';
            action = <Link to={`/check-feedback/${person.id}`}><i className="fa fa-eye"></i> Feedback bekijken</Link>;
        }

        return (
            <tr>
                <td data-label="Persoon">{person.name}</td>
                <td data-label="Rol">{ role.name }</td>
                <td data-label="Cirkel">{ circle.name }</td>
                <td data-label="{dateLabel}">1 sept. 2016</td>
                <td data-label="Acties">
                    { action }
                </td>
            </tr>
        );
    }
}

export default FeedbackRow;
