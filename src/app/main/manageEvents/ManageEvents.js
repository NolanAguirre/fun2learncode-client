import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import {Calender, DragAndDropCalendar} from '../calender/Calender';
import Colors from '../calender/Colors'
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
  allEvents(first:2){
    edges{
      node{
        activityByEventType{
            name
        }
        addressByAddress{
          alias
        }
        eventDatesByEvent{
          edges{
            node{
              dateGroupByDateGroup{
                datesJoinsByDateGroup{
                  edges{
                    node{
                      dateIntervalByDateInterval{
                        end
                        start
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
             <td><input type="number"></input></td>
             <td>Capacity:</td>
             <td><input type="number"></input></td>
         </tr>
         <tr>
             <td>Start Time:</td>
             <td><DateTime /></td>
             <td>End Time:</td>
             <td><DateTime /></td>
         </tr>
         <tr>
             <td>Open Registation On:</td>
             <td><DateTime /></td>
             <td>Close Registation On:</td>
             <td><DateTime /></td>
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
            groupId: '_' + Math.random().toString(36).substr(2, 9)
        }
        this.eventTypes = [];
        this.addresses = [];
        this.isGroup = false;
        this.newEvent = this.newEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.genNewGroup = this.genNewGroup.bind(this);
    }
    genNewGroup(){
        this.setState({groupId: '_' + Math.random().toString(36).substr(2, 9)})
    }
    newEvent(event) {  //slot select
        if(this.state.eventType){
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
                    title: eventName + groupId || "Name Needed",
                    start: event.start,
                    end: event.end,
                    buttonStyle:{backgroundColor:Colors.get(groupId).regular},
                    resources:{
                        groupId: groupId,
                        isGroup: this.state.isGroup,
                    }
                }
                this.setState({
                  events: this.state.events.concat([hour]),
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
                  events: [...newEvents, newEvent]
              });
          }
      }
        this.resetSelectedEvent();
      }
    removeEvent(event){
        console.log(event);
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
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.genNewGroup();
        this.setState({[name]: value});
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
                    let events = data.allEvents.edges;
                    return (
                    <div className="manage-events-container">
                        <div className="manage-events-info">
                            <EventOptions
                                onChange={this.handleInputChange}
                                address={this.state.address}
                                eventType={this.state.eventType}
                                isGroup={this.state.isGroup}
                                addresses={this.addresses}
                                eventTypes={this.eventTypes}
                                genNewGroup={this.genNewGroup}
                                />
                        </div>
                        <DragAndDropCalendar
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
//<Calender className="manage-events-calander" calanderEvents={events}></Calender>
export default ManageEvents;
