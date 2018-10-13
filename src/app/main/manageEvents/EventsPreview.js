import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './EventsPreview.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import memoize from "memoize-one";
import Colors from '../calendar/Colors'
import moment from 'moment';
function DateGroup(props){
    if(!props.dateGroup.dates){
        return<div>not working</div>
    }
    const dates = props.dateGroup.dates.map((element)=>{return <div>{element}</div>})
        console.log(props);
    return(
        <div onClick={props.setActiveDateGroup} className="event-preview-date-container">
            <h4>open: {moment(props.dateGroup.open).format("MMMM do YYYY")}</h4>
            <h4>close: {moment(props.dateGroup.close).format("MMMM do YYYY")}</h4>
            <div>
                {dates}
            </div>
            {props.dateForm(props.dateGroup.id)}
        </div>
    );
}
function Event(props){
    if(!props.event.dateGroups){
        return<div>not working</div>
    }
    const dateGroups = props.event.dateGroups.map((element)=>{return props.child(element, element.id)});
    return(
        <div className="event-preview-event-container" >
            <div className='event-preview-header'><h3>{props.event.name}</h3><a>edit</a></div>
            <div>
                {dateGroups}
                {props.dateGroupForm(props.event.id)}
            </div>
        </div>
    );
}
function EventsPreview(props) {
    if(!props.events){
        return<div></div>
    }
    const events = props.events.map((element)=>{return props.child(element, element.id)});
    return (
        <div className="event-preview-container-container">
            <div className="event-preview-container">
                {events}
            </div>
        </div>
    );
}
export {Event, DateGroup, EventsPreview}
