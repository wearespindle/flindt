/*
  ReceivedFeedback
  <ReceivedFeedback/>
*/

import React from 'react';
import { Link } from 'react-router';

import InfoModalButton from '../addons/InfoModalButton';
import FeedbackContent from '../addons/FeedbackContent';
import RatingRows from '../addons/RatingRows';

class ReceivedFeedback extends React.Component {
    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);

        this.handleRecognizableChange = this.handleRecognizableChange.bind(this);
        this.handleValuableChange = this.handleValuableChange.bind(this);
        this.handleActionableChange = this.handleActionableChange.bind(this);
        this.handleActionableContentChange = this.handleActionableContentChange.bind(this);

        this.state = {
            id: this.props.params.feedbackId,
            howRecognizable: 5,
            howValuable: 5,
            actionable: false,
            actionableContent: '',
        };
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchFeedback(accessToken, this.props.params.feedbackId);
        this.props.fetchRatings(accessToken);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.feedback.loading) {
            return false;
        }

        const { how_recognizable, how_valuable, actionable, actionable_content } = nextProps.feedback.feedback;

        this.setState({
            actionable,
            howRecognizable: how_recognizable,
            howValuable: how_valuable,
            actionableContent: actionable_content,
        });

        return true;
    }

    _handleSubmit() {
        const { id, howRecognizable, howValuable, actionable, actionableContent } = this.state;
        const accessToken = this.props.user.user.access_token;

        this.props.editFeedback({
            id,
            actionable,
            how_recognizable: howRecognizable,
            how_valuable: howValuable,
            actionable_content: actionableContent,
        }, accessToken);
    }

    handleRecognizableChange(event) {
        this.setState({
            howRecognizable: event.target.value,
        });
    }

    handleValuableChange(event) {
        this.setState({
            howValuable: event.target.value,
        });
    }

    handleActionableChange(event) {
        let value = (event.target.value === 'true' ? true : false)

        this.setState({
            actionable: value,
        });
    }

    handleActionableContentChange(event) {
        this.setState({
            actionableContent: event.target.value,
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
                                <li>Received feedback</li>
                                <li>Received</li>
                            </ul>
                        </div>
                    </div>

                    <div className="content">
                        <h2>Received feedback</h2>

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

        let table;
        let person = feedback.sender;
        let receiver = feedback.recipient;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing" />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Received feedback</li>
                            <li>Feedback from {person.first_name}</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Received feedback</h2>

                    <div className="feedback-form--wrapper">
                        <FeedbackContent {...this.props} person={person} receiver={receiver} feedback={feedback} ratings={ratings} />

                        <div className="feedback-form--row">
                            <div className="l-48">
                                <h3>How valuable is the feedback you received from {person.first_name}?</h3>
                                <input type="range" className="feedback-form--range" step="1" min="1" max="10" value={this.state.howValuable} onChange={this.handleValuableChange} />
                                <ul className="range-input-list">
                                    <li>1</li>
                                    <li>2</li>
                                    <li>3</li>
                                    <li>4</li>
                                    <li>5</li>
                                    <li>6</li>
                                    <li>7</li>
                                    <li>8</li>
                                    <li>9</li>
                                    <li>10</li>
                                </ul>

                                <div className="range-input-list-output">
                                    Grade: <span>1</span>
                                </div>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-48">
                                <h3>How recognizable is the feedback you received from {person.first_name}?</h3>
                                <input type="range" className="feedback-form--range" step="1" min="1" max="10" value={this.state.howRecognizable} onChange={this.handleRecognizableChange} />
                                <ul className="range-input-list">
                                    <li>1</li>
                                    <li>2</li>
                                    <li>3</li>
                                    <li>4</li>
                                    <li>5</li>
                                    <li>6</li>
                                    <li>7</li>
                                    <li>8</li>
                                    <li>9</li>
                                    <li>10</li>
                                </ul>

                                <div className="range-input-list-output">
                                    Grade: <span>1</span>
                                </div>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-48">
                                <h3>Are you planning on doing anything with this feedback?</h3>
                                <form>
                                    <ul className="feedback--form-radiolist">
                                        <li><input id="yes" name="feedback-action" type="radio" value={true} checked={this.state.actionable} onChange={this.handleActionableChange} /><label htmlFor="yes">Yes, because</label></li>
                                        <li><input id="no" name="feedback-action" type="radio" value={false} checked={!this.state.actionable} onChange={this.handleActionableChange} /><label htmlFor="no">No, because</label></li>
                                    </ul>
                                </form>
                                <textarea
                                  rows="5"
                                  value={this.state.actionableContent}
                                  onChange={this.handleActionableContentChange}
                                />
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral">
                        <i className="fa fa-chevron-left" /> Back to overview
                    </Link>
                    <a onClick={this._handleSubmit} className="action--button is-right">Save</a>
                </div>
            </div>
        );
    }
}

ReceivedFeedback.propTypes = {
    fetchFeedback: React.PropTypes.func,
    fetchRatings: React.PropTypes.func,
    editFeedback: React.PropTypes.func,
    params: React.PropTypes.object,
    user: React.PropTypes.object,
};

export default ReceivedFeedback;
