import React, { Component } from 'react'
import { DropDown } from '../common/Common'
import './EventsPreview.css'
import gql from 'graphql-tag';
import QueryHandler from '../queryHandler/QueryHandler'
import DateTime from 'react-datetime'
import '../../../react-datetime.css'
import memoize from 'memoize-one'
import Popup from "reactjs-popup"
import Colors from '../calendar/Colors'
import DateGroupForm from './DateGroupForm';
import moment from 'moment'
import DateStore from '../../DateStore'
import EventForm from './EventForm';

const GET_DATE_GROUP_INFO_BY_ID = (id) => {
    return gql`{
  dateGroupById(id: "${id}") {
    nodeId
    id
    name
    openRegistration
    closeRegistration
    datesJoinsByDateGroup {
      nodes {
        nodeId
        id
        dateInterval
        dateIntervalByDateInterval {
          id
          nodeId
          start
          end
        }
      }
    }
    addressByAddress {
        alias
        nodeId
        id
    }
    eventByEvent {
      openRegistration
      closeRegistration
      nodeId
      id
      activityByEventType {
        name
        id
        nodeId
      }
    }
  }
}`}

const GET_EVENTS = gql`query adminEvents {
  allEvents {
    nodes {
      nodeId
      id
      eventType
      openRegistration
      closeRegistration
      activityByEventType {
        nodeId
        id
        name
      }
      dateGroupsByEvent {
        nodes {
          event
          address
          addressByAddress {
            nodeId
            alias
            id
          }
          price
          capacity
          nodeId
          id
          name
          openRegistration
          closeRegistration
          datesJoinsByDateGroup {
            nodes {
              nodeId
              id
              dateInterval
              dateIntervalByDateInterval {
                id
                nodeId
                start
                end
              }
            }
          }
        }
      }
    }
  }
}`

function DateGroup (props) {
    function toggleHide(){
        if(DateStore.get('hidden') == undefined){
            DateStore.set('hidden', [])
        }
        if(DateStore.get('hidden').includes(props.dateGroup.id)){
            const newHide = DateStore.get('hidden').filter((id)=>id!=props.dateGroup.id);
            DateStore.set('hidden',newHide)
        }else{
            DateStore.set('hidden',[...DateStore.get('hidden'), props.dateGroup.id])
        }
    }
  const dates = props.dateGroup.datesJoinsByDateGroup.nodes.slice().sort((a,b)=>{return moment(a.dateIntervalByDateInterval.start).unix() - moment(b.dateIntervalByDateInterval.start).unix()}).map((element) => {
    return <div key={element.id}>{moment(moment.utc(element.dateIntervalByDateInterval.start)).local().format("MMM Do h:mma") + "-" +moment(moment.utc(element.dateIntervalByDateInterval.end)).local().format("h:mma")}</div>
  })
  const backgroundColor = (props.dateGroup.id == props.activeDateGroup.id)? Colors.get(props.dateGroup.id).hover : Colors.get(props.dateGroup.id).regular
  return (
    <div onClick={() => {props.setActiveDateGroup(props.dateGroup)}} style={{ backgroundColor }} className='event-preview-date-container'>
        <div className='event-preview-header'>
            <h4>{props.dateGroup.name}</h4>
            <DateGroupForm {...props.dateGroup}>
                <a>edit</a>
            </DateGroupForm>
        </div>
        <h4> Show on Calander <input onChange={toggleHide} type='checkbox' defaultChecked='true' /> </h4>
      <div>
        {dates}
      </div>
    </div>
  )
}

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
        const event = this.props.event;
        const dateGroups = event.dateGroupsByEvent.nodes.map((element) => { return React.cloneElement(this.props.children[0], { key: element.id, dateGroup: element }) })
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
                        eventType={event.activityByEventType.id}/>
                </Popup>
                <div className='event-preview-event-container'>
                    <div className='event-preview-header'><h3>{event.activityByEventType.name}</h3><a onClick={this.showPopup}>edit</a></div>
                    <div>
                        {dateGroups}
                        {React.cloneElement(this.props.children[1], { event: this.props.event.id })}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function DateGroupInfoInner(props) {
    const dateGroup = props.queryResult.dateGroupById;
    if(!dateGroup){
        return <div></div>
    }
    const event = dateGroup.eventByEvent;

    function localizeUTCTimestamp (timestamp){
        if(!timestamp){return null}
        return moment(moment.utc(timestamp)).local().format("MMM Do YYYY")
    }

    return <table>
        <tbody>
            <tr>
                <td>Name</td>
                <td>{event.activityByEventType.name}</td>
                <td>@ {dateGroup.addressByAddress.alias}</td>
            </tr>
            <tr>
                <td>Event registration</td>
                <td>{localizeUTCTimestamp(event.openRegistration)}</td>
                <td>to {localizeUTCTimestamp(event.closeRegistration)}</td>
            </tr>
            <tr>
                <td>Date group registration</td>
                <td>{localizeUTCTimestamp(dateGroup.openRegistration)}</td>
                <td>to {localizeUTCTimestamp(dateGroup.closeRegistration)}</td>
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
            <QueryHandler query={GET_EVENTS}>
              <EventsPreviewInner>{props.children}</EventsPreviewInner>
            </QueryHandler>
        </div>
    </div>
}

export {Event, DateGroup, EventsPreview, DateGroupInfo}
