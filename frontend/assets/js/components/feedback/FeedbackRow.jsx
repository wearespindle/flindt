/*
FeedbackRow
<FeedbackRow />
*/

import React from 'react';
import { Link } from 'react-router';

class FeedbackRow extends React.Component {

    renderType(type, role) {
        if (type === 'personal') {
            return (<span className="feedback-type-indicator">Persoonlijk</span>);
        }

        return role.name;
    }

    render() {
        let person = this.props.details;
        let role = person.roles[0];
        let circle = person.circles[0];
        let dateLabel,
            action;

        // Change the labels and links in the table row to reuse this component.
        if (this.props.feedbackType === 'give') {
            let url;
            dateLabel = 'Sluitingsdatum';

            url = (person.type === 'personal') ? 'give-personal-feedback' : 'give-feedback';

            action = <Link to={`/${url}/${person.id}`}><i className="fa fa-undo" /> Feedback geven</Link>;
        } else {
            dateLabel = 'Gegeven op';
            action = <Link to={`/check-feedback/${person.id}`}><i className="fa fa-eye" /> Feedback bekijken</Link>;
        }

        return (
            <tr>
                <td data-label="Persoon">{person.name}</td>
                <td data-label="Rol">
                    { this.renderType(person.type, role) }
                </td>
                <td data-label="Cirkel">{ circle.name }</td>
                <td data-label="{dateLabel}">1 sept. 2016</td>
                <td data-label="Acties">
                    { action }
                </td>
            </tr>
        );
    }
}

FeedbackRow.propTypes = {
    feedbackType: React.PropTypes.string,
    details: React.PropTypes.object,
};

export default FeedbackRow;
