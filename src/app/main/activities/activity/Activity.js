import React from 'react';
import './Activity.css';
import { Link } from "react-router-dom";
function Activity(props) {
    return<div>{props.name}{props.description}<Link to={`/Events/${props.id}`}><button>{props.id}</button></Link></div>
}

export default Activity;
