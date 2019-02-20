import React, { Component } from 'react'
import moment from 'moment'
import './RecentEvent.css'
import {ReactQuery} from '../../../delv/delv-react'
import {TimeRangeSelector, SecureRoute, GridView} from '../common/Common'
import Popup from "reactjs-popup"
import {Link} from 'react-router-dom'

const RECENT_EVENT = (start, end) => `{
  eventInDates(arg0: "${start}", arg1: "${end}") {
    nodes {
      id
      name
      seatsLeft
      capacity
      closeRegistration
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
      activityByActivity{
        id
        name
      }
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

const localize = (timestamp) =>{
    return moment(moment.utc(timestamp)).local()
}

function RecentEventStudent(props){
    let checkIn = (props.attendance && localize(props.attendance.checkInTime).format('h:mm a')) || 'None found.'
    return <div>
        <h3 className='no-margin'>{props.firstName} {props.lastName}</h3>
        <div>Check in: {checkIn}</div>
        <Link to={`/Logs/${props.eventId}/${props.id}`}>View/Write logs</Link>
    </div>
}
class RecentEventDay extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render = () => {
        return <div className='recent-event-day-container'>
            <h2>{localize(this.props.start).format('dddd MMMM Do')}</h2>
            <span>{localize(this.props.start).format('h:mm a')} - {localize(this.props.end).format('h:mm a')}</span>
            <GridView>
                {this.props.students.map((student)=><RecentEventStudent {...student} eventId={this.props.eventId} key={student.id}/>)}
            </GridView>
        </div>
    }
}

class RecentEventDays extends Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    render = () => {
        const event = this.props.allEvents.nodes[0]
        let dates = event.dateJoinsByEvent.nodes.map(date=>{return{...date.dateIntervalByDateInterval, students:[]}}).sort((a,b)=>a.start < b.start)
        if(dates){
            event.eventRegistrationsByEvent.nodes.forEach((reg)=>{
                dates.forEach((date)=>{
                    date.students.push({
                        id:reg.studentByStudent.id,
                        firstName:reg.studentByStudent.firstName,
                        lastName:reg.studentByStudent.lastName,
                    })
                })
                reg.studentByStudent.attendancesByStudent.nodes.forEach((att)=>{
                    let date = dates.filter((date)=>date.id === att.dateInterval)[0]
                    if(date){
                        date.students.filter((s)=>reg.studentByStudent.id === s.id)[0].attendance = att
                    }
                })
            })
        }
        console.log(dates)
        return <div>
            {dates.map((date)=>{
                return <RecentEventDay key={date.id} {...date} eventId={event.id}/>
            })}
        </div>
        return <div>
            No Dates planned for this event
        </div>
    }
}

function AdminEvent(props){
    return <div className='recent-event'>
        <div>
            <h1 className='no-margin'>{props.event.activityByActivity.name}</h1>
            <h2 className='no-margin'>{props.event.name}</h2>
            Registration: {props.event.seatsLeft} of {props.event.capacity} <br/>
            Close: {localize(props.event.closeRegistration).format('MMMM, Do h:mm a')}
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
        const events = this.props.data.eventInDates.nodes.sort((a,b)=>a.closeRegistration<b.closeRegistration).map((event)=>{
            return <AdminEvent event={event} onClick={this.showPopup} key={event.id}/>
        })
        return <div className='recent-events-container'>
        <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState} className='main-contents'>
            <ReactQuery query={EVENT_REGISTRATIONS(this.state.eventId)}>
                <RecentEventDays/>
            </ReactQuery>
        </Popup>
        <GridView itemsPerRow={3}>
            {events}
        </GridView>
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
