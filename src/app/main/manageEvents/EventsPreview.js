import React, { Component } from 'react'
import { DropDown } from '../common/Common'
import './EventsPreview.css'
import { GET_EVENTS, GET_DATE_GROUP_INFO_BY_ID } from '../../Queries'
import QueryHandler from '../queryHandler/QueryHandler'
import DateTime from 'react-datetime'
import '../../../react-datetime.css'
import memoize from 'memoize-one'
import Colors from '../calendar/Colors'
import moment from 'moment'
import DateStore from '../../DateStore'

function DateGroup (props) {
  if (false) {
    return <div>not working</div>
  }
  const dates = props.dateGroup.datesJoinsByDateGroup.nodes.map((element) => {
    return <div key={element.id}>{element.dateIntervalByDateInterval.start}</div>
  })
  return (
    <div onClick={() => { props.setActiveDateGroup(props.dateGroup)}} style={{ backgroundColor: Colors.get(props.dateGroup.id).regular }} className='event-preview-date-container'>
      <h4>{props.dateGroup.name}</h4>
      <h4> Show on Calander <input onChange={() => { DateStore.set('toggleDateDisplay', props.dateGroup.id) }} type='checkbox' defaultChecked='true' /> </h4>
      <div>
        {dates}
      </div>
    </div>
  )
}
// {props.dateForm(props.dateGroup.id)}
function Event (props) {
  if (false) {
    return <div>not working</div>
  }
  const dateGroups = props.event.dateGroupsByEvent.nodes.map((element) => { return React.cloneElement(props.children, { key: element.id, dateGroup: element }) })
  return (
    <div className='event-preview-event-container'>
      <div className='event-preview-header'><h3>{props.event.activityByEventType.name}</h3><a>edit</a></div>
      <div>
        {dateGroups}
        {React.cloneElement(props.form, { eventId: props.event.id })}
      </div>
    </div>
  )
}
//
function EventsPreviewChild (props) {
  // console.log(props.queryResult);
  if (!props.queryResult.allEvents) {
    return <div>is broken</div>
  }
  const events = props.queryResult.allEvents.nodes.map((element) => { return React.cloneElement(props.children, { key: element.id, event: element }) })
  return (
    <div className='event-preview-container-container'>
      <div className='event-preview-container'>
        {events}
      </div>
    </div>
  )
}

function DateGroupInfo(props){
    if(props.activeDateGroup === null){
        return <div></div>
    }
    const child  = (dateGroup)=> { console.log(dateGroup)
        let event = dateGroup.eventByEvent;
        return <React.Fragment>
            <table>
                <tbody>
                    <tr>
                        <td>EVENT NAME</td>
                        <td>{event.activityByEventType.name}</td>
                    </tr>
                    <tr>
                        <td>ER OPEN</td>
                        <td>{new Date(event.openRegistration).toUTCString()}</td>
                    </tr>
                    <tr>
                        <td>ER CLOSE</td>
                        <td>{new Date(event.closeRegistration).toUTCString()}</td>
                    </tr>
                    <tr>
                        <td>DG OPEN</td>
                        <td>{new Date(dateGroup.openRegistration).toUTCString()}</td>
                    </tr>
                    <tr>
                        <td>DG CLOSE</td>
                        <td>{new Date(dateGroup.closeRegistration).toUTCString()}</td>
                    </tr>
                </tbody>
            </table>
    </React.Fragment>}
    return(
        <div>
            <QueryHandler query={GET_DATE_GROUP_INFO_BY_ID(props.activeDateGroup.id)} child={(data) => {return child(data.dateGroupById)}} />
        </div>
    )
}

function EventsPreview (props) {
  return <QueryHandler query={GET_EVENTS} child={(data) => {
    return <EventsPreviewChild queryResult={data} {...props} />
  }} />
}

export { Event, DateGroup, EventsPreview, DateGroupInfo}
