import React, {Component} from 'react';
import './EventMonths.css';
import EventMonth from './eventMonth/EventMonth';
import QueryHandler from '../queryHandler/QueryHandler';
import gql from 'graphql-tag';
const GET_EVENTS= (studentId) =>{
    return gql`
    {
      eventsByStudent(studentId:"${studentId}"){
        edges{
          node{
            id
            activityByEventType{
              name
            }
            eventMonthsByEvent{
              edges{
                node{
                  monthByMonth{
                    month
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
    formatData(data){
        function getUniqueMonths(){
            let temp = [];
            data.eventsByStudent.edges.map((element)=>{
               return element.node.eventMonthsByEvent.edges.filter((value, index, self)=> {
                   return self.indexOf(value) === index;
               }).map((el)=>{return el.node.monthByMonth.month}).forEach((el)=>{
                   if(!temp.includes(el)){
                       temp.push(el);
                   }
               })
           })
           return temp;
        }
        function getEventsInMonth(month){
            return data.eventsByStudent.edges.filter((element)=>{
                let temp = false;
                element.node.eventMonthsByEvent.edges.filter((value, index, self)=> {
                    return self.indexOf(value) === index;
                }).map((el)=>{return el.node.monthByMonth.month}).forEach((el)=>{
                    if(el === month){
                        temp = true;
                    }
                })
                return temp;
            })
        }
        let months = {
            edges:getUniqueMonths()
        }

        let temp = {something:{edges:months.edges.map((element)=>{
            return {
                month:element,
                events:getEventsInMonth(element)
            }
        })}}
        console.log(temp)
        return temp;
    }
    render(){
        return(
            <div className="student-events-container">
                <QueryHandler
                    formatData={(data)=>{return this.formatData(data)}}
                    inner={(element)=>{return (<EventMonth key={element.month} studentId={this.props.studentId} month={element.month} events={element.events}></EventMonth>)}}
                    query={GET_EVENTS(this.props.studentId)}></QueryHandler>
            </div>
    );
    }
}

export default EventMonths;
