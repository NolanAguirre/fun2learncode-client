import React, { Component } from 'react'
import { DropDown } from '../common/Common'
import './EventsPreview.css'
import { gql_Event, GET_DATE_GROUP_INFO_BY_ID } from '../../Queries'
import QueryHandler from '../queryHandler/QueryHandler'
import DateTime from 'react-datetime'
import '../../../react-datetime.css'
import memoize from 'memoize-one'
import Popup from "reactjs-popup"
import Colors from '../calendar/Colors'
import moment from 'moment'
import DateStore from '../../DateStore'
import EventForm from './EventForm';

function DateGroup (props) {
  if (false) {
    return <div>not working</div>
  }
  const dates = props.dateGroup.datesJoinsByDateGroup.nodes.slice().sort((a,b)=>{return moment(a.dateIntervalByDateInterval.start).unix() - moment(b.dateIntervalByDateInterval.start).unix()}).map((element) => {
    return <div key={element.id}>{moment(moment.utc(element.dateIntervalByDateInterval.start)).local().format("MMM Do h:mma") + "-" +moment(moment.utc(element.dateIntervalByDateInterval.end)).local().format("h:mma")}</div>
  })
  const backgroundColor = (props.dateGroup.id == props.activeDateGroup.id)? Colors.get(props.dateGroup.id).hover : Colors.get(props.dateGroup.id).regular
  return (
    <div onClick={() => {props.setActiveDateGroup(props.dateGroup)}} style={{ backgroundColor }} className='event-preview-date-container'>
      <h4>{props.dateGroup.name}</h4>
      <h4> Show on Calander <input onChange={() => { DateStore.set('toggleDateDisplay', props.dateGroup.id) }} type='checkbox' defaultChecked='true' /> </h4>
      <div>
        {dates}
      </div>
    </div>
  )
}
// {props.dateForm(props.dateGroup.id)}
class Event extends Component {
    constructor(props){
        super(props);
        this.state = {
            showPopup: false
        }
    }
    showPopup = () =>{
        this.setState({showPopup:true});
    }
    clearPopupState = () =>{
        this.setState({showPopup:false});
    }
    render = () => {
        if (false) {
            return <div>not working</div>
        }
        const event = this.props.event;
        const dateGroups = event.dateGroupsByEvent.nodes.map((element) => { return React.cloneElement(this.props.children, { key: element.id, dateGroup: element }) })
        return (
            <React.Fragment>
                <Popup
                open={this.state.showPopup}
                closeOnDocumentClick
                onClose={this.clearPopupState}>
                    <EventForm id={event.id}
                        nodeId={event.nodeId}
                        openRegistration={event.openRegistration}
                        closeRegistration={event.closeRegistration}
                        price={event.price}
                        capacity={event.capacity}
                        address={event.addressByAddress.id}
                        eventType={event.activityByEventType.id}/>
                </Popup>
                <div className='event-preview-event-container'>
                    <div className='event-preview-header'><h3>{event.activityByEventType.name}</h3><a onClick={this.showPopup}>edit</a></div>
                    <div>
                        {dateGroups}
                        {React.cloneElement(this.props.form, { eventId: this.props.event.id })}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function DateGroupInfoInner(props) {
    console.log(props)
    const dateGroup = props.queryResult.dateGroupById;
    if(!dateGroup){
        return <div></div>
    }
    const event = dateGroup.eventByEvent;
    return <table>
        <tbody>
            <tr>
                <td>Name</td>
                <td>{event.activityByEventType.name}</td>
                <td>@ {event.addressByAddress.alias}</td>
            </tr>
            <tr>
                <td>Event registration</td>
                <td>{moment(event.openRegistration).format("MMM Do YYYY")}</td>
                <td>to {moment(event.closeRegistration).format("MMM Do YYYY")}</td>
            </tr>
            <tr>
                <td>Date group registration</td>
                <td>{moment(dateGroup.openRegistration).format("MMM Do YYYY")}</td>
                <td>to {moment(dateGroup.closeRegistration).format("MMM Do YYYY")}</td>
            </tr>
        </tbody>
    </table>
}
function DateGroupInfo(props){
    if(!props.activeDateGroup.id){
        return <div></div>
    }
    return<div>
            <QueryHandler query={GET_DATE_GROUP_INFO_BY_ID(props.activeDateGroup.id)}>
                <DateGroupInfoInner />
            </QueryHandler>
        </div>
}
function EventsPreviewInner (props) {
  if (!props.queryResult.allEvents) {
    return <div>is broken</div>
  }
  return props.queryResult.allEvents.nodes.map((element) => { return React.cloneElement(props.children, { key: element.id, event: element }) })
}

function EventsPreview (props) {
    return <div className='event-preview-container-container'>
        <div className='event-preview-container'>
            <QueryHandler query={gql_Event.queries.GET_EVENTS}>
              <EventsPreviewInner>{props.children}</EventsPreviewInner>
            </QueryHandler>
        </div>
    </div>
}

export { Event, DateGroup, EventsPreview, DateGroupInfo}
