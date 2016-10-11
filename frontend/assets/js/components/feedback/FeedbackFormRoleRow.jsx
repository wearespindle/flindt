import React from 'react';

class FeedbackFormRoleRow extends React.Component {
    constructor(props) {
        super(props);

        this._handleChange = this._handleChange.bind(this);
    }

    _handleChange(event) {
        if (this.props.callbackParent) {
            this.props.callbackParent(event.target.value, this.props.rating.id, this.props.index);
        }
    }

    render() {
        let row;
        let rating = this.props.rating;

        if (rating.name.toLowerCase() === 'positive') {
            row = (
                <div>
                    <div className="l-5 feedback-form--row-smiley">
                        <img
                          src="/compiled-assets/images/positive-feedback.png"
                          alt="What is going well?"
                        />
                    </div>

                    <div className="l-43 feedback-form--form">
                        <label htmlFor="positivefeedback">{rating.description}</label>
                        <textarea
                          id="positivefeedback"
                          rows="5"
                          onChange={this._handleChange}
                          value={this.props.value}
                        />
                    </div>
                </div>
            );
        } else {
            row = (
                <div>
                    <div className="l-5 feedback-form--row-smiley">
                        <img
                          src="/compiled-assets/images/negative-feedback.png"
                          alt="What can be improved?"
                        />
                    </div>

                    <div className="l-43 feedback-form--form">
                        <label htmlFor="improvementfeedback">{rating.description}</label>

                        <textarea
                          id="improvementfeedback"
                          rows="5"
                          onChange={this._handleChange}
                          value={this.props.value}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="feedback-form--row">
                {row}
            </div>
        );
    }
}

FeedbackFormRoleRow.propTypes = {
    rating: React.PropTypes.object,
    callbackParent: React.PropTypes.func,
};

export default FeedbackFormRoleRow;
