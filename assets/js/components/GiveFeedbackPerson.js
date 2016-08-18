/*
  GiveFeedbackPerson
  <GiveFeedbackPerson/>
*/

import React from 'react';

class GiveFeedbackPerson extends React.Component {
    render() {
        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Feedback geven</li>
                            <li>Feedback op persoon</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Feedback op persoon</h2>

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Persoon</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Persoon">
                                        Jan Arend
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label>Als Jan Arend een auto zou zijn wat voor auto zou hij dan zijn?</label>
                                <textarea rows="5"></textarea>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="feedback-form--form">
                                <label>Waarom vind je dat?</label>
                                <textarea rows="5"></textarea>
                            </div>
                        </div>
                    </div>

                    <a href="give-feedback.html" className="action--button neutral"><i className="fa fa-chevron-left"></i> Vorige</a>
                    <a href="index.html" className="action--button is-right">Opslaan <i className="fa fa-chevron-right"></i></a>
                </div>
            </div>
        )
    }
}

export default GiveFeedbackPerson;
