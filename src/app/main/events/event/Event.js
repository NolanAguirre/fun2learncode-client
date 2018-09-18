import React from 'react';
import './Event.css'
import {Location} from '../../common/Common'
import { Link } from "react-router-dom";
function EventComponent(props) {
    return (
        <div className="event-contaier">
            <div className="event-dates">
                <h3>Dates</h3>
                <table>
                    <tbody>
                        {props.node.date}
                    </tbody>
                </table>
            </div>
            <Location street={props.node.location.street}
                      city={props.node.location.city}
                      state={props.node.location.state}
                      alias={props.node.location.alias}></Location>
            <div className="event-register-container">
                <div className="event-capacity">Seats Left: {props.node.capacity}</div>
                <div className="event-register">
                    <div className="event-register-price">${props.node.price}</div>
                    <Link to={`/Registration/${props.node.id}`}><div className="event-register-btn">Register Now</div></Link>
                </div>
            </div>
        </div>
    );
}

export default EventComponent;
