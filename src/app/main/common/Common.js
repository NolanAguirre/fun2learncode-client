import React, {Component} from 'react';
import './Common.css'
function Location(props){
    return(<div className="location">
        <div>
            <h3>{props.alias}</h3>
            <div>{props.street}, {props.city} {props.state}</div>
        </div>
        <div><iframe width="400" height="300" id={props.id} src="https://maps.google.com/maps?q=fun2learncode&t=&z=13&ie=UTF8&iwloc=&output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
        </div>
    </div>);
}
export {Location};
