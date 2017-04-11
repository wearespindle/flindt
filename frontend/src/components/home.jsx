import React from 'react';
import Header from './header';

const Home = (props) =>

    <div className="content--wrapper">
        <div className="content--header">
            <Header />
            <div className="content--header-breadcrumbs">
                <ul>
                    <li>Home</li>
                </ul>
            </div>
        </div>

        <div className="content">
            <h1>Welcome to Flindt!</h1>

            <p>Use the navigation bar to check for open feedback requests or received feedback!</p>
        </div>
    </div>;

export default Home;
