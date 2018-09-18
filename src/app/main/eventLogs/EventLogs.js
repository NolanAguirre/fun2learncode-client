import React, {Component} from 'react';
import {Location} from '../common/Common'
import './EventLogs.css'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const GET_EVENT_LOGS = (eventId, studentId) =>{
    return gql`
    {
      eventById(id:"${eventId}"){
          activityByEventType{
             name
           }
           price
           addressByAddress{
             id
             alias
             city
             street
             state
             url
         }
        eventDatesByEvent{
          edges{
            node{
            id
            startTime
            eventRegistrationsByEventDate(condition:{student:"${studentId}"}){
                edges{
                  node{
                    registeredOn
                    attendance
                  }
                }
              }
              eventLogsByEventDate(condition:{student:"${studentId}"}){
                edges{
                  node{
                    comment
                    userByInstructor{
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
}
function EventLogTableRow(props){
    return(
    <tr>
        <td>{new Date(props.date).toDateString()}</td>
        <td>{""+props.attendance}</td>
        <td>{props.comment}</td>
        <td>no file</td>
    </tr>)
}
class EventLogs extends Component{
    constructor(props){
        super(props);
        this.eventId = this.props.match.params.eventId;
        this.studentId = this.props.match.params.studentId;
    }
    render(){
        return (
                <Query query={GET_EVENT_LOGS(this.eventId, this.studentId)}>
                {({loading,error,data}) => {
                    if (loading) {
                        return 'Loading...';
                    }
                    if (error) {
                        return `Error! ${error.message}`;
                    }
                    let address = data.eventById.addressByAddress;
                    return(
                        <div className="event-logs-container">
                            <div className="event-info-container">
                                <div className="event-info">
                                    <h2>{data.eventById.activityByEventType.name}</h2>
                                </div>
                                <Location
                                    id={address.id}
                                    alias={address.alias}
                                    street={address.street}
                                    city={address.city}
                                    state={address.state}
                                     ></Location>
                            </div>
                            <div className="event-logs-table-container">
                                <h2>Event Logs</h2>
                                <table className="event-logs-table">
                                    <tbody className="event-logs-table-body">
                                        <tr>
                                            <th>Date</th>
                                            <th>Attendane</th>
                                            <th>Comment</th>
                                            <th>File</th>
                                        </tr>
                                        {
                                            data.eventById.eventDatesByEvent.edges.map((element)=>{
                                                let date = element.node.startTime;
                                                let attendance =  element.node.eventRegistrationsByEventDate.edges[0].node.attendance;
                                                let comment = element.node.eventLogsByEventDate.edges[0].node.comment;
                                                return <EventLogTableRow
                                                    key={element.node.id}
                                                    date={date}
                                                    attendance={attendance}
                                                    comment={comment}></EventLogTableRow>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }}
                </Query>
        );
    }
}

export default EventLogs;
