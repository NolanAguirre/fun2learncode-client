import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './app/App';
const routeNames = ['Home', 'About Us', 'Summer Camps', 'Classes', 'Labs', 'Workshops', 'Login'];

ReactDOM.render( <Router><div className="app"><App routeNames={routeNames} /> </div></Router>, document.getElementById('root'));
