import React, {Component} from 'react';
import gql from 'graphql-tag';
import memoize from "memoize-one";
import {Query, Mutation} from 'react-apollo';
import {DropDown} from '../common/Common';
import './ManageActivities.css';
import Activity from '../activities/activity/Activity';
import QueryHandler from '../queryHandler/QueryHandler';
const GET_ADDRESSES = gql `{
allActivityCatagories{
   edges{
     node{
       name
       id
     }
   }
 }
allActivities{
  edges{
    node{
        name
        description
        id
        eventPrerequisitesByPrerequisite{
         edges{
           node{
             activityByEvent{
               name
               id
             }
           }
         }
       }
        activityCatagoryByType{
          name
        }
      }
    }
  }
}`
const MAKE_ACTIVITY = gql `
mutation($type:UUID!, $name:String!, $description:String!, $prerequisite:UUID){
  makeActivity(input:{arg0:$type, arg1:$name,arg2:$description,arg3:$prerequisite}){
    clientMutationId
  }
}
`;
function ManageActivities(props) {
    return <QueryHandler query={GET_ADDRESSES}
        child={(data) => {return <ManageActivitiesClass queryResult={data} {...props}/>}} />
}
class ManageActivitiesClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "none",
            prerequisite: "none",
            name: "",
            description: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    mapTypes = memoize(
        (data) =>  data.edges.map((element) =>  {return{name: element.node.name, value: element.node.id}})
    );
    mapPrerequisites = memoize(
        (data) => data.edges.map((element) => {return {name: element.node.name + " (" + element.node.activityCatagoryByType.name + ")",value: element.node.id}})
    );
    mapActivities = memoize(
        (data) => data.edges.map((element) => {let temp = element.node.eventPrerequisitesByPrerequisite.edges.map((el) => {return el.node.activityByEvent});
            return {
                name: element.node.name + " (" + element.node.activityCatagoryByType.name + ")",
                description: element.node.description,
                value: element.node.id,
                prerequisite: temp
            }
        })
    );
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    handleSubmit(event, mutation) {
        event.preventDefault();
        if (this.hasRequiredValues(this.state)) {
            mutation({
                variables: this.formatVariables(this.state)
            });
            this.setState({type: "none", prerequisite: "none", name: "", description: ""})
        } else {
            alert("Please fill in name, catagory and description at least");
        }
    }
    hasRequiredValues(state) {
        return state.type != 'none' && state.name != "" && state.description != "";
    }
    formatVariables(state) {
        let temp = Object.assign({}, state);
        if (temp.prerequisite === 'none') {
            delete temp.prerequisite;
        }
        return temp;
    }
    render() {
        const types = this.mapTypes(this.props.queryResult.allActivityCatagories);
        const prerequisites = this.mapPrerequisites(this.props.queryResult.allActivities);
        const activities = this.mapActivities(this.props.queryResult.allActivities);
        return (<div className="manage-activities-container">
            <div className="manage-activities-form-container">
                <div>
                    <h2>Create</h2>
                    <Mutation ignoreResults="ignoreResults" mutation={MAKE_ACTIVITY}>
                        {
                            (makeActivity, {data}) => (<form onSubmit={(e) => {
                                    this.handleSubmit(e, makeActivity)
                                }}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Name:</td>
                                            <td>
                                                <input value={this.state.name} name="name" onChange={this.handleInputChange}></input>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Catagory:</td>
                                            <td><DropDown options={types} name="type" value={this.state.type} onChange={this.handleInputChange}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Description:</td>
                                            <td>
                                                <textarea className="manage-activity-textarea"name="description" value={this.state.description} onChange={this.handleInputChange}></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Prerequisite:</td>
                                            <td><DropDown options={prerequisites} name="prerequisite" value={this.state.prerequisite} onChange={this.handleInputChange}/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button type="submit">Create Activity</button>
                            </form>)
                        }
                    </Mutation>
                </div>
            </div>
            <div className="manage-activities-preview">
                <h2>Preview</h2>
                <Activity name={this.state.name} description={this.state.description}/>
            </div>
        </div>);
    }
}
export default ManageActivities;
