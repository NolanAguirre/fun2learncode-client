import React, {Component} from 'react';
import './StudentClasses';
import StudentEvent from './studentEvent/StudentEvent';
import QueryHandler from '../queryHandler/QueryHandler';
import gql from 'graphql-tag';
const GET_EVENTS= (studentId) =>{
    return gql`
    {
      eventsByStudent(studentId: "${studentId}") {
        edges {
          node {
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
    `;
}
class StudentClasses extends Component{
    render(){
        return(
            <QueryHandler query={GET_EVENTS(this.props.id)} inner={(element)=>{return (<StudentEvent key={element.node.id} name={element.node.activityByEventType.name} studentId={this.props.id} eventId={element.node.id}></StudentEvent>)}}></QueryHandler>
        );
    }
}

export default StudentClasses;
