import React, { Component } from 'react'
import moment from 'moment'
import {ReactQuery} from '../../../delv/delv-react'
import {TimeRangeSelector, SecureRoute} from '../common/Common'
import Popup from "reactjs-popup"

const RECENT_EVENT = (start, end) => `{
  eventInDates(arg0: "${start}", arg1: "${end}") {
    nodes {
      id
      name
      seatsLeft
      capacity
      activityByActivity{
        id
        name
      }
    }
  }
}`

const EVENT_REGISTRATIONS = (id) => `{
  allEvents(condition: {id: "${id}"}) {
    nodes {
      id
      dateJoinsByEvent {
        nodes {
          id
          dateIntervalByDateInterval {
            id
            start
            end
          }
        }
      }
      eventRegistrationsByEvent {
        nodes {
          id
          studentByStudent {
            id
            firstName
            lastName
            eventLogsByStudent(condition: {event: "${id}"}) {
              nodes {
                event
                id
                dateInterval
                comment
                userByInstructor {
                  firstName
                  lastName
                }
              }
            }
            attendancesByStudent(condition: {event: "${id}"}) {
              nodes {
                id
                event
                dateInterval
                checkInTime
              }
            }
          }
        }
      }
    }
  }
}`

class RecentEventStudent extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render = () => {
        //date header
        //student container
        //student name, view/write logs thing, attendance

        console.log(this.props)
        return <div>
            <h2>{moment(this.props.dateIntervalByDateInterval.start).format('dddd')}</h2>
            <span>{moment(this.props.dateIntervalByDateInterval.start).format('h:mm a')} - {moment(this.props.dateIntervalByDateInterval.end).format('h:mm a')}</span>

        </div>
    }
}

class RecentEventsStudents extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render = () => {
        const event = this.props.allEvents.nodes[0]
        let dates = event.dateJoinsByEvent.nodes.map(date=>{return{...date, logs:[], attendances:[]}})
        if(dates){
            event.eventRegistrationsByEvent.nodes.forEach((reg)=>{
                const student = {
                    id:reg.studentByStudent.id,
                    firstName:reg.studentByStudent.firstName,
                    lastName:reg.studentByStudent.lastName
                }
                reg.studentByStudent.attendancesByStudent.nodes.forEach((att)=>{
                    dates.filter((date)=>{date.id === att.dateInterval})[0].attendances.push({...att, student})
                })

                reg.studentByStudent.eventLogsByStudent.nodes.forEach((log)=>{
                    dates.filter((date)=>{date.id === log.dateInterval})[0].logs.push({...log, student})
                })
            })
        }
        return <div>
            {dates.map((date)=>{
                return <RecentEventStudent key={date.id} {...date}/>
            })}
            {JSON.stringify(dates)}
        </div>
    }
}

function AdminEvent(props){
    return <div>
        <div>
            <h1 className='no-margin'>{props.event.activityByActivity.name}</h1>
            <h2 className='no-margin'>{props.event.name}</h2>
            Registration: {props.event.seatsLeft} of {props.event.capacity}
        </div>
        <div onClick={()=>{props.onClick(props.event.id)}}>
            View Registration Data
        </div>
    </div>
}

class RecentEventsInner extends Component{
    constructor(props){
        super(props)
        this.state = {showPopup:false}
    }
    showPopup = (eventId) => {
        this.setState({showPopup:true, eventId})
    }
    clearPopupState = () => {
        this.setState({showPopup:false, eventId:undefined})
    }
    render = () => {
        const events = this.props.data.eventInDates.nodes.map((event)=>{
            return <AdminEvent event={event} onClick={this.showPopup} key={event.id}/>
        })
        return <div>
        <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState} className='main-contents'>
            <ReactQuery query={EVENT_REGISTRATIONS(this.state.eventId)}>
                <RecentEventsStudents/>
            </ReactQuery>
        </Popup>
            {events}
        </div>
    }
}

function RecentEvents(props){
    return <SecureRoute roles={['FTLC_ADMIN', 'FTLC_OWNER', 'FTLC_INSTRUCTOR']} ignoreResult>
        <div className='main-contents'>
            <TimeRangeSelector query={RECENT_EVENT}>
                <ReactQuery networkPolicy='network-no-cache'>
                    <RecentEventsInner />
                </ReactQuery>
            </TimeRangeSelector>
        </div>
    </SecureRoute>
}

export default RecentEvents
