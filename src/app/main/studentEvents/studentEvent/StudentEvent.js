import React, {Component} from 'react';
import './StudentEvent.css';
import gql from 'graphql-tag';
import QueryHandler from '../../queryHandler/QueryHandler'
const GET_EVENT_LOGS = (eventDate, studentId) => {
    return gql `
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
function StudentEventInner(props) {
    return (
    <div>
        <div>{JSON.stringify(props)}</div>
    </div>)
}
class StudentEvent extends Component {
    render() {
        return (
            <div className="student-event-container">
                <h2>{this.props.name}</h2>
                <QueryHandler query={GET_EVENT_LOGS(this.props.eventId, this.props.studentId)}
                inner={(element) => {
                    return <StudentEventInner node={element}></StudentEventInner>
                }}></QueryHandler>
            </div>);
    }
}

export default StudentEvent;
