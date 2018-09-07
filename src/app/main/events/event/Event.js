import React from 'react';
import './Event.css'
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
            <div className="event-location">
                <div>
                    <h3>{props.node.location.alias}</h3>
                    <div>{props.node.location.street}, {props.node.location.city} {props.node.location.state}</div>
                </div>
                <div><iframe width="400" height="300" id={props.node.id} src="https://maps.google.com/maps?q=fun2learncode&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
                </div>
            </div>
            <div className="event-register">
                <div className="event-register-price">${props.node.price}</div>
                <Link to={`/Registration/${props.node.id}`}><div className="event-register-btn">Register Now</div></Link>
            </div>
        </div>
    );
}

export default EventComponent;
