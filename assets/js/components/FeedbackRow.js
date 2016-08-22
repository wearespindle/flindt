/*
FeedbackRow
<FeedbackRow />
*/

import React from 'react';
import autobind from 'autobind-decorator';

@autobind
class FeedbackRow extends React.Component {

    render() {
        var person = this.props.details;
        var role = person.roles[0];
        var circle = person.circles[0];
        return (
            <tr>
                <td data-label="Persoon">{person.name}</td>
                <td data-label="Rol">{ role.name }</td>
                <td data-label="Cirkel">{ circle.name }</td>
                <td data-label="Sluitingsdatum">1 sept. 2016</td>
                <td data-label="Acties"><a href="give-feedback.html"><i className="fa fa-undo"></i> Feedback geven</a></td>
            </tr>
        );
    }
}


export default FeedbackRow;
