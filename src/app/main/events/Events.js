import React, {Component} from 'react';
import './Events.css';
import TimeTableRow from './timeTableRow/TimeTableRow';
import EventComponent from './event/Event'
import gql from 'graphql-tag';
import QueryHandler from '../queryHandler/QueryHandler';

const GET_EVENTS = (id) => {
    return gql `{
  allEvents(condition: {eventType: "${id}"}) {
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
        eventDatesByEvent{
          edges{
            node{
              id
              dateGroupByDateGroup{
                datesJoinsByDateGroup{
                  edges{
                    node{
                      dateIntervalByDateInterval{
                        start
                        end
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
}`
}
function Events(props) {
    return (<QueryHandler query={GET_EVENTS(props.match.params.id)} child={(data) => {
            return (<div className="events">
                <h1 className="events-title">{props.match.params.name}</h1>
                {
                    data.allEvents.edges.map((event)=>{ // this creates event
                        return event.node.eventDatesByEvent.edges.map((dateGroups) => { // if the event has no dates, it is not displayed
                            let dates = dateGroups.node.dateGroupByDateGroup.datesJoinsByDateGroup.edges;
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
                }
            </div>);
        }}></QueryHandler>);
}

export default Events;
