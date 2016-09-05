import React from 'react';
import { Link, History } from 'react-router';

import InfoModalButton from '../addons/InfoModalButton';
import FeedbackContent from '../addons/FeedbackContent';

class CheckGivenFeedback extends React.Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);
        this.props.fetchRatings(accessToken);

        this.state = {
            id: this.props.params.feedbackId,
        }
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
                                <li>Feedback bekijken</li>
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
        let url = (feedback.role) ? 'edit-feedback' : 'edit-personal-feedback';

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback bekijken</li>
                            <li>Feedback op { (feedback.role) ? 'rollen' : 'persoon' }</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback op { (feedback.role) ? ` de rol '${feedback.role.role.name}'` : person.first_name }</h2>

                    <div className="feedback-form--wrapper">
                        <FeedbackContent {...this.props} feedback={feedback} person={person} ratings={ratings} />
                    </div>

                    <Link to="/" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Terug naar overzicht
                    </Link>

                    <Link to={`/${url}/${this.state.id}`} className="action--button is-right">
                        Feedback aanpassen
                    </Link>
                </div>
            </div>
        );
    }
}

CheckGivenFeedback.propTypes = {
    feedback: React.PropTypes.object,
    ratings: React.PropTypes.any,
    params: React.PropTypes.object,
    showModal: React.PropTypes.func,
    fetchFeedback: React.PropTypes.func,
    user: React.PropTypes.object,
    feedbackId: React.PropTypes.string,
};

// Set contextType for route to be able to go back and forth in History.
CheckGivenFeedback.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

export default CheckGivenFeedback;
