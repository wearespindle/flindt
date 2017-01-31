import React from 'react';
import Time from 'react-time';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import RatingRows from '../components/rating_row';
import ModalButton from '../components/modal_button';

import { cleanFeedback, fetchFeedback } from '../actions/feedback';


class CheckGivenRoleFeedback extends React.Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);

        this.state = {
            id: this.props.params.feedbackId,
        };
    }

    componentWillUnmount() {
        this.props.cleanFeedback();
    }

    render() {
        const { feedback } = this.props.feedback;

        if (!feedback.recipient && !feedback.role) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Check feedback</li>
                                <li>Feedback on role</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback on the role </h2>

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

        let person = feedback.recipient;
        let role = feedback.role.role;
        const accessToken = this.props.user.user.access_token;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Check feedback</li>
                            <li>Feedback on role</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback on the role { feedback.role.role.name }</h2>

                    <div className="feedback-form--wrapper">
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

                        <div>
                            <RatingRows remarks={feedback.role.remarks} />
                        </div>
                    </div>

                    <Link to="/give-feedback" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Back to overview
                    </Link>

                    <Link to={`/give-feedback/role/${this.state.id}/edit`} className="action--button is-right">
                        Edit feedback
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    feedback: state.Feedback.feedback,
    user: state.User.data,
    user_data: state.User.user_data,
});

CheckGivenRoleFeedback.propTypes = {
    cleanFeedback: React.PropTypes.func,
    feedback: React.PropTypes.object,
    fetchFeedback: React.PropTypes.func,
    user: React.PropTypes.object,
    params: React.PropTypes.object,
};

export default connect(mapStateToProps, {cleanFeedback, fetchFeedback})(CheckGivenRoleFeedback);
