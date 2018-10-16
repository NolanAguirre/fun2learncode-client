import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './EventsPreview.css';
import gql from 'graphql-tag';
import QueryHandler from '../queryHandler/QueryHandler';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import memoize from "memoize-one";
import Colors from '../calendar/Colors';
import moment from 'moment';

function DateGroup(props){
    //console.log(props);
    if(false){
        return<div>not working</div>
    }
    const dates = props.dateGroup.datesJoinsByDateGroup.edges.map((element)=>{
        return <div key={element.node.id}>{element.node.dateIntervalByDateInterval.start}</div>})
    return(
        <div onClick={()=>{props.setActiveDateGroup(props.dateGroup, props.event)}} className="event-preview-date-container">
            <h4>open: {moment(props.dateGroup.openRegistration).format("MMMM do YYYY")}</h4>
            <h4>close: {moment(props.dateGroup.closeRegistration).format("MMMM do YYYY")}</h4>
            <h4>Start: {moment(props.dateGroup.start).format("h:mm a")}</h4>
            <h4>End: {moment(props.dateGroup.end).format("h:mm a")}</h4>
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
    const dateGroups = props.event.dateGroupsByEvent.edges.map((element)=>{return <DateGroup key={element.node.id} dateGroup={element.node}/>});
    return(
        <div onClick={()=>{props.setActiveEvent(props.event)}} className="event-preview-event-container" >
            <div className='event-preview-header'><h3>{props.event.activityByEventType.name}</h3><a>edit</a></div>
            <div>
                {dateGroups}

            </div>
        </div>
    );
}
//{props.dateGroupForm(props.event.id)}
function EventsPreviewChild(props) {
    console.log(props.queryResult);
    const events = props.queryResult.allEvents.edges.map((element)=>{return <Event key={element.node.id} event={element.node}/>});
    return (
        <div className="event-preview-container-container">
            <div className="event-preview-container">
                {events}
            </div>
        </div>
    );
}

function EventsPreview(props){
    const query = gql`{
  allEvents {
    edges {
      node {
        eventType
        address
        activityByEventType{
          name
        }
        id
        addressByAddress {
          alias
          id
        }
        openRegistration
        closeRegistration
        price
        capacity
        dateGroupsByEvent {
          edges {
            node {
              openRegistration
              closeRegistration
              id
              datesJoinsByDateGroup {
                edges {
                  node {
                    id
                    dateIntervalByDateInterval {
                      start
                      end
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
    return <QueryHandler query={query} child={(data) => {
            return <EventsPreviewChild queryResult={data} {...props}/>
        }}/>
}

export {Event, DateGroup, EventsPreview}
