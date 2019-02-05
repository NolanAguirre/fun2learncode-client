import React, { Component } from 'react'
import { DropDown, CustomProvider, ArchiveOptions } from '../common/Common'
import './EventsPreview.css'
import { ReactQuery } from '../../../delv/delv-react'
import DateTime from 'react-datetime'
import '../../../react-datetime.css'
import memoize from 'memoize-one'
import Popup from "reactjs-popup"
import Colors from '../calendar/Colors'
import moment from 'moment'
import EventForm from './EventForm'

const GET_EVENT_INFO_BY_ID = (id) => {
    return `{
  allEvents(condition: {id: "${id}"}) {
    nodes {
      nodeId
      id
      archive
      name
      openRegistration
      closeRegistration
      seatsLeft
      capacity
      price
      addOnJoinsByEvent {
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
      dateJoinsByEvent {
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
      activityByActivity {
        id
        nodeId
        name
      }
    }
  }
}`}

const GET_EVENTS = (eventArchive) => `{
  allEvents (condition: {${eventArchive}}){
    nodes {
      nodeId
      archive
      seatsLeft
      price
      capacity
      nodeId
      id
      name
      openRegistration
      closeRegistration
      addOnJoinsByEvent {
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
      dateJoinsByEvent {
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
      activityByActivity {
        nodeId
        id
        name
      }
    }
  }
}`

class EventPreview extends Component {
    constructor(props){
        super(props);
        this.state = {hide:true}
    }
    toggleCalendarHide = (event) => {
        const id = this.props.event.id
        let checked = event.target.checked
        if(!checked){
            this.props.emitHiddenEventsProvider([...this.props.hiddenEventsProvider, id])
        }else{
            this.props.emitHiddenEventsProvider(this.props.hiddenEventsProvider.filter(ID=>ID!==id))
        }
    }
    toggleDates = () => {
        this.setState({hide: !this.state.hide})
    }
    render = () => {
        const isCalendarHidden = !this.props.hiddenEventsProvider.includes(this.props.event.id)
        const dates = this.props.event.dateJoinsByEvent.nodes.slice().sort((a,b)=>{return moment(a.dateIntervalByDateInterval.start).unix() - moment(b.dateIntervalByDateInterval.start).unix()}).map((element) => {
            return <div key={element.id}>{moment(moment.utc(element.dateIntervalByDateInterval.start)).local().format("MMM Do h:mma") + "-" +moment(moment.utc(element.dateIntervalByDateInterval.end)).local().format("h:mma")}</div>
        })
        const backgroundColor = (this.props.event.id == this.props.activeEventProvider.id)? Colors.get(this.props.event.id).hover : Colors.get(this.props.event.id).regular
        return <div onClick={() => {this.props.emitActiveEventProvider(this.props.event)}} style={{ backgroundColor }} className='event-preview-date-container'>
                <div className='event-preview-header'>
                    <h4>{this.props.event.activityByActivity.name}</h4>
                    <h4>{this.props.event.name}</h4>
                    <a>edit</a>
                </div>
                <span> Show on Calander <input onChange={this.toggleCalendarHide} type='checkbox' checked={isCalendarHidden} /> </span>
                <div className="dropdown-div">
                    <span onClick={this.toggleDates} >{(this.state.hide)?'Show ':'Hide '} Dates</span>
                </div>
                <div>
                    {(this.state.hide)?'':dates}
                </div>
            </div>
    }
}


function EventsPreviewInner (props) {
    console.log(props)
  if (!props.allEvents) {
    return <div>is broken</div>
  }
  const {
      allEvents,
      ...otherProps
  } = props
  return props.allEvents.nodes.map((event)=><CustomProvider propName='hiddenEvents' key={event.nodeId} defaultVal={[]}>
  <CustomProvider propName='activeEvent'>
    <EventPreview event={event} {...otherProps}/>
    </CustomProvider>
  </CustomProvider>)
}

function EventsPreview (props) {
    return <div className='event-preview-container'>
            <ArchiveOptions query={GET_EVENTS}>
                    <ReactQuery>
                        <EventsPreviewInner {...props}/>
                    </ReactQuery>
            </ArchiveOptions>
        </div>
}

export {EventsPreview, EventPreview}
