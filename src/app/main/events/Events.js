import React, {Component} from 'react';
import './Events.css';
import TimeTableRow from './timeTableRow/TimeTableRow';
import EventComponent from './event/Event'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const GET_EVENTS = (id) => {
    return gql `{
          activityById(id: "${id}") {
            name
            description
            eventsByEventType {
              edges {
                node {
                    capacity
                    id
                    price
                  addressByAddress {
                    city
                    street
                    alias
                    url
                  }
                  eventDatesByEvent(orderBy:START_TIME_ASC) {
                    edges {
                      node {
                        id
                        startTime
                        endTime
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
        return (<Query query={GET_EVENTS(this.props.match.params.id)}>{
                ({loading, error, data}) => {
                    if (loading) {
                        return 'Loading...';
                    }
                    if (error) {
                        return `Error! ${error.message}`;
                    }
                    return (<div className="events">
                        <h1 className="events-title">{data.activityById.name}</h1>
                        {
                            data.activityById.eventsByEventType.edges.map((element) => {
                                let dates = element.node.eventDatesByEvent.edges.map((date, index) => {
                                    return <TimeTableRow data={date.node} key={index}></TimeTableRow>
                                })
                                return <EventComponent node={{
                                        name: this.props.name,
                                        description: this.props.description,
                                        location: element.node.addressByAddress,
                                        capacity: element.node.capacity,
                                        date: dates,
                                        id: element.node.id,
                                        price: element.node.price
                                    }} key={element.node.id}></EventComponent>
                            })
                        }
                    </div>);
                }

            }
        </Query>)
    }
}

export default Events;
