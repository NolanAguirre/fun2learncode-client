import React, { Component } from 'react'
import './ManageStudents.css'
import StudentSelect from '../studentSelect/StudentSelect'
import { ReactQuery } from '../../../delv/delv-react'
import {SecureRoute, Location, GridView, DatesTable, TimeRangeSelector} from '../common/Common'
import moment from 'moment';
import Popup from "reactjs-popup"
const GET_DATES_WITH_STUDENT = (studentId) => {
    return (start, end) => `{
  eventInDates(arg0: "${start}", arg1: "${end}") {
    nodes {
      id
      eventRegistrationsByEvent(condition: {student: "${studentId}"}) {
        nodes {
          id
          student
          eventByEvent {
            id
            activityByActivity {
              name
              id
            }
            dateJoinsByEvent {
              nodes {
                id
                dateIntervalByDateInterval {
                  id
                  start
                  end
                  eventLogsByDateInterval(condition: {student: "${studentId}"}, filter: {instructor: {notEqualTo: null}}) {
                    nodes {
                      student
                      id
                      comment
                      instructor
                      userByInstructor {
                        id
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
    }
  }
}`}

const localize = (timestamp) =>{
    return moment(moment.utc(timestamp)).local()
}

function EventLog(props) {
    return <div>
        <h3>{props.firstName} said...</h3>
        <div>{props.comment}</div>
    </div>
}

function EventLogs(props){
    if (props.logs.length > 0){
        return<div>
            {props.logs.map(log=><EventLog key={log.id} firstName={log.userByInstructor.firstName} comment={log.comment} />)}
        </div>
    }
    return <div>No Logs found</div>
}

class EventMonthDate extends Component {
    constructor(props) {
        super(props);
        this.state = {showPopup: false}
    }

    showPopup = () => {
        this.setState({showPopup: true});
    }

    clearPopupState = () => {
        this.setState({showPopup: false});
    }

    render = () => {
        return <div className='event-month-date-container'>
            <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <EventLogs logs={this.props.date.eventLogsByDateInterval.nodes} />
            </Popup>
            <h3 className='margin-bottom-10'>{this.props.date.activityName}</h3>
            <div className='event-mont-date-body'>
                <span>{localize(this.props.date.start).format('dddd Do')}</span>
                <span onClick={this.showPopup}>View Notes</span>
            </div>
        </div>
    }
}

class EventMonth extends Component{
    constructor (props) {
      super(props)
      this.state = {};
    }
    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local()
    }
    render = () => {
        let dates = this.props.month.slice().sort((a,b)=>{
            return moment(b.start).unix() - moment(a.start).unix()}).map((date)=>{return<EventMonthDate key={moment(date.start).unix()} date={date}/>
        })
        return <React.Fragment>
            <h2>{this.props.monthName}</h2>
                <GridView itemsPerRow={5} className='event-month' fillerStyle='filler-event-month-date-container'>
                    {dates}
                </GridView>
        </React.Fragment>
    }
}

class EventMonths extends Component{
    constructor (props) {
      super(props)
      this.state = {selectedStudent:{}};
    }

    filterToMonth = () => {
        const dates = this.props.eventInDates.nodes.map((e)=>{
            const event = e.eventRegistrationsByEvent.nodes[0] && e.eventRegistrationsByEvent.nodes[0].eventByEvent
            if(event){
                return event.dateJoinsByEvent.nodes.map((date)=>{
                    return {...date.dateIntervalByDateInterval, activityName:event.activityByActivity.name}
                })
            }else{
                return []
            }
        }).reduce((acc, val) => acc.concat(val), []);
        let data = {};
        dates.forEach((date)=>{
            const start = localize(date.start).format('MMMM YYYY')
            if(data[start]){
                data[start].push(date);
            }else{
                data[start] = [date]
            }
        })
        let temp = [];
        for(var key in data){
            temp.push(<EventMonth month={data[key]} monthName={key} key={key} />)
        }
        return temp
    }

    render = () => {
        return <div className="styled-container column">
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
      let child = ''
      if(this.state.selectedStudent){
          child = <TimeRangeSelector query={GET_DATES_WITH_STUDENT(this.state.selectedStudent.id)}>
              <ReactQuery networkPolicy='cache-by-query'>
                  <EventMonths/>
            </ReactQuery>
        </TimeRangeSelector>
    }
      return <div className='manage-students-container main-contents'>
          <StudentSelect setSelected={this.setSelectedStudents} userId={this.props.getUserData.id} createStudent/>
          {child}
      </div>
  }
}

function ManageStudents(props){
    return <SecureRoute roles={['FTLC_USER']}>
        <ManageStudentsInner {...props} />
    </SecureRoute>
}
export default ManageStudents
