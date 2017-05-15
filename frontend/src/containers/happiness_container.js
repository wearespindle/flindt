import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from '../components/header';

import { fetchHappiness } from '../actions/happiness';

const BarChart = require('react-chartjs').Bar;
const moment = require('moment');

class HappinessContainer extends React.Component {
    componentWillMount() {
        let accessToken = this.props.user.user.access_token;

        this.props.fetchHappiness(accessToken);
    }

    render() {
        // console.log(this.state.chartData)
        if (!this.props.happiness.length) {
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
                        <div className="feedback-form--row">
                            <div className="feedback-content">
                                <BarChart data={chartData} width="1000" height="500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    happiness: state.Happiness.happiness,
    user: state.User.data,
});

HappinessContainer.propTypes = {
    fetchHappiness: React.PropTypes.func,
    user: React.PropTypes.object,
    happiness: React.PropTypes.array,
    loading: React.PropTypes.bool,
};

export default connect(mapStateToProps, {fetchHappiness})(HappinessContainer);
