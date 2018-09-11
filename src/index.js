import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './app/App';
const routeNames = [
    {
        name: 'Home',
        route: 'Home'
    }, {
        name: 'About Us',
        route: 'About Us'
    }, {
        name: 'Summer Camps',
        route: 'Activity/Summer Camps'
    }, {
        name: 'Classes',
        route: 'Activity/Classes'
    }, {
        name: 'Labs',
        route: 'Activity/Labs'
    }, {
        name: 'Workshops',
        route: 'Activity/Workshops'
    }, {
        name: 'Login',
        route: 'Login'
    }
];

ReactDOM.render(<Router>
    <div className="app"><App routeNames={routeNames}/>
    </div>
</Router>, document.getElementById('root'));
