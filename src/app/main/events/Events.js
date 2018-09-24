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
class Events extends Component {

    render() {
        return (<div className="events">
            <h1 className="events-title">{this.props.match.params.name}</h1>
            <QueryHandler query={GET_EVENTS(this.props.match.params.id)} inner={(element) => {
                    let sessions = element.node.eventDatesByEvent.edges;
                    return sessions.map((el)=>{
                        let dates = el.node.dateGroupByDateGroup.datesJoinsByDateGroup.edges
                        return <EventComponent
                                activityName={this.props.match.params.name}
                                activityId={this.props.match.params.id}
                                name={this.props.name}
                                description={this.props.description}
                                location={element.node.addressByAddress}
                                capacity={element.node.capacity}
                                date={dates}
                                id={element.node.id}
                                price={element.node.price}
                                click={this.props.click}
                                key={element.node.id}></EventComponent>
                    })
                }}></QueryHandler>
        </div>);
    }
}

export default Events;
