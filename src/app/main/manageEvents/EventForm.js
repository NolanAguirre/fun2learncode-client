import React, {Component} from 'react';
import {DropDown} from '../common/Common';
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
const GET_ACTIVITIES = gql `
{
  allActivities{
    edges{
      node{
        name
        id
        activityCatagoryByType{
          name
        }
      }
    }
  }
  allAddresses{
    edges{
      node{
        id
        street
        city
        state
        alias
      }
    }
  }
}
`;
const CREATE_EVENT = gql`
mutation($event:EventInput!){
  createEvent(input:{event:$event}){
    event{
      id
      eventType
      price
      address
      capacity
      closeRegistration
      openRegistration
    }
  }
}`;
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
                                <DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.open} onChange={(time) =>{props.handleTimeChange(time, "open")}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Close Event On:</td>
                            <td>
                                <DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.close} onChange={(time)=>{props.handleTimeChange(time, "close")}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button type="submit">Plan Event Dates</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
    return(<MutationHandler onMutationCompleted={props.handleMutationData} handleMutation={props.handleSubmit} mutation={CREATE_EVENT} form={form} />);
}

class EventFormClass extends Component {
    constructor(props){
        super(props);
        this.state = {
            price: 100,
            capacity: 8,
            eventType:undefined,
            address:undefined,
            open: new Date(+ new Date() + 86400000),
            close: new Date(+ new Date() + 166400000),
            creatingEvent: true
        }
    }
    mapEventTypes = memoize(
        (data) =>{
            let filtered = data.edges.map((element) => {return {name: element.node.name + " (" + element.node.activityCatagoryByType.name + ")",value: element.node.id}});
            return filtered;
        }
    );
    mapAddresses = memoize(
        (data) => {
            let filtered = data.edges.map((element) => {return {name: element.node.alias, value: element.node.id}})
            return filtered;
        }
    );
    handleChange = (event, refresh) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    handleTimeChange = (date, name)=> {
        this.setState({[name]: date})
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
            newEvent.closeRegistration= this.state.close;
            mutation({
                variables: {event:newEvent}
            });
        }
    }
    handleMutationData = (data) => {
        let event = data.createEvent.event;
        event.name = this.mapEventTypes(this.props.queryResult.allActivities).filter((element)=>element.value === event.eventType)[0].name
        this.props.createEvent(event);
    }
    render = () => {
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
                handleMutationData={this.handleMutationData}/>)
    }
}

function EventForm(props) {
    return <QueryHandler query={GET_ACTIVITIES} child={(data) => {
            return <EventFormClass queryResult={data} {...props}/>
        }}/>
}
export default EventForm;
