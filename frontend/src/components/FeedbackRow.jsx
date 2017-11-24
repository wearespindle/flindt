import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router';
import Time from 'react-time';

require('moment/locale/nl');

const FeedbackRow = (props) => {
    let role = null;
    let circle = '';
    let action,
        dateLabel,
        url;

    if (props.details.role) {
        role = props.details.role.role.name;

        if (props.details.role.role.parent) {
            circle = props.details.role.role.parent.name;
        }
    }

    let person = props.details.recipient;

    url = (role) ? 'give-feedback/role' : 'give-feedback/personal';

    // Change the labels and links in the table row to reuse this component.
    if (props.feedbackType === 'give') {
        dateLabel = 'Requested on';

        action =
            <Link to={`/${url}/${props.details.id}/new`}><i className="fa fa-undo" /> Give feedback</Link>;
    } else if (props.feedbackType === 'received') {
        dateLabel = 'Received on';
        person = props.details.sender;

        action = (
            <Link to={`/received-feedback/${props.details.id}`}>
                <i className="fa fa-eye" /> Check feedback
            </Link>
        );
    } else {
        dateLabel = 'Given on';

        action = (
            <Link to={`/${url}/${props.details.id}`}>
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
                <Time value={props.details.date} locale="EN" format="D MMMM YYYY" />
            </td>
            { props.completed &&
                <td data-label="Rated">
                    { props.details.how_recognizable && props.details.how_valuable &&
                        <i className="fa fa-check" />
                    }
                    &nbsp;
                </td>
            }
            { !props.skipped &&
                <td data-label="Actions">
                    { action }
                </td>
            }
        </tr>
    );
};


FeedbackRow.propTypes = {
    feedbackType: propTypes.string,
    recipient: propTypes.object,
    role: propTypes.object,
    details: propTypes.object,
    completed: propTypes.bool,
    skipped: propTypes.bool,
};


export default FeedbackRow;
