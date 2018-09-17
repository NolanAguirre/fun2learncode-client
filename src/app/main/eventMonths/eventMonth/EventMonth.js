import React, {Component} from 'react';
import './EventMonth.css';
import gql from 'graphql-tag';
import QueryHandler from '../../queryHandler/QueryHandler'
const GET_EVENT_LOGS = (eventDate, studentId) => {
    return gql `
    {
	allEventDates(condition:{event:"${eventDate}"}){
        edges{
          node{
             id
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
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
class EventMonth extends Component {
    render() {
        return (
            <div className="student-event-container">
                <h2>{monthNames[new Date(this.props.month).getMonth()]}</h2>
            </div>);
    }
}

export default EventMonth;
