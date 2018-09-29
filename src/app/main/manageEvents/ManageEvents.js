import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import {Calendar, DragAndDropCalendar} from '../calendar/Calendar';
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
class EventOptions extends Component{
    constructor(props){
        super(props);
        this.state = {
            price:100,
            capacity:8,
            open: new Date(),
            close: new Date(+new Date() + 86400000)
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event, refresh) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    handleTimeChange(movement, name){
        this.setState({[name]:movement})
    }
    render(){
     return(<table>
         <tbody>
             <tr>
                 <td>Type:</td>
                 <td><DropDown name="eventType" options={this.props.eventTypes} value={this.state.eventType} onChange={this.handleChange}></DropDown></td>
                 <td>Location:</td>
                 <td><DropDown name="address" options={this.props.addresses} value={this.state.address} onChange={this.handleChange}></DropDown></td>
             </tr>
             <tr>
                 <td>Price:</td>
                 <td><input name="price" value={this.state.price} onChange={this.handleChange} type="number"></input></td>
                 <td>Capacity:</td>
                 <td><input name="capacity" value={this.state.capacity} onChange={this.handleChange} type="number"></input></td>
             </tr>
             <tr>
                <td>Open Registation On:</td>
                <td><DateTime dateFormat="YYYY-MM-DD" value={this.state.open} onChange={(time)=>{this.onTimeChange(time, "open")}}/></td>
                <td>Close Registation On:</td>
                <td><DateTime dateFormat="YYYY-MM-DD" value={this.state.close} onChange={(time)=>{this.onTimeChange(time, "close")}}/></td>
            </tr>
             <tr>
                 <td><button onClick={()=>{this.props.createEvent(this.state)}}>Create event</button></td>
             </tr>
         </tbody>
     </table>)
    }
}



class DateGroups{
    constructor(){
        this.genId = this.genId.bind(this);
        this.newEvent = this.newEvent.bind(this);
        this.newDateGroup = this.newDateGroup.bind(this);
        this.removeDateGroup = this.removeDateGroup.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
    }
    genId(){
        return '_' + Math.random().toString(36).substr(2, 12);
    }
    newEvent(p, c, a, o, cl, t){
        this.currentEvent = '_' + Math.random().toString(36).substr(2, 12);;
        this[this.currentEvent] = {
            price:p,
            capacity:c,
            address:a,
            open:o,
            close:cl,
            type:t,
            dateGroups:[]
        }
        return this.currentEvent
    }
    newDateGroup(){
        let groupId = this.genId();
        this[this.currentEvent].dateGroups.push(groupId);
        return groupId;
    }
    removeDateGroup(id){
        for(let key in this){
            this[key].dateGroups = this[key].dateGroups.filter((el)=>{return el != id})
            if(this[key].dateGroups.length == 0){
                delete this[key];
            }
        }
    }
    selectEvent(id){
        this.currentEvent=id;
        return this[id];
    }
}
class ManageEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {id:null},
            events: [],
            calendarEvents: [],
            groupId: '_' + Math.random().toString(36).substr(2, 9)
        }
        this.dateGroups = new DateGroups();
        this.eventTypes = [];
        this.addresses = [];
        this.newEvent = this.newEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.genNewGroup = this.genNewGroup.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.tooltipAccessor = this.tooltipAccessor.bind(this);
    }
    genNewGroup(){
        this.setState({groupId: '_' + Math.random().toString(36).substr(2, 9)})
    }
    createEvent({price, capacity, address, open, close, eventType}){
        let eventId = this.dateGroups.newEvent(price, capacity, address, open,close,eventType);
        this.setState({
            events: [...this.state.events, eventId]
        })
    }
    newEvent(event) {  //slot select
        if(true){
            let eventName = this.eventTypes.filter((element)=>{
                return element.value === this.state.eventType;
            })[0].name
            if(event.action === 'doubleClick'){
                if(this.state.isGroup === "false"){
                    this.dateGroup.newEvent(this.state.price,
                        this.state.capacity,
                        this.state.open,
                        this.state.close,
                        this.state.address,
                        this.state.eventType)
                }
                let groupId = this.genNewGroup();
                let hour = {
                    id: '_' + Math.random().toString(36).substr(2, 9),
                    title: eventName,
                    start: event.start,
                    end: event.end,
                    buttonStyle:{backgroundColor:Colors.get(groupId).regular},
                    resources:{
                        start: this.state.start,
                        end: this.state.end,
                        groupId: groupId,
                        isGroup: this.state.isGroup
                    }
                }
                this.dateGroups[groupId] =
                this.setState({
                    events: this.state.events.concat([hour])
                })
                console.log(this.dateGroups)
                return;
            }
        }
        if(event.action==='select'){
            let selectedId = this.state.selected.id;
            if(selectedId != null){
              const newEvents = this.state.events.filter((element)=>{return element.id != selectedId});
              let newEvent = Object.assign({},this.state.selected);
              newEvent.start = event.start;
              newEvent.end = new Date(+event.start + 86400000 * event.slots.length);
              this.setState({
                  events: [...newEvents, newEvent],
              });
          }
      }
        this.resetSelectedEvent();
      }
    removeEvent(event){
        const newEvents = this.state.events.filter((element)=>{return element.id != event.id});
        let removeGroup = newEvents.filter((element)=>{return element.resources.groupId == event.resources.groupId}).length == 0;
        this.setState({
            events: newEvents,
        })
        if(removeGroup){
            delete this.dateGroups[event.resources.groupId]
        }
    }
    selectEvent(event){
        if(this.state.selected.id === event.id){
            this.resetSelectedEvent();
        }else{
            event.buttonStyle = {backgroundColor:Colors.get(event.resources.groupId).hover}
            this.setState({selected:event, isGroup:event.resources.isGroup, groupId:event.resources.groupId})
      }
    }
    resetSelectedEvent(){
        this.setState({selected:{id:null},events:this.state.events.map((element)=>{
            element.buttonStyle = {backgroundColor:Colors.get(element.resources.groupId).regular}
            return element;
        })});
    }
    tooltipAccessor(event){
        let group = this.dateGroups[event.resources.groupId];
        let address = this.addresses.filter((element)=>{
            return element.value === group.address;
        })[0].name
return`From: ${moment(event.resources.start).format("h:mm a")}
To: ${moment(event.resources.end).format("h:mm a")}
Price: ${group.price}
Location: ${address}
Capacity: ${group.capacity}
Registartion
    Open: ${moment(group.open).format("MMMM Do")} Close: ${moment(group.close).format("MMMM Do")}
`;
    }
    render() {
        return (<Query query={GET_ACTIVITIES}>
            {
                ({loading, error, data}) => {
                    if (loading) {
                        return 'Loading...';
                    }
                    if (error) {
                        return `Error! ${error.message}`;
                    }
                    let catagories = data.allActivityCatagories.edges.map((element) => {
                        return {name: element.node.name, value: element.node.id};
                    })
                    this.eventTypes = data.allActivities.edges.map((element) => {
                        return {
                            name: element.node.name + " (" + element.node.activityCatagoryByType.name + ")",
                            value: element.node.id
                        };

                    })
                    this.addresses = data.allAddresses.edges.map((element) => {
                        return {name: element.node.alias, value: element.node.id};
                    })
                    return (
                    <div className="manage-events-container">
                        <div className="manage-events-info">
                            <EventOptions
                                addresses={this.addresses}
                                eventTypes={this.eventTypes}
                                createEvent={this.createEvent}
                                />
                        </div>
                        {
                            (this.state.events.length > 0)?
                        <DragAndDropCalendar
                            tooltipAccessor={this.tooltipAccessor}
                            selected={this.state.selected}
                            removeEvent={this.removeEvent}
                            selectEvent={this.selectEvent}
                            newEvent={this.newEvent}
                            events={this.state.calendarEvents}
                            className="manage-events-calander"/>: <div></div>
                    }
                    </div>);
                }
            }
        </Query>);
    }
}
export default ManageEvents;
