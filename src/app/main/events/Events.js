import React, { Component } from 'react'
import './Events.css'
import TimeTableRow from './timeTableRow/TimeTableRow'
import EventComponent from './event/Event'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'
import {GET_EVENTS_OF_TYPE} from '../../Queries'
function Events (props) {
  return (
    <div className='events'>
      <h1 className='events-title'>{props.match.params.name}</h1>
      <QueryHandler query={GET_EVENTS_OF_TYPE(props.match.params.id)} child={(data) =>
        data.allEvents.nodes.map((event) => { // this creates event
          return event.dateGroupsByEvent.nodes.map((dateGroups) => { // if the event has no dates, it is not displayed
            let dates = dateGroups.datesJoinsByDateGroup.nodes
            if (dates.length === 0) {
              return undefined
            }
            console.log(dates)
            return <EventComponent
              activityName={props.match.params.name}
              activityId={props.match.params.id}
              name={props.name}
              description={props.description}
              location={event.addressByAddress}
              capacity={event.capacity}
              date={dates}
              id={event.id}
              price={event.price}
              click={props.click}
              key={dateGroups.id} />
          })
        })

      } />
    </div>)
}

export default Events
