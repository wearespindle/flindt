import React from 'react';
import Header from '../components/Header';

const NotFound = props => (
  <div className="content--wrapper">
    <div className="content--header">
      <Header />
      <div className="content--header-breadcrumbs">
        <ul>
          <li>404 - Page not found</li>
        </ul>
      </div>
    </div>

    <div className="content is-text-center has-margin-top-100">
      <h3>Looking very hard for the page you requested, but found nothing.</h3>
      <div className="content--not-found" />
    </div>
  </div>
);

export default NotFound;
