import React, {Component} from 'react';
import './StudentEvent';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
const GET_EVENT_LOGS = (eventDate, studentId) =>{
    return gql`
    {
	allEventDates(condition:{event:"${eventDate}"}){
        edges{
          node{
            startTime
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
`;
}
class StudentEvent extends Component{
    render(){
        return(
            <Query query={GET_EVENT_LOGS(this.props.eventId, this.props.studentId)}>
            {({loading,error,data}) => {
                if (loading) {
                    return 'Loading...';
                }
                if (error) {
                    return `Error! ${error.message}`;
                }
                return(
                    <div>
                    <h2>{this.props.name}</h2>
                        {JSON.stringify(data.allEventDates)}
                    </div>
                );
            }}
            </Query>
        )
    }
}

export default StudentEvent;
