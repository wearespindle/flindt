import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Main from './Main';

/*
If specified, the component will subscribe to Redux store updates.
Any time it updates, mapStateToProps will be called.
*/
function mapStateToProps(state) {
    return {
        feedbackPeople: state.feedbackPeople,
        feedbackReceived: state.feedbackReceived,
        addFeedback: state.addFeedback,
    };
}

/*
If an object is passed, each function inside it will be assumed to be a Redux
action creator. An object with the same function names, but with every action
creator wrapped into a dispatch call so they may be invoked directly, will be
merged into the component’s props.
*/
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
