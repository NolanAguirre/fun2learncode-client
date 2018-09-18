import React, {Component} from 'react';
import gql from 'graphql-tag';
import QueryHandler from '../queryHandler/QueryHandler';

const GET_EVENT_LOGS = (eventId, studentId) =>{
    return gql`
    {
      eventById(id:"${eventId}"){
        eventDatesByEvent{
          edges{
            node{
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
    }
    `
}

class EventLogs extends Component{
    constructor(props){
        super(props);
        this.eventId = this.props.match.params.eventId;
        this.studentId = this.props.match.params.studentId;
    }
    render(){
        return (
            <div>
                <QueryHandler
                    query={GET_EVENT_LOGS(this.eventId, this.studentId)}
                    formatData={(data)=>{return data.eventById}}
                    inner={(element)=>{return<div>{JSON.stringify(element.node)}</div>}}></QueryHandler>
            </div>
        );
    }
}

export default EventLogs;
