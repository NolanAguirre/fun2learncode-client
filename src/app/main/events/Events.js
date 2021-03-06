import React, { Component } from 'react'
import './Events.css'
import EventComponent from './event/Event'
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment'
import SadFace from '../../logos/sadface.svg'
import {GridView} from '../common/Common'
const NOW = new Date().toISOString()
const GET_EVENTS_OF_TYPE = (id) => {
  return `{
  allEvents(condition: {activity: "${id}", publicDisplay:true}, filter: {openRegistration: {lessThanOrEqualTo: "${NOW}"}, closeRegistration: {greaterThanOrEqualTo: "${NOW}"}, seatsLeft: {greaterThan: 0}}) {
    nodes {
      id
      activity
      price
      capacity
      seatsLeft
      name
      openRegistration
      closeRegistration
      publicDisplay
      addressByAddress {
        id
        city
        street
        state
        alias
      }
      dateJoinsByEvent {
        nodes {
          id
          dateIntervalByDateInterval {
            id
            end
            start
          }
        }
      }
    }
  }
}`}

function EventsInner(props) { // TODO group this by address so i dont have to load multiple maps
    let events = props.allEvents.nodes.map((event) => { // if the event has no dates, it is not displayed
      return <EventComponent
        activityId={props.activityId}
        location={event.addressByAddress}
        seatsLeft={event.seatsLeft}
        dates={event.dateJoinsByEvent}
        id={event.id}
        price={event.price}
        key={event.id} />
    })
    if(events.length === 0){
        return <div className='center-y main-contents'>
            <img src={SadFace} title='Icon made by Freepik from www.flaticon.com' />
            <h2 style={{color:'rgb(164, 164, 164)'}} className='center-text'>Sorry! We currently aren't offering any {props.activityName.toLowerCase()} at this time.</h2>
        </div>
    }
    return <div className='main-contents container column'>
        <h1 className='category-header'>{props.activityName}</h1>
        <GridView fillerStyle='card event-card' itemsPerRow={2} >{events}</GridView>
    </div>
}

function Events (props) {
  return <ReactQuery query={GET_EVENTS_OF_TYPE(props.match.params.id)}>
          <EventsInner activityId={props.match.params.id} activityName={props.match.params.name}/>
      </ReactQuery>
}

export default Events
