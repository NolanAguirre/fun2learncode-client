import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import {Calendar, DragAndDropCalendar} from '../calendar/Calendar';
import QueryHandler from '../queryHandler/QueryHandler';
import memoize from "memoize-one";
import Colors from '../calendar/Colors'
import moment from 'moment';
const GET_ACTIVITIES = gql `
{
  allActivityCatagories{
    edges{
      node{
        id
        name
      }
    }
  }
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
function CreateEvent(props) {
    return (<table>
        <tbody>
            <tr>
                <td>Type:</td>
                <td>
                    <DropDown name="eventType" options={props.eventTypes} value={props.eventType} onChange={props.handleChange}></DropDown>
                </td>
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
                <td>Capacity:</td>
                <td>
                    <input name="capacity" value={props.capacity} onChange={props.handleChange} type="number"></input>
                </td>
            </tr>
            <tr>
                <td>Open Registation On:</td>
                <td><DateTime dateFormat="YYYY-MM-DD" value={props.open} onChange={(time) => {
            props.onTimeChange(time, "open")
        }}/></td>
                <td>Close Registation On:</td>
                <td><DateTime dateFormat="YYYY-MM-DD" value={props.close} onChange={(time) => {
            this.onTimeChange(time, "close")
        }}/></td>
            </tr>
            <tr>
                <td>
                    <button onClick={() => {
                            props.createEvent()
                        }}>Plan Event Dates</button>
                </td>
            </tr>
        </tbody>
    </table>)
}
function CreateDates(props) {
    return (<table>
        <tbody>
            <tr>
                <td>Type:</td>
                <td>{props.eventType}</td>
                <td>Location:</td>
                <td>{props.address}</td>
            </tr>
            <tr>
                <td>Price:</td>
                <td>{props.price}</td>
                <td>Capacity:</td>
                <td>{props.capacity}</td>
            </tr>
            <tr>
                <td>Open Registation On:</td>
                <td>{moment(props.open).format("MMMM Do")}</td>
                <td>Close Registation On:</td>
                <td>{moment(props.close).format("MMMM Do")}</td>
            </tr>
            <tr>
                <td>Event Start Time:</td>
                <td><DateTime dateFormat={false} value={props.start} onChange={(time) => {
            props.onTimeChange(time, "open")
        }}/></td>
                <td>Event End Time:</td>
                <td><DateTime value={props.end} dateFormat={false} onChange={(time) => {
            props.onTimeChange(time, "close")
        }}/></td>
            </tr>
            <tr>
                <td>
                    <button onClick={() => {
                            props.createDateGroup(props)
                        }}>Begin new group</button>
                </td>
                <td>
                    <button onClick={() => {
                            props.createDateGroup(props)
                        }}>Finish</button>
                </td>
                <td>
                    <button onClick={() => {
                            props.createDateGroup(props)
                        }}>Plan Another Event</button>
                </td>
            </tr>
        </tbody>
    </table>)
}
class EventOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 100,
            capacity: 8,
            open: new Date(),
            close: new Date(+ new Date() + 86400000),
            start: new Date(),
            end: new Date(+ new Date() + 86400000),
            creatingEvent: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.createEvent = this.createEvent.bind(this);
    }
    handleChange(event, refresh) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    handleTimeChange(movement, name) {
        this.setState({[name]: movement})
    }
    createEvent() {
        if (this.state.address && this.state.eventType) {
            this.props.createEvent(this.state);
            this.setState({creatingEvent: false})
        }
    }
    createDateGroup() {}
    render() {
        return (<div>
            {
                (this.state.creatingEvent)
                    ? <CreateEvent eventTypes={this.props.eventTypes} addresses={this.props.addresses} price={this.state.price} capacity={this.state.capacity} open={this.state.open} close={this.state.close} handleChange={this.handleChange} handleTimeChange={this.handleTimeChange} createEvent={this.createEvent}/>
                    : <CreateDates price={this.state.price} eventType={this.state.eventType} address={this.state.address} capacity={this.state.capacity} open={this.state.open} close={this.state.close} start={this.state.start} end={this.state.end} handleChange={this.handleChange} handleTimeChange={this.handleTimeChange} createDateGroup={this.createDateGroup}/>
            }
        </div>)
    }
}

class DateGroups {
    constructor() {
        //this.newEvent = this.newEvent.bind(this);
        this.newDateGroup = this.newDateGroup.bind(this);
        this.removeDateGroup = this.removeDateGroup.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.getName = this.getName.bind(this);
    }
    setEventTypes = (eventNames)=>{
        this.eventNames = eventNames;
    }
    setAddresses = (addresses)=>{
        this.addresses = addresses;
    }
    genId() {
        return '_' + Math.random().toString(36).substr(2, 12);
    }
    newEvent = (p, c, a, o, cl, t) => {
        this.currentEvent = '_' + Math.random().toString(36).substr(2, 12);;
        this[this.currentEvent] = {
            price: p,
            capacity: c,
            address: a,
            open: o,
            close: cl,
            type: t,
            name: this.eventNames.filter((element) => {
                return element.value === t;
            })[0].name,
            addressName: this.addresses.filter((element) => {
                return element.value === a;
            })[0].name,
            dateGroups: []
        }
        return this.currentEvent;
    }
    newDateGroup() {
        let groupId = this.genId();
        this[this.currentEvent].dateGroups.push(groupId);
        return groupId;
    }
    removeDateGroup(id) {
        for (let key in this) {
            this[key].dateGroups = this[key].dateGroups.filter((el) => {
                return el != id
            })
            if (this[key].dateGroups.length == 0) {
                delete this[key];
            }
        }
    }
    getName(id) {
        console.log(id)
        console.log(Object.keys(this));
        return this[id].name;
    }
    selectEvent(id) {
        this.currentEvent = id;
        return this[id];
    }
}
function ManageEvents(props) {
    return <QueryHandler query={GET_ACTIVITIES} child={(data) => {
            return <ManageEventsClass queryResult={data} {...props}/>
        }}/>
}
class ManageEventsClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {
                id: null
            },
            events: [],
            calendarEvents: [],
            currentEvent: '_' + Math.random().toString(36).substr(2, 9)
        }
        this.dateGroups = new DateGroups();
        this.newEvent = this.newEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.genNewGroup = this.genNewGroup.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.tooltipAccessor = this.tooltipAccessor.bind(this);
    }
    mapCatagories = memoize(
        (data) => data.edges.map((element) => {return {name: element.node.name, value: element.node.id}})
    );
    mapAddresses = memoize(
        (data) => {
            let filtered = data.edges.map((element) => {return {name: element.node.alias, value: element.node.id}})
            this.dateGroups.setAddresses(filtered);
            return filtered;
        }
    );
    mapEventTypes = memoize(
        (data) =>{
            let filtered = data.edges.map((element) => {return {name: element.node.name + " (" + element.node.activityCatagoryByType.name + ")",value: element.node.id}})
            this.dateGroups.setEventTypes(filtered);
            return filtered;
        }
    );
    genNewGroup() {
        this.setState({
            groupId: '_' + Math.random().toString(36).substr(2, 9)
        })
    }
    createEvent({
        price,
        capacity,
        address,
        open,
        close,
        eventType
    }) {
        let eventId = this.dateGroups.newEvent(price, capacity, address, open, close, eventType);
        this.setState({
            events: [
                ...this.state.events,
                eventId
            ],
            currentEvent: eventId
        })
    }
    newEvent(event) { //slot select
        if (true) {
            if (event.action === 'doubleClick') {
                let groupId = this.genNewGroup();
                let hour = {
                    id: '_' + Math.random().toString(36).substr(2, 9),
                    title: this.dateGroups.getName(this.state.currentEvent),
                    start: event.start,
                    end: event.end,
                    buttonStyle: {
                        backgroundColor: Colors.get(this.state.currentEvent).regular
                    },
                    resources: {
                        eventId: this.state.currentEvent,
                        start: this.state.start,
                        end: this.state.end,
                        groupId: groupId,
                        isGroup: this.state.isGroup
                    }
                }
                this.setState({
                    calendarEvents: [
                        ...this.state.calendarEvents,
                        hour
                    ]
                })
                return;
            }
        }
        //   if(event.action==='select'){
        //       let selectedId = this.state.selected.id;
        //       if(selectedId != null){
        //         const newEvents = this.state.events.filter((element)=>{return element.id != selectedId});
        //         let newEvent = Object.assign({},this.state.selected);
        //         newEvent.start = event.start;
        //         newEvent.end = new Date(+event.start + 86400000 * event.slots.length);
        //         this.setState({
        //             events: [...newEvents, newEvent],
        //         });
        //     }
        // }
        //   this.resetSelectedEvent();
    }
    removeEvent(event) {
        const newEvents = this.state.events.filter((element) => {
            return element.id != event.id
        });
        let removeGroup = newEvents.filter((element) => {
            return element.resources.groupId == event.resources.groupId
        }).length == 0;
        this.setState({events: newEvents})
        if (removeGroup) {
            delete this.dateGroups[event.resources.groupId]
        }
    }
    selectEvent(event) {
        if (this.state.selected.id === event.id) {
            this.resetSelectedEvent();
        } else {
            event.buttonStyle = {
                backgroundColor: Colors.get(event.resources.groupId).hover
            }
            this.setState({selected: event, isGroup: event.resources.isGroup, groupId: event.resources.groupId})
        }
    }
    resetSelectedEvent() {
        this.setState({
            selected: {
                id: null
            },
            calendarEvents: this.state.calendarEvents.map((element) => {
                element.buttonStyle = {
                    backgroundColor: Colors.get(element.resources.groupId).regular
                }
                return element;
            })
        });
    }
    tooltipAccessor(event) {
        let group = this.dateGroups[event.resources.eventId];
        return `From: ${moment(event.resources.start).format("h:mm a")}
To: ${moment(event.resources.end).format("h:mm a")}
Price: ${group.price}
Location: ${group.addressName}
Capacity: ${group.capacity}
Registartion
    Open: ${moment(group.open).format("MMMM Do")} Close: ${moment(group.close).format("MMMM Do")}
`;
    }
    render() {
        const catagories = this.mapCatagories(this.props.queryResult.allActivityCatagories);
        const addresses = this.mapAddresses(this.props.queryResult.allAddresses);
        const eventTypes = this.mapEventTypes(this.props.queryResult.allActivities);
        return (<div className="manage-events-container">
            <div className="manage-events-info">
                <EventOptions addresses={addresses} eventTypes={eventTypes} createEvent={this.createEvent}/>
            </div>
            {
                (this.state.events.length > 0)
                    ? <DragAndDropCalendar
                    tooltipAccessor={this.tooltipAccessor}
                    selected={this.state.selected}
                    removeEvent={this.removeEvent}
                    selectEvent={this.selectEvent}
                    newEvent={this.newEvent}
                    events={this.state.calendarEvents}
                    className="manage-events-calander"/>
                    : <div></div>
            }
        </div>);
    }
}
export default ManageEvents;
