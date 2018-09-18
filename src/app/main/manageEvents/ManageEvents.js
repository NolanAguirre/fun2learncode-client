import React, {Component} from 'react';
import {DropDown} from '../common/Common'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
const GET_ACTIVITIES = gql`
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
class ManageEvents extends Component{
    constructor(props){
        super(props);
        this.state = {activityCatagory:null, eventType:null};
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }
    render(){
        return(
            <Query query={GET_ACTIVITIES}>
            {({loading,error,data}) => {
                if (loading) {
                    return 'Loading...';
                }
                if (error) {
                    return `Error! ${error.message}`;
                }
                let catagories = data.allActivityCatagories.edges.map((element)=>{
                    return {name:element.node.name, value:element.node.id};
                })
                let eventTypes = data.allActivities.edges.map((element)=>{
                    return {name:element.node.name + " (" + element.node.activityCatagoryByType.name + ")", value:element.node.id};

                })
                let addresses = data.allAddresses.edges.map((element)=>{
                    return {name:element.node.alias, value:element.node.id};
                })
                return(
                    <div>
                        <div>
                            <h2>Create new event type</h2>
                            <div>
                                Name: <input></input>
                                Description: <input></input>
                                Catagory: <DropDown
                                            onChange={this.handleInputChange}
                                            name="activityCatagory"
                                            value={this.state.activityCatagory}
                                            options={catagories}></DropDown>
                            </div>
                        </div>
                        <div>
                            <h2>Schedule Event</h2>
                                Event Type: <DropDown
                                        onChange={this.handleInputChange}
                                        name="eventType"
                                        value={this.state.eventType}
                                        options={eventTypes}></DropDown>
                                Price: <input></input>
                                Capacity: <input></input>
                            {JSON.stringify(addresses)}
                        </div>
                    </div>
                );
            }}
            </Query>
        );
    }
}

export default ManageEvents;
