import React, {Component} from 'react'
import moment from 'moment'
import './RecentEvent.css'
import {ReactQuery} from '../../../delv/delv-react'
import {TimeRangeSelector, SecureRoute, GridView} from '../common/Common'
import Popup from 'reactjs-popup'
import {Link} from 'react-router-dom'
import QueryFullEvent from '../events/event/QueryFullEvent'
import xicon from '../../logos/x-icon.svg'

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

const EVENT_REGISTRATIONS = id => `{
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
            dateOfBirth
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

const localize = timestamp => {
    return moment(moment.utc(timestamp)).local()
}

function RecentEventStudent(props) {
    let checkIn =
        (props.attendance && localize(props.attendance.checkInTime).format('h:mm a')) || 'None.'
    return (
        <div className='recent-event-student-conatiner'>
            <h3 className='no-margin'>
                {props.firstName} {props.lastName}
            </h3>
            <div>{moment(props.dateOfBirth).format('MMM YYYY')}</div>
            <div>Check in: {checkIn}</div>
            <Link to={`/logs/${props.eventId}/${props.id}`} target='_blank'>
                View/Write logs
            </Link>
        </div>
    )
}

class RecentEventDay extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render = () => {
        return (
            <div className='recent-event-day-container'>
                <h2>
                    {localize(this.props.start).format('dddd MMMM Do h:mm a')} -{' '}
                    {localize(this.props.end).format('h:mm a')}
                </h2>
                <GridView itemsPerRow={8}>
                    {this.props.students.map(student => (
                        <RecentEventStudent
                            {...student}
                            eventId={this.props.eventId}
                            key={student.id}
                        />
                    ))}
                </GridView>
            </div>
        )
    }
}

class RecentEventDays extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render = () => {
        const event = this.props.allEvents.nodes[0]
        let dates = event.dateJoinsByEvent.nodes.map(date => {
            return {...date.dateIntervalByDateInterval, students: []}
        })
        if (dates) {
            event.eventRegistrationsByEvent.nodes.forEach(reg => {
                dates.forEach(date => {
                    date.students.push({
                        id: reg.studentByStudent.id,
                        firstName: reg.studentByStudent.firstName,
                        lastName: reg.studentByStudent.lastName,
                        dateOfBirth: reg.studentByStudent.dateOfBirth
                    })
                })
                reg.studentByStudent.attendancesByStudent.nodes.forEach(att => {
                    let date = dates.filter(date => date.id === att.dateInterval)[0]
                    if (date) {
                        date.students.filter(
                            s => reg.studentByStudent.id === s.id
                        )[0].attendance = att
                    }
                })
            })
        }
        return (
            <div className='recent-event-days-container'>
                {dates
                    .sort((a, b) => moment(a.start).unix() - moment(b.start).unix())
                    .map(date => {
                        return <RecentEventDay key={date.id} {...date} eventId={event.id} />
                    })}
            </div>
        )
    }
}

function AdminEvent(props) {
    return (
        <div className='manage-addon-container'>
            <div>
                <h1 className='no-margin'>{props.event.activityByActivity.name}</h1>
                <h2 className='no-margin'>{props.event.name}</h2>
                Seats Left: {props.event.seatsLeft} of {props.event.capacity} <br />
                Close: {localize(props.event.closeRegistration).format('MMMM, Do h:mm a')}
            </div>
            <div
                className='recent-event-btn'
                onClick={() => {
                    props.onClick(props.event.id, 'registration')
                }}>
                View Registration Data
            </div>
            <div
                className='recent-event-btn'
                onClick={() => {
                    props.onClick(props.event.id, 'default')
                }}>
                View Event Data
            </div>
        </div>
    )
}

class RecentEventsInner extends Component {
    constructor(props) {
        super(props)
        this.state = {showPopup: false, UI: 'default'}
    }
    showPopup = (eventId, UI) => {
        this.setState({showPopup: true, eventId, UI})
    }
    clearPopupState = () => {
        this.setState({showPopup: false, eventId: undefined, UI: 'default'})
    }
    render = () => {
        const events = this.props.data.eventInDates.nodes
            .sort((a, b) => a.closeRegistration < b.closeRegistration)
            .map(event => {
                return <AdminEvent event={event} onClick={this.showPopup} key={event.id} />
            })
        let popupInner = <QueryFullEvent eventId={this.state.eventId} />
        if (this.state.UI === 'registration') {
            popupInner = (
                <ReactQuery query={EVENT_REGISTRATIONS(this.state.eventId)}>
                    <RecentEventDays />
                </ReactQuery>
            )
        }
        return (
            <div className='recent-events-container'>
                <Popup
                    open={this.state.showPopup}
                    closeOnDocumentClick={false}
                    onClose={this.clearPopupState}
                    className='popup'>
                    <div className='popup-inner'>
                        <div className='close-popup'>
                            <img onClick={this.clearPopupState} src={xicon}/>
                        </div>
                        {popupInner}
                    </div>
                </Popup>
                <GridView fillerStyle='manage-addon-container' itemsPerRow={3}>
                    {events}
                </GridView>
            </div>
        )
    }
}

function RecentEvents(props) {
    return (
        <SecureRoute roles={['FTLC_ADMIN', 'FTLC_OWNER']} ignoreResult>
            <div className='main-contents column'>
                <TimeRangeSelector query={RECENT_EVENT}>
                    <ReactQuery networkPolicy='network-no-cache'>
                        <RecentEventsInner />
                    </ReactQuery>
                </TimeRangeSelector>
            </div>
        </SecureRoute>
    )
}

export default RecentEvents
