import React, { Component } from 'react'
import './Common.css'
import { GET_USER_DATA } from '../../Queries'
import QueryHandler from '../queryHandler/QueryHandler'
function Location (props) {
  return (<div className='location'>
    <div>
      <h3>{props.alias}</h3>
      <div>{props.street}, {props.city} {props.state}</div>
    </div>
    <div><iframe width='400' height='300' id={props.id} src='https://maps.google.com/maps?q=fun2learncode&t=&z=13&ie=UTF8&iwloc=&output=embed' frameBorder='0' scrolling='no' marginHeight='0' marginWidth='0' />
    </div>
  </div>)
}
export { Location }

function DropDown (props) {
  return (
    <select name={props.name} value={props.value} onChange={props.onChange}>
      <option value={undefined}>None</option>
      {props.options.map((element) => {
        return <option key={element.value} value={element.value}>{element.name}</option>
      })}
    </select>)
}
export { DropDown }

function SecureRoute(props){
    if(!localStorage.getItem('authToken')){
        return <div>please login</div>
    }
    return (<QueryHandler query={GET_USER_DATA} child={(data) => {
                if(props.roles.includes(data.getUserData.role)){
                    return props.children;
                }
                return <div>please login</div>
            }}/>
    );
}
export { SecureRoute }
