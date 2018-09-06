import React from 'react';
import './Event.css'
function EventComponent(props) {
    return (<div className="activity-section">
        <div className="activity-header">
            <img className="home-section-image" alt="Activity picture" src="https://via.placeholder.com/300x150"></img>
            <div>
                <h2 className="activity-title">{props.node.name}</h2>
                <div>{props.node.date[0]}</div>
                <div>Prerequisites</div>
            </div>
        </div>
        <div className="activity-main">
            <div className="activity-description">
                <p>{props.node.description}</p>
            </div>
            <div>
                <button>Register Now</button>
            </div>
        </div>
    </div>);
}

export default EventComponent;
