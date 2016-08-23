/*
  ReceivedFeedback
  <ReceivedFeedback/>
*/

import React from 'react';
import { Link } from 'react-router';

class ReceivedFeedback extends React.Component {
    render() {
        return (
            <div className="content--wrapper">
                <div className="content--header">
                    <div className="content--header-spacing"></div>
                    <div className="content--header-breadcrumbs">
                        <ul>
                            <li>Ontvangen feedback</li>
                            <li>Feedback van Jan Arend</li>
                        </ul>
                    </div>
                </div>

                <div className="content">
                    <h2>Ontvangen feedback</h2>

                    <div className="feedback-form--wrapper">
                        <table className="feedback-form--meta">
                            <thead>
                                <tr>
                                    <th>Persoon</th>
                                    <th>Rol</th>
                                    <th>Subcirkel</th>
                                    <th>Cirkel</th>
                                    <th>Ontvangen op</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Persoon">
                                        Erwin
                                    </td>
                                    <td data-label="Rol">
                                        Planner voor VoIPGRID <a href="#" className="show--modal"><i className="fa fa-info-circle"></i></a>
                                    </td>
                                    <td data-label="Subcirkel">
                                        Webapp <a href="#"><i className="fa fa-info-circle"></i></a>
                                    </td>
                                    <td data-label="Cirkel">
                                        VoIPGRID <a href="#"><i className="fa fa-info-circle"></i></a>
                                    </td>
                                    <td data-label="Ontvangen op">
                                        1 sept. 2016
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="feedback-form--row">
                            <div className="l-5 feedback-form--row-smiley">
                                <img src="compiled-assets/images/positive-feedback.png" alt="Wat gaat er goed?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <h3>Wat gaat er goed?</h3>
                                <p>Duis id nibh mauris. Fusce ac ante massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod mauris mauris, eget imperdiet magna vehicula id.
                                    Etiam tortor lorem, rutrum sed interdum non, dictum nec enim. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                    Curabitur tristique, urna in porttitor lobortis, leo ante viverra orci, ac sagittis ligula erat a elit.
                                    Cras elit nibh, tristique at malesuada in, mattis et tortor. Etiam vitae sodales metus, nec ornare diam. Duis vel rhoncus ex, sed sollicitudin elit.
                                    Maecenas a velit dui. Curabitur quis mi odio. In ut leo quam.
                                </p>
                            </div>

                            <div className="l-5 feedback-form--row-smiley">
                                <img src="compiled-assets/images/positive-feedback.png" alt="Wat gaat er goed?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <p>Duis id nibh mauris. Fusce ac ante massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod mauris mauris, eget imperdiet magna vehicula id.
                                    Etiam tortor lorem, rutrum sed interdum non, dictum nec enim. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                    Curabitur tristique, urna in porttitor lobortis, leo ante viverra orci, ac sagittis ligula erat a elit.
                                    Cras elit nibh, tristique at malesuada in, mattis et tortor. Etiam vitae sodales metus, nec ornare diam. Duis vel rhoncus ex, sed sollicitudin elit.
                                    Maecenas a velit dui. Curabitur quis mi odio. In ut leo quam.
                                </p>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-5 feedback-form--row-smiley">
                                <img src="compiled-assets/images/negative-feedback.png" alt="Wat kan er beter?" />
                            </div>

                            <div className="l-43 feedback-form--form">
                                <h3>Wat kan er beter?</h3>
                                <p>Duis id nibh mauris. Fusce ac ante massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod mauris mauris, eget imperdiet magna vehicula id.
                                    Etiam tortor lorem, rutrum sed interdum non, dictum nec enim. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                                    Curabitur tristique, urna in porttitor lobortis, leo ante viverra orci, ac sagittis ligula erat a elit.
                                    Cras elit nibh, tristique at malesuada in, mattis et tortor. Etiam vitae sodales metus, nec ornare diam. Duis vel rhoncus ex, sed sollicitudin elit.
                                    Maecenas a velit dui. Curabitur quis mi odio. In ut leo quam.
                                </p>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-24 grade--wrapper">
                                <h3>Waardevol</h3>
                                <div className="grade--outset">
                                    <div className="grade--inset" style={{width: '30%'}}></div>
                                </div>
                                <div className="grade--number">3/10</div>
                            </div>

                            <div className="l-24 grade--wrapper">
                                <h3>Herkenbaar</h3>
                                <div className="grade--outset">
                                    <div className="grade--inset" style={{width: '70%'}}></div>
                                </div>
                                <div className="grade--number">7/10</div>
                            </div>
                        </div>

                        <div className="feedback-form--row">
                            <div className="l-24 grade--wrapper">
                                <h3>Voorgenomen acties</h3>
                                <p>Geen tekst, blabla</p>
                            </div>
                        </div>
                    </div>

                    <Link to="/" className="action--button neutral"><i className="fa fa-chevron-left"></i> Terug naar overzicht</Link>
                    <a href="index.html" className="action--button is-right">Bewerken <i className="fa fa-pencil"></i></a>
                </div>
            </div>
        );
    }
}

export default ReceivedFeedback;
