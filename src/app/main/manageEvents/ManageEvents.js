import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import {Calender, DragAndDropCalendar} from '../calender/Calender';
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
class ManageEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {id:null},
            events: [],
        }
        this.eventTypes = [];
        this.newEvent = this.newEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.selectEvent = this.selectEvent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    newEvent(event) {  //slot select
        if(this.state.eventType){
            let eventName = this.eventTypes.filter((element)=>{
                return element.value === this.state.eventType;
            })[0].name
            if(event.action === 'doubleClick'){
                let newId = '_' + Math.random().toString(36).substr(2, 9);
                let hour = {
                  id: newId,
                  title: eventName || "Name Needed",
                  start: event.start,
                  end: event.end,
                  resources:{
                      times:[]
                  }
                }
                this.setState({
                  events: this.state.events.concat([hour]),
                })
                return;
            }
        }
        let selectedId = this.state.selected.id;
        if(selectedId != null){
          const newEvents = this.state.events.filter((element)=>{return element.id != selectedId});
          let newEvent = Object.assign({},this.state.selected);
          newEvent.start = event.start;
          newEvent.end = new Date(+event.start + 86400000 * event.slots.length);
          this.setState({
              events: [...newEvents, newEvent],
              selected: newEvent,
          });
        }
        this.setState({selected:{id:null}})
      }
    removeEvent(event){
        const newEvents = this.state.events.filter((element)=>{return element.id != event.id});
        this.setState({
            events: newEvents
        })
    }
    selectEvent(event){
        if(this.state.selected.id === event.id){
            this.setState({selected:{id:null}})
        }else{
            this.setState({selected:event})
      }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
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
                    let addresses = data.allAddresses.edges.map((element) => {
                        return {name: element.node.alias, value: element.node.id};
                    })
                    let events = data.allEvents.edges;
                    return (
                        <div className="manage-events-container">
                        <div className="manage-events-info">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Type:</td>
                                        <td><DropDown name="eventType" options={this.eventTypes} value={this.state.eventType} onChange={this.handleInputChange}></DropDown></td>
                                    </tr>
                                    <tr>
                                        <td>Location:</td>
                                        <td><DropDown name="adress" options={addresses} value={this.state.address} onChange={this.handleInputChange}></DropDown></td>
                                    </tr>
                                    <tr>
                                        <td>Price:</td>
                                        <td><input type="number"></input></td>
                                    </tr>
                                    <tr>
                                        <td>Capacity:</td>
                                        <td><input type="number"></input></td>
                                    </tr>
                                    <tr>
                                        <td>Open Registation On:</td>
                                        <td><DateTime /></td>
                                    </tr>
                                    <tr>
                                        <td>Close Registation On:</td>
                                        <td><DateTime /></td>
                                    </tr>
                                    <tr>
                                        <td><button>schedual event</button></td>
                                    </tr>
                                </tbody>
                            </table>
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
