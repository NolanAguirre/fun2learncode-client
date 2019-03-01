import React, { Component } from 'react'
import { DropDown, CustomProvider, ArchiveOptions } from '../common/Common'
import './EventsPreview.css'
import { ReactQuery } from '../../../delv/delv-react'
import '../../../react-datetime.css'
import Popup from "reactjs-popup"
import Colors from '../calendar/Colors'
import moment from 'moment'
import EventForm from './EventForm'
import Mutation from '../../../delv/Mutation'

const fomatEvents = (result) => {
    return {
        allEvents:{
            nodes:result.allEvents.nodes.sort((a,b)=>{return a.id > b.id})
        }
    }
}

const GET_EVENTS = (eventArchive) => `{
  allEvents (condition: {${eventArchive}}){
    nodes {
      archive
      seatsLeft
      price
      capacity
      id
      name
      openRegistration
      closeRegistration
      activity
      address
      showCalendar
      publicDisplay
      addOnJoinsByEvent {
        nodes {
          id
          addOnByAddOn {
            name
            id
          }
        }
      }
      addressByAddress {
        alias
        id
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
      activityByActivity {
        id
        name
      }
    }
  }
}`

const TOGGLE_CALENDAR = `mutation ($id: UUID!, $show: Boolean!) {
  updateEventById(input: {id: $id, eventPatch: {showCalendar: $show}}) {
    event {
      id
      showCalendar
    }
  }
}`

class EventPreview extends Component {
    constructor(props){
        super(props);
        this.state = {hide:true}
        this.checked = this.props.event.showCalendar
        this.mutation = new Mutation({
            mutation:TOGGLE_CALENDAR,
            onSubmit: ()=>{return {id:this.props.event.id, show:this.checked}}
        })
    }
    toggleCalendarHide = () => {
        this.checked = !this.checked
        this.mutation.onSubmit();
    }
    toggleDates = () => {
        this.setState({hide: !this.state.hide})
    }

    copyToClipboard = () => {
        navigator.clipboard.writeText(this.props.event.id).then(
        function() {
          console.log("Copying to clipboard was successful!");
        },
        function(err) {
            alert(`Copy Failed id is: ${this.props.event.id}`)
        }
      );
    }
    render = () => {
        const dates = this.props.event.dateJoinsByEvent.nodes.slice().sort((a,b)=>{return moment(a.dateIntervalByDateInterval.start).unix() - moment(b.dateIntervalByDateInterval.start).unix()}).map((element) => {
            return <div key={element.id}>{moment(moment.utc(element.dateIntervalByDateInterval.start)).local().format("MMM Do h:mma") + "-" +moment(moment.utc(element.dateIntervalByDateInterval.end)).local().format("h:mma")}</div>
        })
        const backgroundColor = (this.props.event.id == this.props.activeEventProvider.id)? Colors.get(this.props.event.id).hover : Colors.get(this.props.event.id).regular
        return <div onClick={() => {this.props.emitActiveEventProvider(this.props.event)}} style={{ backgroundColor }} className='event-preview-date-container'>
                <div className='event-preview-header'>
                    <h4>{this.props.event.activityByActivity.name}</h4>
                    <h4>{this.props.event.name}</h4>
                    <EventForm {...this.props.event} buttonText='edit'/>
                    {navigator.clipboard?<div onClick={this.copyToClipboard}>Copy id</div>:this.props.event.id}
                <span> Show on Calendar <input onChange={this.toggleCalendarHide} type='checkbox' checked={this.props.event.showCalendar}/> </span>
                </div>
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
  if (!props.allEvents) {
    return <div>is broken</div>
  }
  const {
      allEvents,
      ...otherProps
  } = props
  return props.allEvents.nodes.map((event)=> <CustomProvider propName='activeEvent' key={event.id}>
        <EventPreview event={event} {...otherProps}/>
    </CustomProvider>)
}

function EventsPreview (props) {
    return <div className='event-preview-container'>
        <ArchiveOptions query={GET_EVENTS}>
                <ReactQuery formatResult={fomatEvents}>
                    <EventsPreviewInner {...props}/>
                </ReactQuery>
            </ArchiveOptions>
        </div>
}

export {EventsPreview, EventPreview}
