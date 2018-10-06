import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css';
import {Calendar, DragAndDropCalendar} from '../calendar/Calendar';
import QueryHandler from '../queryHandler/QueryHandler';
import memoize from "memoize-one";
import Colors from '../calendar/Colors';
import moment from 'moment';
import EventForm from './EventForm';
import DateGroupForm from './DateGroupForm';
import DateForm from './DateForm';
import {Event, DateGroup, EventsPreview} from './EventsPreview';
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
        this.events = [];
    }
    reset = () =>{
        this.setState({currentEvent:null, currentDateGroup:null});
    }
    createEvent = (event) => {
        event.dateGroups = [];
        this.events.push(event);
        this.setState({
            foo:0
        })
    }
    createDateGroup = (dateGroup) => {
        this.events = this.events.map((element) => {
            if (element.id === dateGroup.event) {
                element.dateGroups.push(dateGroup);
            }
            return element;
        });
        this.setState({
            foo:0
        })
        console.log(this.events);
    }
    createDate = (date, groupId) => {
        this.events = this.events.map((element) => {
            element.dateGroups = element.dateGroups.map((dateGroup)=>{
                if(dateGroup.id === groupId){
                    dateGroup.dates.push(date);
                }
                return dateGroup;
            });
            return element;
        });
        this.setState({
            foo:0
        })
    }
    newCalendarEvent = (event) => { //slot select
        if(!this.state.currentDateGroup && !this.state.selected.id){
            alert("Create a date group to begin");
        }else if(!this.state.currentEvent && !this.state.selected.id){
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
        this.resetSelectedEvent();
        event.buttonStyle = {
            backgroundColor: Colors.get(event.resources.groupId).hover
        }
        this.setState({selected: event})
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
        });
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
        const dateForm = groupId => <DateForm groupId={groupId} createDate={this.createDate} />
        const dateGroupForm = eventId => <DateGroupForm dateForm={dateForm} eventId={eventId} createDateGroup={this.createDateGroup} events={this.events}/>
        const dateGroup = (dates, key) => <DateGroup dateForm={this.createDate} key={key} dates={dates} />
        const event = (event, key) => <Event key={key} child={dateGroup} dateGroupForm={dateGroupForm} event={event} />
        return (
            <div className="manage-events-container">
                <EventsPreview child={event} events={this.events}/>
                <div className="manage-events-main">
                    <div className="manage-events-event-form">
                        <EventForm createEvent={this.createEvent}/>
                    </div>
                        <DragAndDropCalendar
                        tooltipAccessor={this.tooltipAccessor}
                        selected={this.state.selected}
                        removeEvent={this.removeCalendarEvent}
                        selectEvent={this.selectEvent}
                        newEvent={this.newCalendarEvent}
                        events={this.state.calendarEvents}
                        className="manage-events-calander"/>
                </div>
        </div>
    );
    }
}

function ManageEvents(props) {
    return <QueryHandler query={GET_ACTIVITIES} child={(data) => {
            return <ManageEventsClass queryResult={data} {...props}/>
        }}/>
}
export default ManageEvents;
