import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'react-time';

require('moment/locale/nl');

class FeedbackRow extends Component {

    renderType(type, role) {
        if (type === 'personal') {
            return (<span className="feedback-type-indicator">Personal</span>);
        }

        return role.name;
    }

    render() {
        let role = null;
        let circle = '';
        let action,
            dateLabel,
            url;

        if (this.props.details.role) {
            role = this.props.details.role.role.name;

            if (this.props.details.role.role.parent) {
                circle = this.props.details.role.role.parent.name;
            }
        }

        let person = this.props.details.recipient;

        url = (role) ? 'give-feedback/role' : 'give-feedback/personal';

        // Change the labels and links in the table row to reuse this component.
        if (this.props.feedbackType === 'give') {
            dateLabel = 'Closingdate';

            action =
                <Link to={`/${url}/${this.props.details.id}/new`}><i className="fa fa-undo" /> Give feedback</Link>;
        } else if (this.props.feedbackType === 'received') {
            dateLabel = 'Received on';
            person = this.props.details.sender;

            action = (
                <Link to={`/received-feedback/${this.props.details.id}`}>
                    <i className="fa fa-eye" /> Check feedback
                </Link>
            );
        } else {
            dateLabel = 'Given on';

            action = (
                <Link to={`/${url}/${this.props.details.id}`}>
                    <i className="fa fa-eye" /> Check feedback
                </Link>
            );
        }

        return (
            <tr>
                <td data-label="Person">{person.first_name} { person.last_name }</td>
                <td data-label="Role">
                    {
                        role &&
                            <span>{role}</span>
                    }
                    {
                        !role &&
                            <span className="feedback-type-indicator">Personal</span>
                    }
                </td>
                <td data-label="Circle">{ circle || '-'}</td>
                <td data-label="Date">
                    <Time value={this.props.details.date} locale="EN" format="D MMMM YYYY" />
                </td>
                <td data-label="Actions">
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
