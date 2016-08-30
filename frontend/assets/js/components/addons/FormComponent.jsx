import React from 'react';
import { Link } from 'react-router';

class FormComponent extends React.Component {

    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);
        this._setImprovementFeedback = this._setImprovementFeedback.bind(this);
        this._setPositiveFeedback = this._setPositiveFeedback.bind(this);

        this.state = {
            improvementFeedback: '',
            positiveFeedback: '',
        };
    }

    _handleSubmit() {
        const { improvementFeedback, positiveFeedback } = this.state;
        const postIndex = this.props.postIndex;

        this.props.createFeedback({positiveFeedback, improvementFeedback, postIndex});
    }

    _setImprovementFeedback(event) {
        this.setState({
            improvementFeedback: event.target.value,
        });
    }

    _setPositiveFeedback(event) {
        this.setState({
            positiveFeedback: event.target.value,
        });
    }

    render() {
        return (

            <form>
                <div className="feedback-form--row">
                    <div className="l-5 feedback-form--row-smiley">
                        <img
                          src="/compiled-assets/images/positive-feedback.png"
                          alt="Wat gaat er goed?"
                        />
                    </div>

                    <div className="l-43 feedback-form--form">
                        <label htmlFor="positivefeedback">Wat gaat er goed?</label>
                        <textarea
                          id="positivefeedback"
                          rows="5"
                          onChange={this._setPositiveFeedback}
                          value={this.state.positiveFeedback}
                        />
                        <span className="feedback-form--row-button">
                            <i className="fa fa-plus" /> Voeg nog een positief punt toe
                        </span>
                    </div>
                </div>

                <div className="feedback-form--row">
                    <div className="l-5 feedback-form--row-smiley">
                        <img
                          src="/compiled-assets/images/negative-feedback.png"
                          alt="Wat kan er beter?"
                        />
                    </div>

                    <div className="l-43 feedback-form--form">
                        <label htmlFor="improvementfeedback">Wat kan er beter?</label>

                        <textarea
                          id="improvementfeedback"
                          rows="5"
                          onChange={this._setImprovementFeedback}
                          value={this.state.improvementFeedback}
                        />

                        <span className="feedback-form--row-button negative">
                            <i className="fa fa-plus" /> Voeg nog een verbeterpunt toe
                        </span>
                    </div>
                </div>

                <Link to="/" className="action--button neutral">
                    <i className="fa fa-chevron-left" /> Terug naar overzicht
                </Link>
                <a onClick={this._handleSubmit} className="action--button is-right">Opslaan</a>
            </form>
        );
    }
}

FormComponent.propTypes = {
    createFeedback: React.PropTypes.func,
    postIndex: React.PropTypes.number,
};

export default FormComponent;
