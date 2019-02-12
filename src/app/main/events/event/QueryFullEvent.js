import React, { Component } from 'react'
import './Event.css'
import {DatesTable, CustomProvider} from '../../common/Common'
import {ReactQuery} from '../../../../delv/delv-react'
const GET_EVENT = (id) => `{
  allEvents(condition:{id:"${id}"}){
    nodes{
    	id
      nodeId
      price
      openRegistration
      closeRegistration
      capacity
      name
      activityByActivity{
        nodeId
        name
      }
      addressByAddress{
        nodeId
        alias
        street
        state
        city
        zipcode
      }
      eventRegistrationsByEvent{
        nodes{
          nodeId
          id
          registeredOn
          userByRegisteredBy{
            nodeId
            firstName
            lastName
          }
          studentByStudent{
            nodeId
            firstName
            lastName
          }
        }
      }
      dateJoinsByEvent{
        nodes{
          nodeId
          dateIntervalByDateInterval{
            nodeId
            start
            end
            eventLogsByDateInterval(condition:{event:"${id}"}){
              nodes{
                nodeId
                event
                comment
                userByInstructor{
                  nodeId
                  firstName
                  lastName
                }
                studentByStudent{
                  nodeId
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
}`

function FullEventInner(props){
    const event = props.allEvents.nodes[0]
    if(!event){
        return <div>No event selected</div>
    }
    const address = event.addressByAddress
    const registrations = event.eventRegistrationsByEvent
    return <div className='container column'>
        <div>Activity: {event.activityByActivity.name}</div>
        <div>Event name:{event.name}</div>
        <DatesTable dates={event.dateJoinsByEvent}/>
        {JSON.stringify(props.allEvents)}
    </div>
}

function InBetween(props){
    console.log(props.eventId || props.activeEventProvider.id)
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
