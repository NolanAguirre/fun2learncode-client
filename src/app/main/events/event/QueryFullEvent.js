import React, { Component } from 'react'
import './Event.css'
import {DatesTable, CustomProvider} from '../../common/Common'
import {ReactQuery} from '../../../../delv/delv-react'
import moment from 'moment'

const GET_EVENT = (id) => `{
  allEvents(condition: {id: "${id}"}) {
    nodes {
      id
      nodeId
      price
      openRegistration
      closeRegistration
      capacity
      name
      seatsLeft
      addOnJoinsByEvent{
        nodes{
          nodeId
          id
          addOnByAddOn{
            nodeId
            id
            price
            name
            description
          }
        }
      }
      activityByActivity {
        nodeId
        name
      }
      addressByAddress {
        nodeId
        alias
        street
        state
        city
        zipcode
      }
      dateJoinsByEvent {
        nodes {
          nodeId
          dateIntervalByDateInterval {
            nodeId
            start
            end
          }
        }
      }
    }
  }
}`

function localizeUTCTimestamp(timestamp){
    return moment(moment.utc(timestamp)).local()
}

function FullEventInner(props){
    const event = props.allEvents.nodes[0]
    if(!event){
        return <div>No event selected</div>
    }
    const address = event.addressByAddress
    const addons = event.addOnJoinsByEvent.nodes.map((a)=>{
        return <div key={a.id} className='query-event-addon-container'>
              <h3>{a.addOnByAddOn.name}</h3>
              <div className='addon-container-description'>
                  {a.addOnByAddOn.description}
              </div>
              <div>
                  {a.addOnByAddOn.price}$
              </div>
        </div>
    })
    return <div className='container column'>
        <h1>Event info</h1>
        <table>
            <tbody>
                <tr>
                    <td>Activity:</td>
                    <td>{event.activityByActivity.name}</td>
                    <td>Event name:</td>
                    <td>{event.name}</td>
                </tr>
                <tr>
                    <td>Price:</td>
                    <td>{event.price}</td>
                    <td>Seats left:</td>
                    <td>{event.seatsLeft} of {event.capacity}</td>
                </tr>
                <tr>
                    <td>Open:</td>
                    <td>{localizeUTCTimestamp(event.openRegistration).format('MMM Do YYYY h:mm a')}</td>
                    <td>Close:</td>
                    <td>{localizeUTCTimestamp(event.closeRegistration).format('MMM Do YYYY h:mm a')}</td>
                </tr>
            </tbody>
        </table>
        <div className='query-event-date-container'>
            <DatesTable dates={event.dateJoinsByEvent}/>
              <div>
                <h3 className='center-text'>{address.alias}</h3>
                <div>{address.street}, {address.city} {address.state}</div>
              </div>
        </div>
        {(addons.length > 0)?<h2>Available Add-ons</h2>:''}
        <div className='registration-addons-container'>
            {addons}
        </div>
    </div>
}

function InBetween(props){
    return <ReactQuery query={GET_EVENT(props.eventId || props.activeEventProvider.id)}>
        <FullEventInner />
    </ReactQuery>
}

function FullEvent(props){
    return <CustomProvider propName='activeEvent'>
        <InBetween/>
    </CustomProvider>
}

export default FullEvent
