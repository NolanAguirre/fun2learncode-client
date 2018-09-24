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
// function DateGroupRow(props){
//     return(
//         <tr>
//             <td>add date</td>
//             <td><DateTime/></td>
//             <td>Duration: <input type="number"></input></td>
//         </tr>);
// }
//
// class DateGroupTable extends Component{
//     constructor(props){
//         super(props);
//         this.state = {events:[<DateGroupRow></DateGroupRow>]};
//         this.createRow = this.createRow.bind(this);
//         this.removeRow = this.removeRow.bind(this);
//     }
//     createRow(){
//         this.setState({
//             events:[...this.state.events, <DateGroupRow></DateGroupRow>]
//         })
//     }
//     removeRow(){
//         if(this.state.events.lenght > 0){
//             let end = this.state.events.lengt -1;
//             this.setState({
//                 events:this.state.events.slice(0, end)
//             })
//         }
//     }
//     render(){
//     return(
//         <table>
//             <tbody>
//                 {this.state.events}
//                 <tr>
//                     <td><button onClick={this.createRow}>Add a Date</button></td>
//                     <td><button onClick={this.removeRow}>Remove a Date</button></td>
//                 </tr>
//             </tbody>
//         </table>);
//     }
// }
//

class ManageEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
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
                    let eventTypes = data.allActivities.edges.map((element) => {
                        return {
                            name: element.node.name + " (" + element.node.activityCatagoryByType.name + ")",
                            value: element.node.id
                        };

                    })
                    let addresses = data.allAddresses.edges.map((element) => {
                        return {name: element.node.alias, value: element.node.id};
                    })
                    let events = data.allEvents.edges;
                    if (this.state.route === "activity") {} else if (this.state.route === "event") {} else if (this.state.route === "adress") {} else {}
                    return (
                        <div className="manage-events-container">
                        <div className="manage-events-info">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Type:</td>
                                        <td><DropDown name="eventType" options={eventTypes} value={this.state.eventType} onChange={this.handleInputChange}></DropDown></td>
                                    </tr>
                                    <tr>
                                        <td>Location:</td>
                                        <td><DropDown name="adress" options={addresses} value={this.state.address} onChange={this.handleInputChange}></DropDown></td>
                                    </tr>
                                    <tr>
                                        <td>price:</td>
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
                                </tbody>
                            </table>
                        </div>
                        <DragAndDropCalendar events={this.state.events} className="manage-events-calander"/>
                    </div>);
                }
            }
        </Query>);
    }
}
//<Calender className="manage-events-calander" calanderEvents={events}></Calender>
export default ManageEvents;
