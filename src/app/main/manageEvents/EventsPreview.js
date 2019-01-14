import React, { Component } from 'react'
import { DropDown } from '../common/Common'
import './EventsPreview.css'
import { ReactQuery } from '../../../delv/delv-react'
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
    return `{
  allDateGroups(condition: {id: "${id}"}) {
    nodes {
      nodeId
      id
      name
      openRegistration
      closeRegistration
      addOnJoinsByDateGroup{
        nodes{
          nodeId
          id
          addOnByAddOn{
            name
            nodeId
            id
          }
        }
      }
      datesJoinsByDateGroup {
        nodes {
          nodeId
          id
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
  }
}
`}

const GET_EVENTS = `{
  allEvents {
    nodes {
      nodeId
      id
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
          addOnJoinsByDateGroup{
            nodes{
              nodeId
              id
              addOnByAddOn{
                name
                nodeId
                id
              }
            }
          }
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

class DateGroup extends Component {
    constructor(props){
        super(props);
        this.state = {hide:true}
    }

    toggleCalendarHide = () => {
        // date store has a list of hidden date groups, this will remove or add this date group.
        const id = this.props.dateGroup.id
        if(DateStore.get('hidden') == undefined){
            DateStore.set('hidden', [])
        }
        if(DateStore.get('hidden').includes(id)){
            const newHide = DateStore.get('hidden').filter((i)=>i!=id);
            DateStore.set('hidden',newHide)
        }else{
            DateStore.set('hidden',[...DateStore.get('hidden'), id])
        }
    }

    toggleDates = () => {
        this.setState({hide: !this.state.hide})
    }

    render = () => {
        const dates = this.props.dateGroup.datesJoinsByDateGroup.nodes.slice().sort((a,b)=>{return moment(a.dateIntervalByDateInterval.start).unix() - moment(b.dateIntervalByDateInterval.start).unix()}).map((element) => {
            return <div key={element.id}>{moment(moment.utc(element.dateIntervalByDateInterval.start)).local().format("MMM Do h:mma") + "-" +moment(moment.utc(element.dateIntervalByDateInterval.end)).local().format("h:mma")}</div>
        })
        const backgroundColor = (this.props.dateGroup.id == this.props.activeDateGroup.id)? Colors.get(this.props.dateGroup.id).hover : Colors.get(this.props.dateGroup.id).regular
        return <div onClick={() => {this.props.setActiveDateGroup(this.props.dateGroup)}} style={{ backgroundColor }} className='event-preview-date-container'>
                <div className='event-preview-header'>
                    <h4>{this.props.dateGroup.name}</h4>
                    <DateGroupForm {...this.props.dateGroup}>
                        <a>edit</a>
                    </DateGroupForm>
                </div>
                <span> Show on Calander <input onChange={this.toggleCalendarHide} type='checkbox' defaultChecked='true' /> </span>
                <div>
                    {(this.state.hide)?'':dates}
                </div>
                <div className="dropdown-div">
                    <span onClick={this.toggleDates} >{(this.state.hide)?'Show ':'Hide '} Dates</span>
                </div>
            </div>
    }
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
                        openRegistration={event.openRegistration}
                        closeRegistration={event.closeRegistration}
                        eventType={event.activityByEventType.id}
                        handleSubmit={this.clearPopupState}/>
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
    const dateGroup = props.allDateGroups.nodes[0];
    if(!dateGroup){
        return <div></div>
    }
    const event = dateGroup.eventByEvent;

    function localizeUTCTimestamp (timestamp){
        if(!timestamp){return null}
        return moment(moment.utc(timestamp)).local().format("MMM Do YYYY")
    }

    const openConflict = dateGroup.openRegistration < event.openRegistration
    const closeConflict = dateGroup.closeRegistration > event.closeRegistration //TODO alert for conflicts

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
            <ReactQuery query={GET_DATE_GROUP_INFO_BY_ID(props.activeDateGroup.id)}>
                <DateGroupInfoInner />
            </ReactQuery>
        </div>
}

function EventsPreviewInner (props) {
  if (!props.allEvents) {
    return <div>is broken</div>
  }
  return props.allEvents.nodes.map((element) => { return React.cloneElement(props.children, { key: element.id, event: element }) })
}

function EventsPreview (props) {
    return <div className='event-preview-container-container'>
        <div className='event-preview-container'>
            <ReactQuery query={GET_EVENTS}>
              <EventsPreviewInner>{props.children}</EventsPreviewInner>
            </ReactQuery>
        </div>
    </div>
}

export {Event, DateGroup, EventsPreview, DateGroupInfo}
