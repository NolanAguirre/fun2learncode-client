import React, { Component } from 'react'
import { Location } from '../common/Common'
import './EventLogs.css'
import gql from 'graphql-tag'
import {Query} from '../../../delv/delv-react'
// THIS IS NOT TESTED YET
function EventLogTableRow (props) {
  return (
    <tr>
      <td>{new Date(props.date).toDateString()}</td>
      <td>{'' + props.attendance}</td>
      <td>{props.comment}</td>
      <td>no file</td>
    </tr>)
}
class EventLogs extends Component {
  constructor (props) {
    super(props)
    this.eventId = this.props.match.params.eventId
    this.studentId = this.props.match.params.studentId
  }
  render () {
      return<div></div>
    // return (
    //     <QueryHandler query={GET_EVENT_LOGS_FOR_STUDENT(this.eventId, this.studentId)} child={(data)=>{
    //             let address = data.eventById.addressByAddress
    //     return (
    //       <div className='event-logs-container'>
    //         <div className='event-info-container'>
    //           <div className='event-info'>
    //             <h2>{data.eventById.activityByEventType.name}</h2>
    //           </div>
    //           <Location
    //             id={address.id}
    //             alias={address.alias}
    //             street={address.street}
    //             city={address.city}
    //             state={address.state}
    //           />
    //         </div>
    //         <div className='event-logs-table-container'>
    //           <h2>Event Logs</h2>
    //           <table className='event-logs-table'>
    //             <tbody className='event-logs-table-body'>
    //               <tr>
    //                 <th>Date</th>
    //                 <th>Attendane</th>
    //                 <th>Comment</th>
    //                 <th>File</th>
    //               </tr>
    //               {
    //                 data.eventById.eventDatesByEvent.edges.map((element) => {
    //                   let date = element.startTime
    //                   let attendance = element.node.eventRegistrationsByEventDate.node[0].attendance
    //                   let comment = element.node.eventLogsByEventDate.nodes[0].comment
    //                   return <EventLogTableRow
    //                     key={element.id}
    //                     date={date}
    //                     attendance={attendance}
    //                     comment={comment} />
    //                 })
    //               }
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //   )}} />
    //)
  }
}

export default EventLogs
