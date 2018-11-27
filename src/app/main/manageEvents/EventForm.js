import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import {GET_DROPDOWN_OPTIONS, GET_EVENTS} from '../../Queries';
import {EVENT} from '../../Mutations';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import QueryHandler from '../queryHandler/QueryHandler';
import MutationHandler from '../queryHandler/MutationHandler';
import memoize from "memoize-one";
import Colors from '../calendar/Colors'
import moment from 'moment';

function MutableForm(props){
    const form = <table>
                    <tbody>
                        <tr>
                            <td>Type:</td>
                            <td>
                                <DropDown name="eventType" options={props.eventTypes} value={props.eventType} onChange={props.handleChange}></DropDown>
                            </td>
                        </tr>
                        <tr>
                            <td>Location:</td>
                            <td>
                                <DropDown name="address" options={props.addresses} value={props.address} onChange={props.handleChange}></DropDown>
                            </td>
                        </tr>
                        <tr>
                            <td>Price:</td>
                            <td>
                                <input name="price" value={props.price} onChange={props.handleChange} type="number"></input>
                            </td>
                        </tr>
                        <tr>
                            <td>Capacity:</td>
                            <td>
                                <input name="capacity" value={props.capacity} onChange={props.handleChange} type="number"></input>
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

    return(<MutationHandler  update={(cache, { data: { createEvent } }) => {
        if(!createEvent){return} // returns when query was update
        const { allEvents } = cache.readQuery({ query: GET_EVENTS });
        cache.writeQuery({
          query: GET_EVENTS,
          data: { allEvents: {...allEvents, nodes: allEvents.nodes.concat([createEvent.event])} }
        });
    }} handleMutation={props.handleSubmit} mutation={props.mutation} form={form} />);
}

class EventFormClass extends Component {
    constructor(props){
        super(props);
        this.state = {
            price: props.price || 100,
            capacity: props.capacity || 8,
            eventType:props.eventType,
            address:props.address,
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
    );
    mapAddresses = memoize(
        (data) => {
            let mapped = data.nodes.map((element) => {return {name: element.alias, value: element.id}})
            return mapped;
        }
    );
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
    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if (this.state.address && this.state.eventType) {
            let newEvent = {};
            newEvent.price = this.state.price;
            newEvent.capacity = this.state.capacity;
            newEvent.eventType = this.state.eventType;
            newEvent.address = this.state.address;
            newEvent.openRegistration = this.state.open;
            newEvent.closeRegistration = this.state.close;
            mutation({
                variables: {id:this.props.id, event:newEvent}
            });
        }
    }
    render = () => {
        //console.log(this.props.queryResult.allActivityCatagories)
        const eventTypes = this.mapEventTypes(this.props.queryResult.allActivities);
        const addresses = this.mapAddresses(this.props.queryResult.allAddresses);
        return (<MutableForm
                eventTypes={eventTypes}
                addresses={addresses}
                price={this.state.price}
                capacity={this.state.capacity}
                eventType={this.state.eventType}
                address={this.state.address}
                open={this.state.open}
                close={this.state.close}
                handleChange={this.handleChange}
                handleTimeChange={this.handleTimeChange}
                handleSubmit={this.handleSubmit}
                mutation={(this.props.id)?EVENT.UPDATE:EVENT.CREATE}/>) //update event : create event
    }
}

function EventForm(props) {
    return <QueryHandler query={GET_DROPDOWN_OPTIONS} child={(data) => {
            return <EventFormClass queryResult={data} {...props}/>
        }}/>
}
export default EventForm;
