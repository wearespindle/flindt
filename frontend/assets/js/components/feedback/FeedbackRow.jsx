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
        let role = null;
        let circle = null;

        if(this.props.details.role) {
            role = this.props.details.role.role.name;
            circle = this.props.details.role.role.parent.name;
        }

        let dateLabel;
        let action;
        let person = this.props.details.recipient;

        // Change the labels and links in the table row to reuse this component.
        if (this.props.feedbackType === 'give') {
            let url;
            dateLabel = 'Sluitingsdatum';

            url = (role) ? 'give-feedback' : 'give-personal-feedback';

            action = <Link to={`/${url}/${this.props.details.id}`}><i className="fa fa-undo" /> Feedback geven</Link>;
        } else if (this.props.feedbackType === 'received') {
            dateLabel = 'Gekregen op';
            person = this.props.details.sender;

            action = <Link to={`/received-feedback/${this.props.details.id}`}><i className="fa fa-eye" /> Feedback bekijken</Link>;
        } else {

            dateLabel = 'Gegeven op';

            action = <Link to={`/check-feedback/${this.props.details.id}`}><i className="fa fa-eye" /> Feedback bekijken</Link>;
        }

        return (
            <tr>
                <td data-label="Persoon">{person.first_name} { person.last_name }</td>
                <td data-label="Rol">
                    {
                        role &&
                        <span>{role}</span>
                    }
                    {
                        !role &&
                        <span className="feedback-type-indicator">Persoonlijk</span>
                    }
                </td>
                <td data-label="Cirkel">{ circle }</td>
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
    recipient: React.PropTypes.object,
    role: React.PropTypes.object,
    details: React.PropTypes.object,
};

export default FeedbackRow;
