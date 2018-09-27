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

function EventOptions(props){
    const isGroupOptions=[
        {
            name:"Group",
            value:true
        },{
            name:"Singleton",
            value: false
        }
    ]
 return(<table>
     <tbody>
         <tr>
             <td>Type:</td>
             <td><DropDown name="eventType" options={props.eventTypes} value={props.eventType} onChange={props.onChange}></DropDown></td>
             <td>Location:</td>
             <td><DropDown name="address" options={props.addresses} value={props.address} onChange={props.onChange}></DropDown></td>
         </tr>
         <tr>
             <td>Treat Dates as:</td>
             <td><DropDown name="isGroup" options={isGroupOptions} value={props.isGroup} onChange={props.onChange}/></td>
             {
                  (props.isGroup === "true")?(<td><button onClick={props.genNewGroup}>Create New group</button></td>):<td></td>
              }
         </tr>
         <tr>
             <td>Price:</td>
             <td><input name="price" value={props.price} onChange={props.onChange} type="number"></input></td>
             <td>Capacity:</td>
             <td><input name="capacity" value={props.capacity} onChange={props.onChange} type="number"></input></td>
         </tr>
         <tr>
             <td>Start Time:</td>
             <td><DateTime dateFormat={false} value={props.start} onChange={(time)=>{props.onTimeChange(time, "start", false)}}/></td>
             <td>End Time:</td>
             <td><DateTime dateFormat={false} value={props.end} onChange={(time)=>{props.onTimeChange(time, "end", false)}}/></td>
         </tr>
         <tr>
             <td>Open Registation On:</td>
             <td><DateTime dateFormat="YYYY-MM-DD" value={props.open} onChange={(time)=>{props.onTimeChange(time, "open", true)}}/></td>
             <td>Close Registation On:</td>
             <td><DateTime dateFormat="YYYY-MM-DD" value={props.close} onChange={(time)=>{props.onTimeChange(time, "close", true)}}/></td>
         </tr>
     </tbody>
 </table>)
}

class ManageEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {id:null},
            events: [],
            isGroup: "false",
            price:100,
            capacity:8,
            start: new Date(),
            end: new Date(),
            open: new Date(),
            close: new Date(+new Date() + 86400000),
            groupId: '_' + Math.random().toString(36).substr(2, 9)
        }
        this.eventTypes = [];
        this.addresses = [];
        this.isGroup = false;
        this.newEvent = this.newEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.genNewGroup = this.genNewGroup.bind(this);
        this.tooltipAccessor = this.tooltipAccessor.bind(this);
    }
    genNewGroup(){
        this.setState({groupId: '_' + Math.random().toString(36).substr(2, 9)})
    }
    hasRequiredValues(state){
        return state.address && state.eventType ;
    }
    newEvent(event) {  //slot select
        if(this.hasRequiredValues(this.state)){
            let eventName = this.eventTypes.filter((element)=>{
                return element.value === this.state.eventType;
            })[0].name
            if(event.action === 'doubleClick'){
                let groupId;
                if(this.state.isGroup === "false"){
                    groupId = '_' + Math.random().toString(36).substr(2, 9);
                    this.setState({groupId: groupId})
                }else{
                    groupId = this.state.groupId
                }
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
                        isGroup: this.state.isGroup,
                    }
                }
                this.setState({
                  events: this.state.events.concat([hour]),
                  [groupId]: {
                      price:this.state.price,
                      capacity:this.state.capacity,
                      open: this.state.open,
                      close: this.state.close,
                      address: this.state.address,
                      eventType: this.state.eventType
                  }
                })
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
        this.setState({
            events: newEvents
        })
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
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.genNewGroup();
        this.setState({[name]: value});
    }
    handleTimeChange(movement, name, refresh){
        if(refresh){
            this.genNewGroup();
        }
        this.setState({[name]:movement})
    }
    tooltipAccessor(event){
        let group = this.state[event.resources.groupId];
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
                                onChange={this.handleChange}
                                onTimeChange={this.handleTimeChange}
                                address={this.state.address}
                                eventType={this.state.eventType}
                                isGroup={this.state.isGroup}
                                price={this.state.price}
                                capacity={this.state.capacity}
                                start={this.state.start}
                                end={this.state.end}
                                open={this.state.open}
                                close={this.state.close}
                                addresses={this.addresses}
                                eventTypes={this.eventTypes}
                                genNewGroup={this.genNewGroup}
                                />
                        </div>
                        <DragAndDropCalendar
                            tooltipAccessor={this.tooltipAccessor}
                            selected={this.state.selected}
                            removeEvent={this.removeEvent}
                            selectEvent={this.selectEvent}
                            newEvent={this.newEvent}
                            events={this.state.events}
                            className="manage-events-calander"/>
                    </div>);
                }
            }
        </Query>);
    }
}
export default ManageEvents;
