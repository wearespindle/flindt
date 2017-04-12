import React, { Component } from 'react';
import Time from 'react-time';
import RoleModalButton from '../components/role_modal_button';
import RatingRows from '../components/rating_row';

require('moment/locale/nl');

const ReceivedFeedbackContent = (props) => {
    const { feedback, person, receiver, question } = props;
    const accessToken = props.user.user.access_token;

    let table;

    if (feedback.role) {
        let role = feedback.role.role;

        table = (
            <table className="feedback-form--meta">
                <thead>
                    <tr>
                        <th>Person</th>
                        <th>Role</th>
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
                            <RoleModalButton accessToken={accessToken} role={role.id}>
                                { role.name }
                            </RoleModalButton>
                        </td>
                        <td data-label="Circle">
                            { role.parent &&
                                <RoleModalButton accessToken={accessToken} role={role.parent.id}>
                                    { role.parent.name }
                                </RoleModalButton>
                            }
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
};


ReceivedFeedbackContent.propTypes = {
    feedback: React.PropTypes.object,
    person: React.PropTypes.object,
    question: React.PropTypes.object,
    receiver: React.PropTypes.object,
    user: React.PropTypes.object,
};

export default ReceivedFeedbackContent;
