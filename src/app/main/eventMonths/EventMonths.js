import React, {Component} from 'react';
import './EventMonths.css';
import EventMonth from './eventMonth/EventMonth';
import QueryHandler from '../queryHandler/QueryHandler';
import gql from 'graphql-tag';
const GET_EVENTS= (studentId) =>{
    return gql`
    {
      monthsByStudent(studentId: "${studentId}") {
        edges {
          node {
            month
            eventMonthsByMonth {
              edges {
                node {
                  eventByEvent {
                    id
                    activityByEventType {
                      name
                    }
                    addressByAddress {
                      alias
                    }
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
class EventMonths extends Component{
    render(){
        return(
            <div className="student-events-container">
                <QueryHandler query={GET_EVENTS(this.props.id)} inner={(element)=>{return (<EventMonth studentId={this.props.id} month={element.node.month} events={element.node.eventMonthsByMonth}></EventMonth>)}}></QueryHandler>
            </div>
    );
    }
}

export default EventMonths;
