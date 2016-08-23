import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchFeedbackAsSender, fetchFeedbackAsSenderSuccess, fetchFeedbackAsSenderFailure } from '../actions/FetchFeedbackAsSender';
import { fetchFeedbackAsReceiver, fetchFeedbackAsReceiverSuccess, fetchFeedbackAsReceiverFailure } from '../actions/FetchFeedbackAsReceiver';
import Main from './Main';

const mapStateToProps = (state) => {
    return {
        as_sender_data: state.FetchFeedbackAsSender.data,
        as_receiver_data: state.FetchFeedbackAsReceiver.data,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFeedbackAsSender: () => {
            dispatch(fetchFeedbackAsSender()).then((response) => {
                !response.error ? dispatch(fetchFeedbackAsSenderSuccess(response.payload)) : dispatch(fetchFeedbackAsSenderFailure(response.payload));
            });
        },
        fetchFeedbackAsReceiver: () => {
            dispatch(fetchFeedbackAsReceiver()).then((response) => {
                !response.error ? dispatch(fetchFeedbackAsReceiverSuccess(response.payload)) : dispatch(fetchFeedbackAsReceiverFailure(response.payload));
            });
        },
    };
};


const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
