import React, { Component } from 'react'
import './Events.css'
import TimeTableRow from './timeTableRow/TimeTableRow'
import EventComponent from './event/Event'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'
import {GET_EVENTS_OF_TYPE} from '../../Queries'

function EventsInner(props) {
    return props.queryResult.allEvents.nodes.map((event) => { // this creates event
      return event.dateGroupsByEvent.nodes.map((dateGroups) => { // if the event has no dates, it is not displayed
        let dates = dateGroups.datesJoinsByDateGroup.nodes
        if (dates.length === 0) {
          return undefined
        }
        return <EventComponent
          activityName={props.activityName}
          activityId={props.activityId}
          name={props.name}
          description={props.description}
          location={event.addressByAddress}
          capacity={event.capacity}
          date={dates}
          id={event.id}
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
