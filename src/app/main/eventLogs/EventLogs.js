import React, { Component } from 'react'
import moment from 'moment'
import { Location, GridView, SecureRoute} from '../common/Common'
import './EventLogs.css'
import {ReactQuery} from '../../../delv/delv-react'
import InstructorLogForm from '../instructorLogs/InstructorLogs'
// THIS IS NOT TESTED YET
const GET_LOGS = (eventId, studentId) => `{
  allEventLogs(condition: {event: "${eventId}", student: "${studentId}"}) {
    nodes {
      id
      event
      student
      comment
      dateIntervalByDateInterval {
        id
        start
        end
      }
      userByInstructor {
        id
        firstName
        lastName
      }
    }
  }
  allEvents(condition: {id: "${eventId}"}) {
    nodes {
      id
      name
      activityByActivity {
        id
        name
      }
    }
  }
  allStudents(condition: {id: "${studentId}"}) {
    nodes {
      id
      firstName
      lastName
    }
  }
}`

const localize = (timestamp) =>{
    return moment(moment.utc(timestamp)).local()
}

function EventLog(props){
    return <div className="card event-log-card">
        <h3>{localize(props.date.start).format('MMMM, Do h:mm a')} - {localize(props.date.end).format('h:mm a')}</h3>
        <div className='write-event-logs-container'>
            {props.logs.map(log =>{
                const instructor = (log.instructor && log.instructor.firstName) || 'Attendant'
                return <div className='event-log' key={log.key}><div>{instructor} said:</div>{log.comment}</div>
            })}
        </div>
        {props.user.role=== 'FTLC_USER'?'':<InstructorLogForm eventId={props.event} studentId={props.student} dateId={props.date.id} instructorId={props.user.id}/>}
    </div>
}

function EventLogsInner(props) {
    let dates = {}
    const event = props.allEvents.nodes[0]
    const activityName = event.activityByActivity.name
    const student = props.allStudents.nodes[0]
    props.allEventLogs.nodes.forEach((log)=>{
        const start = log.dateIntervalByDateInterval.start
        const newLog = {
            key: log.id,
            comment:log.comment,
            instructor: log.userByInstructor
        }
        if(dates[start]){
            dates[start].logs.push(newLog)
        }else{
            dates[start] = {
                event:event.id,
                student: student.id,
                date:log.dateIntervalByDateInterval,
                logs:[newLog]
            }
        }
    })
    return <div className='main-contents column container'>
        <h2>{student.firstName} {student.lastName}</h2>
        <h3>{activityName}  {event.name}</h3>
        <GridView fillerStyle='card event-log-card' itemsPerRow={3}>
                {Object.values(dates).sort((a,b)=>moment(b.date.start).unix() - moment(a.date.start).unix()).map(date=><EventLog key={date.date.id} user={props.getUserData} {...date} />)}
        </GridView>
    </div>
}

function EventLogs(props){
    return <SecureRoute roles={['FTLC_ADMIN', 'FTLC_OWNER', 'FTLC_INSTRUCTOR', 'FTLC_USER']}>
            <ReactQuery query={GET_LOGS(props.match.params.eventId,props.match.params.studentId)}>
                <EventLogsInner />
            </ReactQuery>
        </SecureRoute>
}

export default EventLogs
