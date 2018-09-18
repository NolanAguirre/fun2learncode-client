import React, {Component} from 'react';
import './EventMonth.css';
import { Link } from "react-router-dom";
import gql from 'graphql-tag';
import QueryHandler from '../../queryHandler/QueryHandler'

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
function StudentEvent(props){
    return (
    <div className="event-month-container">
        <h4>{props.name}</h4>
        <div className="event-month-link"><Link to={`/Event Logs/${props.eventId}/${props.studentId}`}>View Details <br/> & <br/> Logs</Link></div>
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
                            return <StudentEvent
                                 key={element.node.event}
                                 eventId={element.node.event}
                                 name={element.node.eventByEvent.activityByEventType.name}
                                 studentId={this.props.studentId}></StudentEvent>
                        })
                    }
                </div>
            </div>);
    }
}

export default EventMonth;
