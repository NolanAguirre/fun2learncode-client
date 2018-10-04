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
                <td>Open Event Registation On:</td>
                <td><DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.open} onChange={(time) => {
            props.handleTimeChange(time, "open")
        }}/></td>
                <td>Close Event Registation On:</td>
                <td><DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.close} onChange={(time) => {
            props.handleTimeChange(time, "close")
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
                <td>Open Event Registation On:</td>
                <td>{moment(props.open).format("MMMM Do YYYY")}</td>
                <td>Close Event Registation On:</td>
                <td>{moment(props.close).format("MMMM Do YYYY")}</td>
            </tr>
            <tr>
                <td>Open Group Registation On:</td>
                <td><DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.groupOpen} onChange={(time) => {
            props.handleTimeChange(time, "groupOpen")
        }}/></td>
            <td>Close Group Registation On:</td>
                <td><DateTime dateFormat="MMMM Do YYYY" timeFormat={false} value={props.groupClose}  onChange={(time) => {
            props.handleTimeChange(time, "groupClose")
        }}/></td>
            </tr>
            <tr>
                <td>Event Start Time:</td>
                <td><DateTime dateFormat={false} value={props.start} onChange={(time) => {
            props.handleTimeChange(time, "start")
        }}/></td>
                <td>Event End Time:</td>
                <td><DateTime value={props.end} dateFormat={false} onChange={(time) => {
            props.handleTimeChange(time, "end")
        }}/></td>
            </tr>
            <tr>
                <td>
                    <button onClick={() => {
                            props.createDateGroup(props)
                        }}>Create new group</button>
                </td>
                <td>
                    <button onClick={() => {
                            props.createDateGroup(props)
                        }}>Edit Event</button>
                </td>
                <td>
                    <button onClick={
                            props.displayEventOptions
                        }>Plan Another Event</button>
                </td>
                <td>
                    <button>Help</button>
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
            eventType:undefined,
            address:undefined,
            groupOpen: new Date(),
            groupClose: new Date(),
            open: new Date(),
            close: new Date(+ new Date() + 86400000),
            start: new Date().setHours(12,0,0),
            end: new Date().setHours(13,0,0),
            creatingEvent: true
        }
        this.createEvent = this.createEvent.bind(this);
    }
    handleChange = (event, refresh) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    handleTimeChange = (movement, name)=> {
        this.setState({[name]: movement})
    }
    createEvent() {
        if (this.state.address && this.state.eventType) {
            this.props.createEvent(this.state);
            this.setState({creatingEvent: false})
        }
    }
    displayEventOptions = () => {
        this.setState({creatingEvent: true})
        this.props.reset();
    }
    createDateGroup = (props) => {
        this.props.createDateGroup(this.state.start, this.state.end, this.state.groupOpen, this.state.groupClose);
    }
    render() {
        return (<div>
            {
                (this.state.creatingEvent)
                    ? <CreateEvent
                    eventTypes={this.props.eventTypes}
                    addresses={this.props.addresses}
                    address={this.state.address}
                    eventType={this.state.eventType}
                    price={this.state.price}
                    capacity={this.state.capacity}
                    open={this.state.open}
                    close={this.state.close}
                    handleChange={this.handleChange}
                    handleTimeChange={this.handleTimeChange}
                    createEvent={this.createEvent}/>
                    : <CreateDates
                    price={this.state.price}
                    groupOpen={this.state.groupOpen}
                    groupClose={this.state.groupClose}
                    eventType={this.props.eventTypes.filter((element)=>{return element.value == this.state.eventType})[0].name}
                    address={this.props.addresses.filter((element)=>{return element.value == this.state.address})[0].name}
                    capacity={this.state.capacity}
                    open={this.state.open}
                    close={this.state.close}
                    start={this.state.start}
                    end={this.state.end}
                    handleChange={this.handleChange}
                    handleTimeChange={this.handleTimeChange}
                    displayEventOptions={this.displayEventOptions}
                    createDateGroup={this.createDateGroup}/>
            }
        </div>)
    }
}

class DateGroups {
    constructor() {
        this.idCount = 0;
        this.data = {};
    }
    setEventTypes = (eventNames)=>{
        this.eventNames = eventNames;
    }
    setAddresses = (addresses)=>{
        this.addresses = addresses;
    }
    genId = () => {
        return "_" +this.idCount++;
    }
    newEvent = (p, c, a, o, cl, t) => {
        this.currentEvent = this.genId();
        this.data[this.currentEvent] = {
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
    newDateGroup = () => {
        let groupId = this.genId();
        this.data[this.currentEvent].dateGroups.push(groupId);
        return groupId;
    }
    removeDateGroup = (id) => {
        this.data[this.currentEvent].dateGroups = this.data[this.currentEvent].dateGroups.filter((el) => {
            return el != id
        })
    }
    getName = (id) => {
        return this.data[id].name;
    }
    selectEvent(id) {
        this.currentEvent = id;
        return this.data[id];
    }
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
            currentEvent: null,
            currentDateGroup: null
        }
        this.dateGroups = new DateGroups();
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
    reset = () =>{
        this.setState({currentEvent:null, currentDateGroup:null});
    }
    createEvent = ({price, capacity, address, open, close, eventType}) => {
        let eventId = this.dateGroups.newEvent(price, capacity, address, open, close, eventType);
        this.setState({
            events: [
                ...this.state.events,
                eventId
            ],
            currentEvent: eventId
        });
    }
    createDateGroup = (start, end, open, close) => {
        this.setState({
            currentDateGroup: this.dateGroups.newDateGroup()
        });
        this.start = start;
        this.end = end;
        this.groupOpen = open;
        this.groupClose = close;
    }
    newCalendarEvent = (event) => { //slot select
        if(!this.state.currentDateGroup){
            alert("Create a date group to begin");
        }else if(!this.state.currentEvent){
            alert("Create an event to begin");
        }
            if (event.action === 'doubleClick') {
                let hour = {
                    id: '_' + Math.random().toString(36).substr(2, 9),
                    title: this.dateGroups.getName(this.state.currentEvent) +" " + this.state.currentEvent,
                    start: event.start,
                    end:  new Date(+event.start + 86400000),
                    buttonStyle: {
                        backgroundColor: Colors.get(this.state.currentDateGroup).regular
                    },
                    resources: {
                        eventId: this.state.currentEvent,
                        start: this.start,
                        end: this.end,
                        open: this.groupOpen,
                        close: this.groupClose,
                        groupId: this.state.currentDateGroup
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
          if(event.action==='select'){
              let selectedId = this.state.selected.id;
              if(selectedId != null){
                const newEvents = this.state.calendarEvents.filter((element)=>{return element.id != selectedId});
                let newEvent = Object.assign({}, this.state.selected);
                newEvent.start = event.start;
                newEvent.end = new Date(+event.start + 86400000 * event.slots.length);
                this.setState({
                    calendarEvents: [...newEvents, newEvent],
                });
            }
        }
          this.resetSelectedEvent();
    }
    removeCalendarEvent = (event) => {
        const newCalendarEvents = this.state.calendarEvents.filter((element) => { //filter displayed events
            return element.id != event.id;
        });
        let removeGroup = newCalendarEvents.filter((element) => { //check if the event was the last in the group
            return element.resources.groupId == event.resources.groupId
        }).length == 0;
        this.setState({calendarEvents: newCalendarEvents})
        if (removeGroup) { //if the event was the last in the group, remove the group from dateGroups
            this.dateGroups.removeDateGroup(event.resources.groupId)
        }
    }
    selectEvent = (event) => {
        if (this.state.selected.id === event.id) {
            this.resetSelectedEvent();
        } else {
            event.buttonStyle = {
                backgroundColor: Colors.get(event.resources.groupId).hover
            }
            this.setState({selected: event})
        }
    }
    resetSelectedEvent = () => {
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
    submitEvents = () =>{
        function spreadDates (eventStart, eventEnd, dayStart, dayEnd){
            let dates = []
            let startTime = new Date(dayStart);
            let endTime = new Date(dayEnd);
            let start = new Date(eventStart);
            let date1;
            let date2;
            while(start < eventEnd){
                date1 = new Date(start);
                date2 = new Date(start);
                date1.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                date2.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                dates.push({
                    start:date1,
                    end:date2
                })
                start = moment(start).add(1, 'days');
            }
            return dates;
        }
        let events = Object.keys(this.dateGroups.data).map((key)=>{
            let dateGroup = this.dateGroups.data[key].dateGroups.map((groupId)=>{
                let open;
                let close;
                let calendarEvent = this.state.calendarEvents.filter((event)=>{
                    return event.resources.groupId == groupId;
                }).map((event)=>{
                    open=event.resources.open;
                    close=event.resources.close;
                    return spreadDates(event.start, event.end, event.resources.start, event.resources.end)
                })
                return {
                    open: open,
                    close: close,
                    dates: calendarEvent.reduce((acc, val) => acc.concat(val), [])
                }
            }).filter((group)=>{
                return group.open && group.close && group.dates.length != 0;
            })
            return {
                dateGroups: dateGroup,
                open: this.dateGroups.data[key].open,
                close: this.dateGroups.data[key].close,
                type: this.dateGroups.data[key].type,
                address: this.dateGroups.data[key].address,
                capacity: this.dateGroups.data[key].capacity
            };
        })
        console.log(events);
    }
    tooltipAccessor = (event) => {
        let group = this.dateGroups.data[event.resources.eventId];
        return `From: ${moment(event.resources.start).format("h:mm a")}
To: ${moment(event.resources.end).format("h:mm a")}
Price: ${group.price}
Location: ${group.addressName}
Capacity: ${group.capacity}
Registartion
    Event
        Open: ${moment(group.open).format("MMMM Do YYYY")} Close: ${moment(group.close).format("MMMM Do YYYY")}
    Group:
        Open: ${moment(event.resources.open).format("MMMM Do YYYY")} Close: ${moment(event.resources.close).format("MMMM Do YYYY")}
Event Id:${event.resources.eventId}
`;
    }
    render() {
        const catagories = this.mapCatagories(this.props.queryResult.allActivityCatagories);
        const addresses = this.mapAddresses(this.props.queryResult.allAddresses);
        const eventTypes = this.mapEventTypes(this.props.queryResult.allActivities);
        return (<div className="manage-events-container">
            <div className="manage-events-info">
                <button onClick={this.submitEvents}>Create Events</button>
                <EventOptions reset={this.reset} addresses={addresses} eventTypes={eventTypes} createEvent={this.createEvent} createDateGroup={this.createDateGroup}/>
            </div>
            {
                (this.state.events.length > 0)
                    ? <DragAndDropCalendar
                    tooltipAccessor={this.tooltipAccessor}
                    selected={this.state.selected}
                    removeEvent={this.removeCalendarEvent}
                    selectEvent={this.selectEvent}
                    newEvent={this.newCalendarEvent}
                    events={this.state.calendarEvents}
                    className="manage-events-calander"/>
                    : <div></div>
            }
        </div>);
    }
}

function ManageEvents(props) {
    return <QueryHandler query={GET_ACTIVITIES} child={(data) => {
            return <ManageEventsClass queryResult={data} {...props}/>
        }}/>
}
export default ManageEvents;
