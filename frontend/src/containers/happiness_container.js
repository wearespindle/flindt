import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form';

import Notifications from 'react-notification-system-redux';

import Header from '../components/header';

import { fetchHappiness, postHappiness } from '../actions/happiness';

const BarChart = require('react-chartjs').Bar;
const moment = require('moment');

// renderField component for reduxForms.
const renderInput = ({ input, meta: { touched, error }, ...props }) => (
    <span>
        <input {...input} {...props} />
    </span>
);

renderInput.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
    type: React.PropTypes.string,
};

const renderTextArea = ({ input, meta: { touched, error } }) => (
    <div>
        <textarea {...input} rows="5" />
        {touched && error && <span className="label--alert">{error}</span>}
    </div>
);

renderTextArea.propTypes = {
    input: React.PropTypes.object,
    meta: React.PropTypes.object,
};

let HappinessContainerClass = class HappinessContainer extends React.Component {

    constructor(props) {
        super(props);

        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchHappiness(accessToken);
    }

    _handleSubmit(values) {
        const { happiness, description } = values;
        const accessToken = this.props.user.user.access_token;

        this.props.postHappiness({
            happiness,
            description,
        }, accessToken).then((response) => {
            let data = response.payload.data;

            if (response.payload.status !== 201) {
                this.props.dispatch(Notifications.error({
                    title: 'Error!',
                    message: 'Something went wrong while saving the data!',
                    position: 'tr',
                    autoDismiss: 2,
                }));
            } else {
                this.props.dispatch(Notifications.success({
                    title: 'Sweet success!',
                    message: 'Your happiness is succesfully saved! Thanks!',
                    position: 'tr',
                    autoDismiss: 2,
                }));

                // Send the user back to his feedback overview after a succesful action.
                // this.context.router.push('/received-feedback/');
            }
        });
    }

    render() {
        // console.log(this.state.chartData)
        if (!this.props.happiness) {
            return (
                <div className="content--wrapper">
                    <div className="content--header">
                        <Header />
                        <div className="content--header-breadcrumbs">
                            <ul>
                                <li>Give feedback</li>
                            </ul>
                        </div>
                    </div>

                    {
                        this.props.loading &&
                        <div className="content">
                            <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </div>
                    }
                    {
                        !this.props.loading &&
                        <div className="content is-text-center has-margin-top-100">
                            <h3>Unfortunately there are currently no feedback requests for you!</h3>
                            <div className="content--no-feedback" />
                        </div>
                    }
                </div>
            );
        }

        let happinessArray = [];

        this.props.happiness.map((result) => {
            happinessArray.push(result.happiness);

            return null;
        });

        let chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                borderWidth: 1,
                data: happinessArray,
            }],
        };

        const { handleSubmit, rangeValues } = this.props;

        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <Header />
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Happiness</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Your happiness!</h2>

                    <div className="feedback-form--wrapper">
                        <div className="feedback-form--row padding-bottom-0">
                            <div className="feedback-form--form">
                                <form onSubmit={handleSubmit(this._handleSubmit)}>

                                    <div className="feedback-form--row">
                                        <div>
                                            <strong>
                                                How happy are you on a scale of 1-10?
                                            </strong>

                                            <div>
                                                <Field
                                                  name="happiness"
                                                  component={renderInput}
                                                  className="feedback-form--range"
                                                  type="range"
                                                  step="1" min="1" max="10"
                                                />
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="feedback-form--row">
                                        <div>
                                            <strong>Please describe the current state of your happiness</strong>
                                            <div>
                                                <Field name="description" component={renderTextArea} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="feedback-form--row">
                                        <h2>Your happiness history!</h2>
                                        <div className="feedback-content">
                                            <BarChart data={chartData} width="1000" height="300" />
                                        </div>
                                    </div>

                                    <Link to="/" className="action--button neutral">
                                        <i className="fa fa-chevron-left" /> Back to overview
                                    </Link>

                                    <button className="action--button is-right" type="submit">
                                        Save your happiness
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    happiness: state.Happiness.happiness,
    user: state.User.data,
});

// reduxForm validate function.
function validate(values) {
    const errors = {};

    if (!values.description) {
        errors.description = 'Please describe your happiness with a couple of words';
    }

    return errors;
}

HappinessContainerClass.propTypes = {
    fetchHappiness: React.PropTypes.func,
    postHappiness: React.PropTypes.func,
    user: React.PropTypes.object,
    happiness: React.PropTypes.array,
    loading: React.PropTypes.bool,
    dispatch: React.PropTypes.func,
    handleSubmit: React.PropTypes.func,
    rangeValues: React.PropTypes.object,
};


// Connect reduxForm to our class.
HappinessContainerClass = reduxForm({
    form: 'GivePersonalFeedbackForm',
    validate,
})(HappinessContainerClass);

export default connect(mapStateToProps, {fetchHappiness, postHappiness})(HappinessContainerClass);
