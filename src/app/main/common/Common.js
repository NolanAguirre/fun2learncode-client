import React, { Component } from 'react'
import './Common.css'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'

const GET_USER_DATA = gql`{
    getUserData{
        id
        firstName
        lastName
        role
    }
}`

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

function SecureRouteInner(props){
    if(props.queryResult.getUserData && props.roles.includes(props.queryResult.getUserData.role)){
        if(props.ignoreResult){
            return props.children
        }
        return React.Children.map(props.children, (child)=>React.cloneElement(child, {queryResult:props.queryResult}))
    }else if(props.unauthorized){
        return React.cloneElement(props.unauthorized, {queryResult:props.queryResult})
    }
    return <div>please login</div>
}

function SecureRoute(props){
    if(!localStorage.getItem('authToken')){
        if(props.unauthorized){
            return props.unauthorized
        }
        return <div>please login</div>
    }
    return <QueryHandler query={GET_USER_DATA}>
        <SecureRouteInner ignoreResult={props.ignoreResult} roles={props.roles} unauthorized={props.unauthorized}>{props.children}</SecureRouteInner>
    </QueryHandler>

}
export { SecureRoute }
