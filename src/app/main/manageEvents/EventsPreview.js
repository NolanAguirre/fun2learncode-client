import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './EventsPreview.css';
import {GET_EVENTS} from '../../Queries';
import QueryHandler from '../queryHandler/QueryHandler';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import memoize from "memoize-one";
import Colors from '../calendar/Colors';
import moment from 'moment';
import DateStore from '../../DateStore';

function DateGroup(props){
    if(false){
        return<div>not working</div>
    }
    const dates = props.dateGroup.datesJoinsByDateGroup.edges.map((element)=>{
        return <div key={element.node.id}>{element.node.dateIntervalByDateInterval.start}</div>})
    return(
        <div onClick={()=>{props.setActiveDateGroup(props.dateGroup)}} style={{backgroundColor:Colors.get(props.dateGroup.id).regular}} className="event-preview-date-container">
            <h4>open: {moment(props.dateGroup.openRegistration).format("MMM Do YYYY")}</h4>
            <h4>close: {moment(props.dateGroup.closeRegistration).format("MMM Do YYYY")}</h4>
            <h4> Show on Calander <input onChange={()=>{DateStore.set("toggleDateDisplay", props.dateGroup.id)}} type="checkbox" defaultChecked="true"/> </h4>
            <div>
                {dates}
            </div>
        </div>
    );
}
//{props.dateForm(props.dateGroup.id)}
function Event(props){
    if(false){
        return<div>not working</div>
    }
    const dateGroups = props.event.dateGroupsByEvent.edges.map((element)=>{return React.cloneElement(props.children, {key:element.node.id, dateGroup:element.node})});
    return(
        <div className="event-preview-event-container">
            <div className='event-preview-header'><h3>{props.event.activityByEventType.name}</h3><a>edit</a></div>
            <div>
                {dateGroups}
                {React.cloneElement(props.form, {eventId:props.event.id})}
            </div>
        </div>
    );
}
//
function EventsPreviewChild(props) {
    //console.log(props.queryResult);
    if(!props.queryResult.allEvents){
        return <div>is broken</div>
    }
    const events = props.queryResult.allEvents.edges.map((element)=>{return React.cloneElement(props.children, {key:element.node.id, event:element.node})});
    return (
        <div className="event-preview-container-container">
            <div className="event-preview-container">
                {events}
            </div>
        </div>
    );
}

function EventsPreview(props){
    return <QueryHandler query={GET_EVENTS} child={(data) => {
            return <EventsPreviewChild queryResult={data} {...props}/>
        }}/>
}

export {Event, DateGroup, EventsPreview}
