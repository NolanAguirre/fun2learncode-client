import React, { Component } from 'react'
import './ManageStudents.css'
import StudentSelect from '../studentSelect/StudentSelect'
import { ReactQuery } from '../../../delv/delv-react'
import {SecureRoute, GridView, TimeRangeSelector, RoutePopup} from '../common/Common'
import moment from 'moment';
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
                  eventLogsByDateInterval(condition: {student: "${studentId}"}) {
                    nodes {
                      student
                      id
                      comment
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

const localize = (timestamp) => moment(moment.utc(timestamp)).local()


function EventLog(props) {
    return <div className='event-log'><span className='manage-students-instructor'>{props.firstName} said:</span><br /> {props.comment}</div>
}

function EventMonthDate(props){
    const logsPopup = () => {
        props.popup.open(
            <React.Fragment>
            <div className='payment-container'>
                <h1>{props.date.activityName} {localize(props.date.start).format('dddd Do')}</h1>
                {props.date.eventLogsByDateInterval.nodes.map(log=><EventLog key={log.id} firstName={log.userByInstructor.firstName} comment={log.comment} />)}
            </div>
            </React.Fragment>)
    }
    return <div className='event-month-date-container'>
        <h3 className='margin-bottom-10'>{props.date.activityName}</h3>
        <div className='event-mont-date-body'>
            <span>{localize(props.date.start).format('dddd Do')}</span>
            <span onClick={logsPopup}>View Notes</span>
        </div>
    </div>
}

function EventMonth(props){
    const dates = props.month.slice().sort((a,b)=>{
        return moment(b.start).unix() - moment(a.start).unix()}).map((date)=>{return<EventMonthDate popup={props.popup} key={moment(date.start).unix()} date={date}/>
    })
    return <React.Fragment>
        <h2>{props.monthName}</h2>
            <GridView itemsPerRow={5} className='event-month' fillerStyle='event-month-date-container'>
                {dates}
            </GridView>
    </React.Fragment>
}

function EventMonths(props){
    const dates = props.data.eventInDates.nodes.map((e)=>{
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
        temp.push(<EventMonth month={data[key]} monthName={key} key={key} popup={props.popup}/>)
    }
    return <div className="event-months">
        {temp}
    </div>
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
                  <EventMonths popup={this.props.popup}/>
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
export default RoutePopup(ManageStudents)
