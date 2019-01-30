import React, {Component} from 'react';
import {EventDropDown} from '../common/Common';
import './ManageEvents.css';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment';

const CREATE_EVENT = `mutation ($event: EventInput!) {
  createEvent(input: {event: $event}) {
    event {
      nodeId
      id
      archive
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
          nodeId
          id
          archive
        }
      }
    }
  }
}`

const UPDATE_EVENT = `mutation ($id: UUID!, $event: EventPatch!) {
  updateEventById(input: {id: $id, eventPatch: $event}) {
    event {
      nodeId
      id
      archive
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
          nodeId
          id
          archive
        }
      }
    }
  }
}`

class EventForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            eventType:props.eventType,
            openRegistration: this.localizeUTCTimestamp(props.openRegistration) || new Date(moment().hour(23).minute(59).toString()),
            closeRegistration: this.localizeUTCTimestamp(props.closeRegistration) || new Date(moment().add(1, "days").hour(23).minute(59).toString()),
            archive: false || this.props.archive
        }
        this.mutation = new Mutation({
            mutation: (this.props.id)?UPDATE_EVENT:CREATE_EVENT,
            onSubmit: this.handleSubmit
        })
    }

    localizeUTCTimestamp = (timestamp) => {
        if(!timestamp){return null}
        return new Date(moment(moment.utc(timestamp)).local().toString())
    }

    handleChange = (event, refresh) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }
    normalizeDate = (date) =>{
        return new Date(this.localizeUTCTimestamp(date)).toISOString()
    }
    hasRequiredValues = () =>{
        let haveValues =  this.state.eventType
        let changedValues = this.state.eventType != this.props.eventType ||
               this.normalizeDate(this.state.openRegistration) != this.normalizeDate(this.props.openRegistration) ||
               this.normalizeDate(this.state.closeRegistration) != this.normalizeDate(this.props.closeRegistration) ||
               this.state.archive != this.props.archive

         return haveValues && changedValues
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.props.handleSubmit){
            this.props.handleSubmit()
        }
        if(this.hasRequiredValues()){
            return {id:this.props.id, event:{...this.state}}
        }
        return false;
    }

    render = () => {
        return <form onSubmit={this.mutation.onSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td>Type:</td>
                        <td>
                            <EventDropDown name='eventType' value={this.state.eventType} onChange={this.handleChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Open Event:</td>
                        <td>
                            <DateTime dateFormat="MMMM Do YYYY" value={this.state.openRegistration} timeFormat={false} onChange={(time) =>{this.handleTimeChange("openRegistration", time)}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Close Event:</td>
                        <td>
                            <DateTime dateFormat="MMMM Do YYYY" value={this.state.closeRegistration} timeFormat={false}  onChange={(time)=>{this.handleTimeChange("closeRegistration", time)}}/>
                        </td>
                    </tr>
                    <tr>
                        <td>Archive: </td>
                        <td>
                            <input  value={this.state.archive} name='archive' type='checkbox'  onChange={this.handleChange}></input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button type="submit">Set Event Values</button>
        </form>
    }
}

export default EventForm;
