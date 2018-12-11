import React, { Component } from 'react'
import './ManageStudents.css'
import StudentSelect from '../studentSelect/StudentSelect'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'
import {SecureRoute, Location} from '../common/Common'
import moment from 'moment';

const GET_DATES_WITH_STUDENT = (studentId) =>{
    return gql`{
	dateIntervalByStudent(studentId:"${studentId}"){
    nodes{
      start
      end
      id
      nodeId
      datesJoinsByDateInterval{
        nodes{
          dateGroupByDateGroup{
            id
            nodeId
            eventByEvent{
              id
              nodeId
              activityByEventType{
                name
                id
                nodeId
              }
            }
          }
        }
      }
    }
  }
}`
}

function EventMonthDate(props){
    return <div className='event-month-date-container'>
        {props.date.datesJoinsByDateInterval.nodes[0].dateGroupByDateGroup.eventByEvent.activityByEventType.name}
    </div>
}

class EventMonth extends Component{
    constructor (props) {
      super(props)
      this.state = {};
    }
    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local().format('MMMM YYYY')
    }
    render = () => {
        let dates = this.props.month.slice().sort((a,b)=>{return moment(b.start).unix() - moment(a.start).unix()}).map((date)=>{return<EventMonthDate key={moment(date.start).unix()} date={date}/>})
        return <div className='event-month'>
            <h4>{this.props.monthName}</h4>
            {dates}
        </div>
    }
}

class EventMonths extends Component{
    constructor (props) {
      super(props)
      this.state = {};
      this.filterToMonth();
    }

    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local().format('MMMM YYYY')
    }

    filterToMonth = () => {
        const dates = this.props.queryResult.dateIntervalByStudent.nodes;
        let data = {};
        dates.forEach((date)=>{
            if(data[this.localizeUTCTimestamp(date.start)]){
                data[this.localizeUTCTimestamp(date.start)].push(date);
            }else{
                data[this.localizeUTCTimestamp(date.start)] = [date]
            }
        })
        let temp = [];
        for(var key in data){
            temp.push(<EventMonth month={data[key]} monthName={key} key={key} />)
        }
        return temp
    }

    render = () => {
        return <div className="event-months-container">
            {this.filterToMonth()}
        </div>
    }
}

class ManageStudentsInner extends Component {
  constructor (props) {
    super(props)
    this.state = {};
  }

  setSelectedStudents = (student) =>{
      this.setState({selectedStudent:student});
  }

  render () {
      return <div className='manage-students-container'>
          Manage Student
          <StudentSelect setSelectedStudents={this.setSelectedStudents} user={this.props.queryResult.getUserData} />
          {this.state.selectedStudent?<QueryHandler query={GET_DATES_WITH_STUDENT(this.state.selectedStudent)}>
            <EventMonths />
            </QueryHandler>:""}
      </div>
  }
}



function ManageStudents(props){
    return <SecureRoute roles={['FTLC_USER']}>
        <ManageStudentsInner {...props} />
    </SecureRoute>
}
export default ManageStudents
