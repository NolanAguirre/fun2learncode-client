import React, {Component} from 'react';
import './Events.css';
import TimeTableRow from './timeTableRow/TimeTableRow';
import EventComponent from './event/Event'
import gql from 'graphql-tag';
import QueryHandler from '../queryHandler/QueryHandler';

const GET_EVENTS = (id) => { // TODO group this by address so i dont have to load multiple maps
    return gql `{
  allEvents(orderBy: ADDRESS_ASC, condition: {eventType: "${id}"}) {
    edges {
      node {
        capacity
        id
        price
        addressByAddress {
          id
          city
          street
          state
          alias
          url
        }
        dateGroupsByEvent(filter:{openRegistration:{greaterThanOrEqualTo:"${new Date().toISOString()}"},closeRegistration:{lessThanOrEqualTo:"${new Date().toISOString()}"}}){
          edges {
            node {
              openRegistration
              closeRegistration
              id
              datesJoinsByDateGroup {
                edges {
                  node {
                    dateIntervalByDateInterval {
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
      }
    }
  }
}
`}
function Events(props) {
    return (
        <div className="events">
            <h1 className="events-title">{props.match.params.name}</h1><QueryHandler query={GET_EVENTS(props.match.params.id)} child={(data) =>
                    data.allEvents.edges.map((event)=>{ // this creates event
                        return event.node.dateGroupsByEvent.edges.map((dateGroups) => { // if the event has no dates, it is not displayed
                            let dates = dateGroups.node.datesJoinsByDateGroup.edges;
                            if(dates.length === 0) {
                                return undefined;
                            }
                            console.log(dates);
                            return <EventComponent
                                activityName={props.match.params.name}
                                activityId={props.match.params.id}
                                name={props.name}
                                description={props.description}
                                location={event.node.addressByAddress}
                                capacity={event.node.capacity}
                                date={dates}
                                id={event.node.id}
                                price={event.node.price}
                                click={props.click}
                                key={dateGroups.node.id} />
                        })
                    })


        }></QueryHandler>
    </div>);
}

export default Events;
