import React, { Component } from 'react'
import './Events.css'
import TimeTableRow from './timeTableRow/TimeTableRow'
import EventComponent from './event/Event'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'

const GET_EVENTS_OF_TYPE = (id) => {
  return gql`{
  allEvents(orderBy: ADDRESS_ASC, condition: {eventType: "${id}"}) {
    nodes {
      capacity
      id
      price
      nodeId
      addressByAddress {
        nodeId
        id
        city
        street
        state
        alias
        url
      }
      dateGroupsByEvent(filter: {openRegistration: {lessThanOrEqualTo: "${new Date().toISOString()}"}, closeRegistration: {greaterThanOrEqualTo: "${new Date().toISOString()}"}}) {
        nodes {
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
    return props.queryResult.allEvents.nodes.map((event) => { // this creates event
      return event.dateGroupsByEvent.nodes.map((dateGroups) => { // if the event has no dates, it is not displayed
        let dates = dateGroups.datesJoinsByDateGroup.nodes
        if (dates.length === 0) {
          return undefined
        }
        return <EventComponent
          activityId={props.activityId}
          location={event.addressByAddress}
          capacity={event.capacity}
          date={dates}
          id={dateGroups.id}
          price={event.price}
          key={dateGroups.id} />
      })
    })
}
function Events (props) {
  return (
    <div className='events'>
      <h1 className='events-title'>{props.match.params.name}</h1>
      <QueryHandler query={GET_EVENTS_OF_TYPE(props.match.params.id)}>
          <EventsInner activityId={props.match.params.id} activityName={props.match.params.name}/>
      </QueryHandler>
    </div>)
}

export default Events
