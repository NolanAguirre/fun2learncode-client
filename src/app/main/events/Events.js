import React, { Component } from 'react'
import './Events.css'
import EventComponent from './event/Event'
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment'
import Cache from '../../../delv/Cache'
const GET_EVENTS_OF_TYPE = (id) => {
  return `{
  allEvents(condition: {eventType: "${id}"}, filter: {openRegistration: {lessThanOrEqualTo: "${new Date().toISOString()}"}, closeRegistration: {greaterThanOrEqualTo: "${new Date().toISOString()}"}}) {
    nodes {
      id
      nodeId
      dateGroupsByEvent(filter: {openRegistration: {lessThanOrEqualTo: "${new Date().toISOString()}"}, closeRegistration: {greaterThanOrEqualTo: "${new Date().toISOString()}"}}) {
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
    console.log(Cache.cache)
    let events = props.queryResult.allEvents.nodes.map((event) => { // this creates event
      return event.dateGroupsByEvent.nodes.map((dateGroups) => { // if the event has no dates, it is not displayed
        let dates = dateGroups.datesJoinsByDateGroup;
        if (dates.nodes.length === 0) {
          return undefined
        }
        return <EventComponent
          activityId={props.activityId}
          location={dateGroups.addressByAddress}
          capacity={dateGroups.capacity}
          dates={dates}
          id={dateGroups.id}
          price={dateGroups.price}
          key={dateGroups.id} />
      })
    })
    if(events.length > 0){
        return events
    }
    return <div>There are no open events right now</div>
}

function Events (props) {
  return (
    <div className='events'>
      <h1 className='events-title'>{props.match.params.name}</h1>
      <ReactQuery query={GET_EVENTS_OF_TYPE(props.match.params.id)}>
          <EventsInner activityId={props.match.params.id} activityName={props.match.params.name}/>
      </ReactQuery>
    </div>)
}

export default Events
