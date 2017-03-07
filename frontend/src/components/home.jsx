import React from 'react';

const Home = (props) =>

    <div className="content--wrapper">
        <div className="content--header">
            <div className="content--header-spacing" />
            <div className="content--header-breadcrumbs">
                <ul>
                    <li>Home</li>
                </ul>
            </div>
        </div>

        <div className="content">
            <h1>Welcome at Flindt!</h1>

            <p>Use the left navigation bar to check for open feedback requests or received feedback!</p>
        </div>
    </div>;

export default Home;
