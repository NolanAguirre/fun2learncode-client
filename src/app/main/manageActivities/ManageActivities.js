import React, {Component} from 'react';
import gql from 'graphql-tag';
import memoize from "memoize-one";
import {DropDown} from '../common/Common';
import './ManageActivities.css';
import QueryHandler from '../queryHandler/QueryHandler';
import MutationHandler from '../queryHandler/MutationHandler';
import {SecureRoute} from '../common/Common'

//TODO be able to remove prerequisites, make description text box keep text on edit

const GET_ACTIVITIES = gql`query manageActivitiesQuery{
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
      eventPrerequisitesByPrerequisite {
        nodes {
          activityByEvent {
            name
            id
            nodeId
          }
        }
      }
    }
  }
}`

const CREATE_ACTIVITY = gql `mutation ($name: String!, $type: UUID!, $description: String!) {
  createActivity(input: {activity: {name: $name, type: $type, description: $description}}) {
    activity {
      nodeId
    }
  }
}`

const UPDATE_ACTIVITY = gql`mutation($id:UUID!, $patch:ActivityPatch!){
  updateActivityById(input:{id:$id, activityPatch:$patch}){
    activity{
      nodeId
    }
  }
}`

const CREATE_PREREQUISITE = gql`mutation($eventPrerequisite:CreateEventPrerequisiteInput!){
  createEventPrerequisite(input:$eventPrerequisite){
    clientMutationId
  }
}`;

class PrerequisiteForm extends Component{
    constructor(props){
        super(props);
        this.state={prerequisite:undefined,edit:false}
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

    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if (this.state.prerequisite != undefined) {
            let eventPrerequisite = {
                event: this.props.id,
                prerequisite:this.state.prerequisite
            }
            this.setState({
                edit:false,
                prerequisite:undefined
            });
            mutation({
                variables: {eventPrerequisite: {eventPrerequisite}}
            });
        }
    }

    render = () =>{
        if(this.state.edit){
            return <div>
                <MutationHandler handleMutation={this.handleSubmit} mutation={CREATE_PREREQUISITE}>
                    <DropDown options={this.props.prerequisites} name="prerequisite" value={this.state.type} onChange={this.handleInputChange}/>
                    <button type="submit">Finish</button>
                </MutationHandler>
            </div>
        }else{
            return <div>
                <button onClick={this.toggleEdit}>edit</button>
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
        this.editableDescription = this.props.description;
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

    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if (this.state.type && this.state.name !='New Activity' && this.description) {
            let temp = Object.assign({}, this.state);
            delete temp.edit;
            if(this.props.id){
                mutation({
                    variables: {"id":this.props.id, "patch": temp}
                });
            }else{
                mutation({
                    variables: temp
                });
            }
        }
        this.setState({
            edit:false,
            type: this.props.type,
            description:this.props.description,
            name:this.props.name
        });
    }

    render = () => {
        if(this.state.edit){
            return <div key={this.props.id} className="activity-container">
                <MutationHandler handleMutation={this.handleSubmit} mutation={this.props.query} refetchQueries={['manageActivitiesQuery', 'calanderQuery']}>
                    <div className="activity-header">
                        <img className="activity-image" src="https://via.placeholder.com/350x150"></img>
                        <div className="activity-header-text">
                            <h2 className="activity-title">
                                <input name="name" onChange={this.handleInputChange} value={this.state.name} />
                                <DropDown options={this.props.types} name="type" value={this.state.type} onChange={this.handleInputChange}/>
                            </h2>
                        </div>
                        <div className="activity-view-events">
                            <button type="submit" className="activity-view-events-btn">Finish</button>:
                        </div>
                    </div>
                    <div className="activity-body">
                        <div onInput={this.handleDescriptionChange}className="manage-activity-textarea" suppressContentEditableWarning={true} contentEditable></div>
                    </div>
               </MutationHandler>
            </div>
        }
        return <div key={this.props.id}className="activity-container">
            <div className="activity-header">
                <img className="activity-image" src="https://via.placeholder.com/350x150"></img>
                <div className="activity-header-text">
                    <h2 className="activity-title">
                        {this.props.name}
                    </h2>
                    {(this.props.prerequisites)?this.props.prerequisites.map((prerequisite)=>prerequisite.name):""}
                    {this.props.children}
                </div>
                <div className="activity-view-events">
                    <button type="button" onClick={(event)=>{event.preventDefault();this.setState({edit:true})}} className="activity-view-events-btn">Edit Details</button>
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
            let temp = element.eventPrerequisitesByPrerequisite.nodes.map((el) => {return el.activityByEvent});
            return {
                name: element.name,
                type: element.activityCatagoryByType.id,
                description: element.description,
                value: element.id, // this is named value so it can be used by the dropdown box
                prerequisites: temp
            }
        })
    );

    render = () => {
            const types = this.mapTypes(this.props.queryResult.allActivityCatagories);
            const activities = this.mapActivities(this.props.queryResult.allActivities);
            return <React.Fragment>
                <ManageActivitiesForm query={CREATE_ACTIVITY} name={"New Activity"} types={types}/>
                {activities.map((activity)=>{
                    return <ManageActivitiesForm query={UPDATE_ACTIVITY} types={types} prerequisites={activity.prerequisites} key={activity.value} id={activity.value} type={activity.type} description={activity.description} name={activity.name}>
                        <PrerequisiteForm id={activity.value} prerequisites={activities}/>
                    </ManageActivitiesForm>
                })}
                </React.Fragment>
    }
}

function ManageActivities(props) {
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <div className="manage-activities-container">
            <QueryHandler query={GET_ACTIVITIES}>
                <ManageActivitiesInner />
            </QueryHandler>
        </div>
    </SecureRoute>
}

export default ManageActivities;
