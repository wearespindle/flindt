/*
  Home
  <Home/>
*/

import React from 'react';

class Home extends React.Component {
  render() {
    return (
        <div className="content--wrapper">
           <div className="content--header">
               <div className="content--header-spacing"></div>
               <div className="content--header-breadcrumbs">
                   <ul>
                       <li>Feedback geven</li>
                   </ul>
               </div>
           </div>

           <div className="content">
               <h2>Openstaande verzoeken (2)</h2>

               <table>
                   <thead>
                       <tr>
                           <th>Persoon</th>
                           <th>Rol</th>
                           <th>Cirkel</th>
                           <th>Sluitingsdatum</th>
                           <th>Acties</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td data-label="Persoon">Jan Arend</td>
                           <td data-label="Rol">Replink voor Sales &amp; Support</td>
                           <td data-label="Cirkel">VoIPGRID</td>
                           <td data-label="Sluitingsdatum">1 sept. 2016</td>
                           <td data-label="Acties"><a href="give-feedback.html"><i className="fa fa-undo"></i> Feedback geven</a></td>
                       </tr>
                       <tr>
                           <td data-label="Persoon">Peter</td>
                           <td data-label="Rol">Data Guru</td>
                           <td data-label="Cirkel">UX</td>
                           <td data-label="Sluitingsdatum">1 sept. 2016</td>
                           <td data-label="Acties"><a href="give-feedback.html"><i className="fa fa-undo"></i> Feedback geven</a></td>
                       </tr>
                   </tbody>
               </table>

               <h2>Gegeven feedback</h2>

               <table>
                   <thead>
                       <tr>
                           <th>Persoon</th>
                           <th>Rol</th>
                           <th>Cirkel</th>
                           <th>Gegeven op</th>
                           <th>Acties</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td data-label="Persoon">Erwin</td>
                           <td data-label="Rol">Planner voor VoIPGRID</td>
                           <td data-label="Cirkel">VoIPGRID</td>
                           <td data-label="Gegeven op">1 sept. 2016</td>
                           <td data-label="Acties"><a href="receive-feedback.html"><i className="fa fa-eye"></i> Feedback bekijken</a></td>
                       </tr>
                       <tr>
                           <td data-label="Persoon">Erwin</td>
                           <td data-label="Rol">Planner voor VoIPGRID</td>
                           <td data-label="Cirkel">VoIPGRID</td>
                           <td data-label="Gegeven op">1 sept. 2016</td>
                           <td data-label="Acties"><a href="receive-feedback.html"><i className="fa fa-eye"></i> Feedback bekijken</a></td>
                       </tr>
                   </tbody>
               </table>
           </div>
       </div>
    )
  }
}

export default Home;
