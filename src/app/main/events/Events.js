import React, { Component } from 'react'
import './Events.css'
import EventComponent from './event/Event'
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment'
import SadFace from '../../logos/sadface.svg'
const GET_EVENTS_OF_TYPE = (id) => {
  return `{
  allEvents(condition: {eventType: "${id}"}, filter: {openRegistration: {lessThanOrEqualTo: "${new Date().toISOString()}"}, closeRegistration: {greaterThanOrEqualTo: "${new Date().toISOString()}"}}) {
    nodes {
      id
      nodeId
      dateGroupsByEvent(filter: {openRegistration: {lessThanOrEqualTo: "${new Date().toISOString()}"}, closeRegistration: {greaterThanOrEqualTo: "${new Date().toISOString()}"}, seatsLeft:{greaterThan:0}}) {
        nodes {
            addressByAddress {
              nodeId
              id
              city
              street
              state
              alias
              url
            }
            price
            capacity
            seatsLeft
          name
          nodeId
          openRegistration
          closeRegistration
          id
          datesJoinsByDateGroup {
            nodes {
              nodeId
              dateIntervalByDateInterval {
                nodeId
                id
                end
                start
              }
            }
          }
        }
      }
    }
  }
}`}

function EventsInner(props) { // TODO group this by address so i dont have to load multiple maps
    let events = props.allEvents.nodes.map((event) => { // this creates event
      return event.dateGroupsByEvent.nodes.map((dateGroups) => { // if the event has no dates, it is not displayed
        let dates = dateGroups.datesJoinsByDateGroup;
        if (dates.nodes.length === 0) {
          return undefined
        }
        return <EventComponent
          activityId={props.activityId}
          location={dateGroups.addressByAddress}
          seatsLeft={dateGroups.seatsLeft}
          dates={dates}
          id={dateGroups.id}
          price={dateGroups.price}
          key={dateGroups.id} />
      })
    })
    if(events.length === 0){
        return <div style={{background:'white'}}className='center-y section'>
            <img src={SadFace} title='Icon made by Freepik from www.flaticon.com' />
            <h2 style={{color:'rgb(164, 164, 164)'}} className='center-text'>Sorry! We currently aren't offering any {props.activityName.toLowerCase()} at this time.</h2>
        </div>
    }
    return<div className='section container column'>
        <h1 className='center-text'>{props.activityName}</h1>
        {events}
    </div>
}

function Events (props) {
  return <ReactQuery query={GET_EVENTS_OF_TYPE(props.match.params.id)}>
          <EventsInner activityId={props.match.params.id} activityName={props.match.params.name}/>
      </ReactQuery>
}

export default Events
