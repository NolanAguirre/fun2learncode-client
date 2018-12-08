import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import QueryHandler from '../queryHandler/QueryHandler';
import MutationHandler from '../queryHandler/MutationHandler';
import memoize from "memoize-one";
import moment from 'moment';

const CREATE_EVENT = gql`mutation ($event: EventInput!) {
  createEvent(input: {event: $event}) {
    event {
      nodeId
    }
  }
}`

const UPDATE_EVENT = gql`mutation ($id:UUID!, $event: EventPatch!) {
 updateEventById(input: {id: $id, eventPatch: $event}) {
   event {
    nodeId
   }
 }
}`

const GET_ACTIVITIES = gql`query activitiesDrowdown{
  allActivities {
   nodes {
     id
     nodeId
     name
     activityCatagoryByType{
       name
       id
       nodeId
     }
   }
 }
}`;

function MutableForm(props){
    return <MutationHandler handleMutation={props.handleSubmit} mutation={props.mutation} refetchQueries={['adminEvents']}>

        <table>
            <tbody>
                <tr>
                    <td>Type:</td>
                    <td>
                        <DropDown name="eventType" options={props.eventTypes} value={props.eventType} onChange={props.handleChange}></DropDown>
                    </td>
                </tr>
                <tr>
                    <td>Open Event On:</td>
                    <td>
                        <DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.open} onChange={(time) =>{props.handleTimeChange("open", time)}}/>
                    </td>
                </tr>
                <tr>
                    <td>Close Event On:</td>
                    <td>
                        <DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.close} onChange={(time)=>{props.handleTimeChange("close", time)}}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button type="submit">Set Event Values</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </MutationHandler>
}

class EventFormInner extends Component {
    constructor(props){
        super(props);
        this.state = {
            eventType:props.eventType,
            open: this.localizeUTCTimestamp(props.openRegistration) || new Date(moment().hour(23).minute(59).toString()),
            close: this.localizeUTCTimestamp(props.closeRegistration) || new Date(moment().add(1, "days").hour(23).minute(59).toString()),
            creatingEvent: true
        }
    }

    mapEventTypes = memoize(
        (data) =>{
            let mapped = data.nodes.map((element) => {return {name: element.name + " (" + element.activityCatagoryByType.name + ")",value: element.id}});
            return mapped;
        }
    )

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
               this.normalizeDate(this.state.open) != this.normalizeDate(this.props.openRegistration) ||
               this.normalizeDate(this.state.close) != this.normalizeDate(this.props.closeRegistration)

         return haveValues && changedValues
    }
    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let newEvent = {};
            newEvent.eventType = this.state.eventType;
            newEvent.openRegistration = this.state.open;
            newEvent.closeRegistration = this.state.close;
            mutation({
                variables: {id:this.props.id, event:newEvent}
            });
        }
        if(this.props.handleSubmit){
            this.props.handleSubmit()
        }
    }

    render = () => {
        const eventTypes = this.mapEventTypes(this.props.queryResult.allActivities);
        return (<MutableForm
                eventTypes={eventTypes}
                eventType={this.state.eventType}
                open={this.state.open}
                close={this.state.close}
                handleChange={this.handleChange}
                handleTimeChange={this.handleTimeChange}
                handleSubmit={this.handleSubmit}
                mutation={(this.props.id)?UPDATE_EVENT:CREATE_EVENT}/>) //update event : create event
    }
}

function EventForm(props) {
    return <QueryHandler query={GET_ACTIVITIES}>
        <EventFormInner {...props}/>
    </QueryHandler>
}
export default EventForm;
