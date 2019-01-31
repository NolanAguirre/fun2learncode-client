import React, { Component } from 'react'
import { DropDown, CustomProvider, ArchiveOptions } from '../common/Common'
import './EventsPreview.css'
import { ReactQuery } from '../../../delv/delv-react'
import DateTime from 'react-datetime'
import '../../../react-datetime.css'
import memoize from 'memoize-one'
import Popup from "reactjs-popup"
import Colors from '../calendar/Colors'
import DateGroupForm from './DateGroupForm';
import moment from 'moment'
import EventForm from './EventForm'

const GET_DATE_GROUP_INFO_BY_ID = (id) => {
    return `{
  allDateGroups(condition: {id: "${id}"}) {
    nodes {
        archive
      nodeId
      id
      name
      openRegistration
      closeRegistration
      seatsLeft
      capacity
      price
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

const GET_EVENTS = (eventArchive) =>  {
    return (dateGroupArchive) => `{
  allEvents(condition: {${eventArchive}}){
    nodes {
      nodeId
      id
      archive
      openRegistration
      closeRegistration
      activityByEventType {
        nodeId
        id
        name
      }
      dateGroupsByEvent(condition: {${dateGroupArchive}}) {
        nodes {
          archive
          event
          address
          seatsLeft
          addOnJoinsByDateGroup {
            nodes {
              nodeId
              id
              addOnByAddOn {
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
}

class DateGroup extends Component {
    constructor(props){
        super(props);
        this.state = {hide:true}
    }

    toggleCalendarHide = (event) => {
        const id = this.props.dateGroup.id
        let checked = event.target.checked
        if(!checked){
            this.props.emitHiddenDateGroupsProvider([...this.props.hiddenDateGroupsProvider, id])
        }else{
            this.props.emitHiddenDateGroupsProvider(this.props.hiddenDateGroupsProvider.filter(ID=>ID!==id))
        }
    }

    toggleDates = () => {
        this.setState({hide: !this.state.hide})
    }
    render = () => {
        const isCalendarHidden = !this.props.hiddenDateGroupsProvider.includes(this.props.dateGroup.id)
        const dates = this.props.dateGroup.datesJoinsByDateGroup.nodes.slice().sort((a,b)=>{return moment(a.dateIntervalByDateInterval.start).unix() - moment(b.dateIntervalByDateInterval.start).unix()}).map((element) => {
            return <div key={element.id}>{moment(moment.utc(element.dateIntervalByDateInterval.start)).local().format("MMM Do h:mma") + "-" +moment(moment.utc(element.dateIntervalByDateInterval.end)).local().format("h:mma")}</div>
        })
        const backgroundColor = (this.props.dateGroup.id == this.props.dateGroupProvider.id)? Colors.get(this.props.dateGroup.id).hover : Colors.get(this.props.dateGroup.id).regular
        return <div onClick={() => {this.props.emitDateGroupProvider(this.props.dateGroup)}} style={{ backgroundColor }} className='event-preview-date-container'>
                <div className='event-preview-header'>
                    <h4>{this.props.dateGroup.name}</h4>
                    <DateGroupForm {...this.props.dateGroup}>
                        <a>edit</a>
                    </DateGroupForm>
                </div>

                <div>
                    {(this.state.hide)?'':dates}
                </div>
                <span> Show on Calander <input onChange={this.toggleCalendarHide} type='checkbox' checked={isCalendarHidden} /> </span>
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
        const dateGroups = event.dateGroupsByEvent.nodes.map((element) => {
            return <CustomProvider key={element.id} propName='dateGroup'>
                <CustomProvider propName='hiddenDateGroups' defaultVal={[]}>
                    {React.cloneElement(this.props.children[0], { dateGroup: element})}
                </CustomProvider>
            </CustomProvider>})
        return (
            <React.Fragment>
                <Popup
                className='payment-overview-popup'
                open={this.state.showPopup}
                closeOnDocumentClick
                onClose={this.clearPopupState}>
                    <EventForm id={event.id}
                        openRegistration={event.openRegistration}
                        closeRegistration={event.closeRegistration}
                        eventType={event.activityByEventType.id}
                        archive={event.archive}
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
                <td>Group registration</td>
                <td>{localizeUTCTimestamp(dateGroup.openRegistration)}</td>
                <td>to {localizeUTCTimestamp(dateGroup.closeRegistration)}</td>
            </tr>
            <tr>
                <td>Seats left</td>
                <td>{dateGroup.seatsLeft} of {dateGroup.capacity}</td>
                <td>Price: {dateGroup.price} $</td>
            </tr>
        </tbody>
    </table>
}

function DateGroupInfo(props){
    if(!props.dateGroupProvider.id){
        return <div></div>
    }
    return<div>
            <ReactQuery query={GET_DATE_GROUP_INFO_BY_ID(props.dateGroupProvider.id)}>
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
    return <div className='event-preview-container'>
            <ArchiveOptions label='Event' query={GET_EVENTS}>
                <ArchiveOptions label='Group'>
                    <ReactQuery>
                        <EventsPreviewInner>{props.children}</EventsPreviewInner>
                    </ReactQuery>
                </ArchiveOptions>
            </ArchiveOptions>
        </div>
}

export {Event, DateGroup, EventsPreview, DateGroupInfo}
