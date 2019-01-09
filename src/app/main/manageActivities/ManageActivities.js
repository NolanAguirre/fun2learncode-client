import React, {Component} from 'react';
import gql from 'graphql-tag';
import memoize from "memoize-one";
import Logo from '../../logos/x-icon.svg'
import {DropDown} from '../common/Common';
import './ManageActivities.css';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'

//TODO be able to remove prerequisites, make description text box keep text on edit

const GET_ACTIVITIES = `{
  allActivityCatagories {
    nodes {
      nodeId
      id
      name
    }
  }
  allActivities {
    nodes {
      nodeId
      id
      description
      name
      activityCatagoryByType {
        id
        nodeId
      }
      activityPrerequisitesByActivity{
        nodes {
          id
          nodeId
          activityByPrerequisite {
            name
            id
            nodeId
          }
        }
      }
    }
  }
}`

const CREATE_ACTIVITY =  `mutation ($name: String!, $type: UUID!, $description: String!) {
  createActivity(input: {activity: {name: $name, type: $type, description: $description}}) {
    activity {
        nodeId
        id
        description
        name
        activityCatagoryByType {
          id
          nodeId
        }
        activityPrerequisitesByActivity{
          nodes {
            id
            nodeId
            activityByPrerequisite {
              name
              id
              nodeId
            }
          }
        }
    }
  }
}`

const UPDATE_ACTIVITY = `mutation($id:UUID!, $patch:ActivityPatch!){
  updateActivityById(input:{id:$id, activityPatch:$patch}){
    activity{
        nodeId
        id
        description
        name
        activityCatagoryByType {
          id
          nodeId
        }
        activityPrerequisitesByActivity{
          nodes {
            id
            nodeId
          }
      }
    }
  }
}`

const CREATE_PREREQUISITE = `mutation($activityPrerequisite:CreateActivityPrerequisiteInput!){
  createActivityPrerequisite(input:$activityPrerequisite){
  	activityPrerequisite{
      nodeId
      id
      activityByActivity{
        nodeId
      }
      activityByPrerequisite{
        nodeId
      }
    }
  }
}`;

const REMOVE_PREREQUISITE = `mutation($id:UUID!){
  deleteActivityPrerequisiteById(input:{id:$id}){
    activityPrerequisite{
      nodeId
    }
  }
}`

function Prerequisites(props){ // this can use caching
    return props.prerequisites.map((prerequisite)=>{
        const mutation = new Mutation({
            mutation:REMOVE_PREREQUISITE,
            onSubmit: (event) => {
                event.preventDefault();
                return {id: prerequisite.id}
            }
        })
        return <form onSubmit={mutation.onSubmit} key={prerequisite.id}>
            <div className="prerequisite-container">
                {prerequisite.activityByPrerequisite.name}
                <div className="prerequisite-x-container">
                    <button className="no-style-button" type="submit">
                        <img className="x-icon" alt='x-icon' src={Logo} />
                    </button>
                </div>
            </div>
        </form>})
}

class PrerequisiteForm extends Component{
    constructor(props){
        super(props);
        this.state={prerequisite:undefined,edit:false}
        this.mutation =  new Mutation({
            mutation:CREATE_PREREQUISITE,
            onSubmit: this.handleSubmit
        })
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    toggleEdit = () =>{
        this.setState({edit: !this.state.edit })
    }

    handleSubmit = (event) => { // TODO implement hasRequiredValues
        event.preventDefault();
        if (this.state.prerequisite != undefined) {
            let activityPrerequisite = {
                activity: this.props.activityId,
                prerequisite:this.state.prerequisite
            }
            this.setState({
                edit:false,
                prerequisite:undefined
            });
            return  {activityPrerequisite: {activityPrerequisite}}
        }
        this.setState({
            edit:false,
            prerequisite:undefined
        });
        return false;
    }

    render = () =>{
        if(this.state.edit){ // this can use caching
            return <div>
                <form onSubmit={this.mutation.onSubmit}>
                    <DropDown options={this.props.activities} name="prerequisite" value={this.state.type} onChange={this.handleInputChange}/>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        }else{
            return <div>
                <button onClick={this.toggleEdit}>Add Prerequisite</button>
            </div>
        }
    }
}

class ManageActivitiesForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            type: this.props.type,
            description:this.props.description,
            name:this.props.name,
        };
        this.mutation = new Mutation({
            mutation:this.props.mutation,
            onSubmit: this.handleSubmit,
            onResolve: this.resetState
        })
    }

    handleDescriptionChange = (event) => {
        event.persist();
        this.setState({description:event.target.textContent})
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    hasRequiredValues = () =>{
        let haveValues =  this.state.type && this.state.name != 'New Activity' && this.state.description
        let changedValues = this.state.type != this.props.type ||
               this.state.name != this.props.name ||
               this.state.description != this.props.description
         return haveValues && changedValues
    }

    toggleEdit = () =>{
        this.setState({edit:true});
        if(this.props.id){
            setTimeout(()=>document.getElementById(`${this.props.id}`).innerHTML = this.props.description, 0); // super hacky way to make contentEditable work
        }
    }

    resetState = () => {
        this.setState({
            edit:false,
            type: this.props.type,
            description:this.props.description,
            name:this.props.name
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.hasRequiredValues()) {
            let temp = Object.assign({}, this.state);
            delete temp.edit;
            if(this.props.id){
                return {"id":this.props.id, "patch": temp}
            }else{
                return temp;
            }
        }
        this.setState({edit:false})
        return false;
    }

    render = () => {
        if(this.state.edit){
            return <div key={this.props.id} className="activity-container">
                <form onSubmit={this.mutation.onSubmit}>
                    <div className="activity-header">
                        <img className="activity-image" src="https://via.placeholder.com/350x150"></img>
                        <div className="activity-header-text">
                            <h2 className="activity-title">
                                <input name="name" onChange={this.handleInputChange} value={this.state.name} />
                                <DropDown options={this.props.types} name="type" value={this.state.type} onChange={this.handleInputChange}/>
                            </h2>
                        </div>
                        <div className="activity-view-events">
                            <button type="submit" className="activity-view-events-btn">Finish</button>
                        </div>
                    </div>
                    <div className="activity-body">
                        <div id={this.props.id} onInput={this.handleDescriptionChange} className="manage-activity-textarea" suppressContentEditableWarning={true} contentEditable></div>
                    </div>
               </form>
            </div>
        }
        return <div key={this.props.id}className="activity-container">
            <div className="activity-header">
                <img className="activity-image" src="https://via.placeholder.com/350x150"></img>
                <div className="activity-header-text">
                    <h2 className="activity-title">
                        {this.props.name}
                    </h2>
                    {(this.props.prerequisites)?<Prerequisites prerequisites={this.props.prerequisites} />:""}
                    {this.props.children}
                </div>
                <div className="activity-view-events">
                    <button type="button" onClick={this.toggleEdit} className="activity-view-events-btn">Edit Details</button>
                </div>
            </div>
            <div className="activity-body">
                {this.props.description}
            </div>
        </div>
    }
}

class ManageActivitiesInner extends Component {
    constructor(props) {
        super(props);
    }

    mapTypes = memoize(
        (data) =>  data.nodes.map((element) =>  {return{name: element.name, value: element.id}})
    );

    mapActivities = memoize(
        (data) => data.nodes.map((element) => {
            let temp = element.activityPrerequisitesByActivity.nodes.map((el) => el);
            return {
                name: element.name,
                value: element.id, // this is named value so it can be used by the dropdown box
                type: element.activityCatagoryByType.id,
                description: element.description,
                prerequisites: temp
            }
        })
    );

    render = () => {
        console.log(this.props.queryResult)
            const types = this.mapTypes(this.props.queryResult.allActivityCatagories);
            const activities = this.mapActivities(this.props.queryResult.allActivities);
            return <React.Fragment>
                <ManageActivitiesForm mutation={CREATE_ACTIVITY} name={"New Activity"} types={types}/>
                {activities.map((activity)=>{
                    return <ManageActivitiesForm
                        mutation={UPDATE_ACTIVITY}
                        types={types}
                        prerequisites={activity.prerequisites}
                        key={activity.value}
                        id={activity.value}
                        type={activity.type}
                        description={activity.description}
                        name={activity.name}>
                        <PrerequisiteForm activityId={activity.value} activities={activities}/>
                    </ManageActivitiesForm>
                })}
                </React.Fragment>
    }
}

function ManageActivities(props) {
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <div className="manage-activities-container">
            <ReactQuery query={GET_ACTIVITIES}>
                <ManageActivitiesInner />
            </ReactQuery>
        </div>
    </SecureRoute>
}

export default ManageActivities;
