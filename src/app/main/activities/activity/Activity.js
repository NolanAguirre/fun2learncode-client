import React from 'react';
import './Activity.css';
import { Link } from "react-router-dom";
function Activity(props) {
    return(<div className="activity-container">
            <div className="activity-header">
                <img src="https://via.placeholder.com/350x150"></img>
                <div className="activity-header-text">
                    <h2 className="activity-title">
                        {props.name}
                    </h2>
                    <div>
                        prerequisites
                    </div>
                </div>
                <div className="activity-view-events">
                    <Link to={`/Events/${props.name}/${props.id}`}><button className="activity-view-events-btn">View Event Dates</button></Link>
                </div>
            </div>
            <div className="activity-body">
                <div>{props.description}</div>
            </div>
        </div>)
}

export default Activity;
