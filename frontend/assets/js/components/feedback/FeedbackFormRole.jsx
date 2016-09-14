import React from 'react';
import { Link, History } from 'react-router';

import FeedbackRow from './FeedbackRow';
import FeedbackFormRoleRow from './FeedbackFormRoleRow';
import InfoModalButton from '../addons/InfoModalButton';

class FeedbackFormRole extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);
        this.props.fetchRatings(accessToken);

        this.state = {
            id: this.props.params.feedbackId,
            remarks: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.feedback.loading) {
            return false;
        }

        const remarks = nextProps.feedback.feedback.role.remarks;

        this.setState({
            remarks,
        });

        return true;
    }

    _handleSubmit() {
        const { id, remarks } = this.state;
        const accessToken = this.props.user.user.access_token;

        this.props.editFeedback({
            id,
            status: 1,
            role: {
                remarks,
            },
        }, accessToken);
    }

    handleChange(content, ratingId, index) {
        const remarks = this.state.remarks;

        if (remarks[index]) {
            remarks[index].content = content;
        } else {
            remarks[index] = {
                rating: ratingId,
                content,
            };
        }

        this.setState({
            remarks,
        });
    }

    render() {
        const { feedback, loading, error } = this.props.feedback;
        const ratings = this.props.ratings;

        if (loading || !ratings.length) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <div className="content--header-spacing" />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Feedback geven</li>
                                <li>Feedback op rollen</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Feedback op rollen</h2>

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

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback geven</li>
                            <li>Feedback op rollen</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback op rollen</h2>

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Persoon</th>
                                    <th>Rol</th>
                                    <th>Subcirkel</th>
                                    <th>Cirkel</th>
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
                                        { role.parent.name}
                                        <InfoModalButton {...this.props} roleId={role.parent.id} />
                                    </td>
                                    <td data-label="Cirkel">
                                        Devhouse Spindle
                                        <InfoModalButton {...this.props} roleId={role.parent.parent} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {
                        ratings.map((rating, index) => {
                            let value = '';

                            if (feedback.role.remarks[index]) {
                                value = feedback.role.remarks[index].content;
                            }
                            return (
                                <FeedbackFormRoleRow
                                  rating={ratings[index]}
                                  key={ratings[index].id}
                                  callbackParent={this.handleChange}
                                  index={index}
                                  value={value}
                                />
                            );
                        })
                    }

                    <Link to="/" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Terug naar overzicht
                    </Link>
                    <a onClick={this._handleSubmit} className="action--button is-right">Opslaan</a>
                </div>
            </div>
        );
    }
}

FeedbackFormRole.propTypes = {
    editFeedback: React.PropTypes.func,
    feedback: React.PropTypes.object,
    ratings: React.PropTypes.any,
    fetchFeedbackAsSender: React.PropTypes.func,
    fetchRatings: React.PropTypes.func,
    params: React.PropTypes.object,
    showModal: React.PropTypes.func,
    fetchFeedback: React.PropTypes.func,
    user: React.PropTypes.object,
    feedbackId: React.PropTypes.string,
};

// Set contextType for route to be able to go back and forth in History.
FeedbackFormRole.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

export default FeedbackFormRole;
