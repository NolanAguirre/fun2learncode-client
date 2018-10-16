import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css';
import {Calendar, DragAndDropMutation} from '../calendar/Calendar';
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
            events: [],
            activeEvent: null,
            activeDateGroup: null
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
    }
    setDateGroupStart = (groupId, start, end) =>{
        this.events = this.events.map((element) => {
            element.dateGroups = element.dateGroups.map((dateGroup)=>{
                if(dateGroup.id === groupId){
                    dateGroup.start = start
                    dateGroup.end = end;
                }
                return dateGroup;
            });
            return element;
        });
        this.setState({
            foo:0
        })
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
    setActiveDateGroup = (dateGroup, event) =>{
        this.setState({
            activeEvent:event,
            activeDateGroup:dateGroup
        });
    }
    setActiveEvent = (event) => {
        this.setState({
            activeEvent: event
        });
    }

    render() {
        return (
            <div className="manage-events-container">
                <EventsPreview/>
                <div className="manage-events-main">
                    <div className="manage-events-event-form">
                        <EventForm createEvent={this.createEvent}/>
                        {JSON.stringify(this.state.activeDateGroup)}
                    </div>
                        <DragAndDropMutation
                            createDate={this.state.createDate}
                            activeDateGroup={this.state.activeDateGroup}/>
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
