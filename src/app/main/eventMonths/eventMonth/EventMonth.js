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
function StudentEvent(props){
    return (
    <div className="event-month-container">
        <h4>{props.node.eventByEvent.activityByEventType.name}</h4>
        <div>View Dates</div>
        <div>View Notes</div>
        <div>View Files</div>
    </div>)
}
class EventMonth extends Component {
    render() {
        return (
            <div className="month-container">
                <div className="month-header">
                <h2>{monthNames[new Date(this.props.month).getMonth()]}</h2>
                </div>
                <div className="month-body">
                    {
                        this.props.events.edges.map((element)=>{
                            return <StudentEvent key={element.node.event} node={element.node}></StudentEvent>
                        })
                    }
                </div>
            </div>);
    }
}

export default EventMonth;
