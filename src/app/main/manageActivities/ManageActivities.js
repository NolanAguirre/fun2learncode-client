import React, {Component} from 'react';
import gql from 'graphql-tag';
import Logo from '../../logos/x-icon.svg'
import './ManageActivities.css';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, DropDown, ArchiveOptions} from '../common/Common'
import Activity from '../activities/activity/Activity'
//TODO be able to remove prerequisites, make description text box keep text on edit

const GET_ACTIVITIES = (archive) => `{
  allActivities(condition:{${archive}}) {
    nodes {
      nodeId
      id
      url
      archive
      description
      name
      categoryByCategory {
        id
        nodeId
      }
      activityPrerequisitesByActivity {
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

const GET_DROPDOWN = `{
  allCategories {
    nodes {
      nodeId
      id
      name
    }
  }
}`

const CREATE_ACTIVITY =  `mutation ($activity:CreateActivityInput!) {
  createActivity(input:$activity) {
    activity {
        nodeId
        id
        url
        archive
        description
        name
        categoryByCategory {
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
        url
        archive
        description
        name
        categoryByCategory {
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

const REMOVE_PREREQUISITE = `mutation ($id: UUID!) {
  deleteActivityPrerequisiteById(input: {id: $id}) {
    activityPrerequisite {
      nodeId
      id
      activityByActivity {
        nodeId
      }
      activityByPrerequisite {
        nodeId
      }
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
            },
            customCache: (cache, data) => {cache.remove(data)}
        })
        return <div key={prerequisite.id} className="prerequisite-container">
                {prerequisite.activityByPrerequisite.name}
                <div className="prerequisite-x-container">
                    <button className="no-style-button" onClick={mutation.onSubmit}>
                        <img className="x-icon" alt='x-icon' src={Logo} />
                    </button>
                </div>
            </div>})
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
                <DropDown options={this.props.activities} name="prerequisite" value={this.state.category} onChange={this.handleInputChange}/>
                <button onClick={this.mutation.onSubmit}>Confirm</button>
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
            category: this.props.category,
            description:this.props.description,
            name:this.props.name,
            url:this.props.url,
            archive: this.props.archive
        };
        this.mutation = new Mutation({
            mutation:this.props.mutation,
            onSubmit: this.handleSubmit,
            onResolve: this.resetState
        })
    }

    componentWillUnmount = () => {
        this.mutation.removeListeners()
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
        let haveValues =  this.state.category && this.state.name != 'New Activity' && this.state.description && this.state.url
        let changedValues = this.state.category != this.props.category ||
               this.state.name != this.props.name ||
               this.state.description != this.props.description ||
               this.state.url != this.props.url ||
               this.state.archive != this.props.archive

         return haveValues && changedValues
    }

    toggleEdit = (event) =>{
        event.preventDefault();
        this.setState({edit:true});
        if(this.props.id){
            setTimeout(()=>document.getElementById(`${this.props.id}`).innerHTML = this.props.description, 0); // super hacky way to make contentEditable work
        }
    }

    resetState = () => {
        const element = document.getElementById(`${this.props.id || 'new'}`)
        if(element){
            element.innerHTML = this.props.description || ''
        }
        this.setState({
            edit:false,
            category: this.props.category,
            description:this.props.description,
            name:this.props.name,
            url:this.props.url,
            archive: this.props.archive
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({edit:false})
        if (this.hasRequiredValues()) {
            let activity = Object.assign({}, this.state);
            delete activity.edit;
            if(this.props.id){
                return {"id":this.props.id, "patch": activity}
            }else{
                return {activity:{activity}};
            }
        }
        return false;
    }

    formatName = () => {
        let catgeoryName = this.props.categories.filter(obj=>obj.value===this.props.category)[0]
        if( catgeoryName &&  catgeoryName.name){
            return `${this.props.name} (${catgeoryName.name})`
        }else{
            return this.props.name
        }
    }

    render = () => {
        let components = {
            prerequesiteComponent: <React.Fragment>
            {(this.props.prerequisites)?<Prerequisites prerequisites={this.props.prerequisites} />:""}
            {this.props.children}
            </React.Fragment>
        }
        if(this.state.edit){
            components.imageComponent = <textarea className='activity-image' value={this.state.url} name='url' placeholder='Image URL' onChange={this.handleInputChange}/>
            components.nameComponent = <React.Fragment>
                <div className='container column'>
                    <div>
                        <input name="name" onChange={this.handleInputChange} value={this.state.name} />
                        <DropDown options={this.props.categories} name="category" value={this.state.category} onChange={this.handleInputChange}/>
                    </div>
                     <span className='archive-txt'>Archive: <input name='archive' onChange={this.handleInputChange} checked={this.state.archive} type='checkbox'/></span>
                </div>
            </React.Fragment>
            components.buttonComponent = <button type="submit" className="activity-view-events-btn">Finish</button>
            components.descriptionComponent = <div id={this.props.id || 'new'} onInput={this.handleDescriptionChange} className="manage-activity-textarea" suppressContentEditableWarning={true} contentEditable></div>
        }else{
            components.buttonComponent = <button type="button" onClick={this.toggleEdit} className="activity-view-events-btn">Edit Details</button>
            components.descriptionComponent = <div id={this.props.id || 'new'}>{this.props.description}</div>
        }

        return <form key={this.props.id} onSubmit={this.mutation.onSubmit}>
            <Activity {...components} name={this.formatName()} url={this.props.url} />
        </form>
    }
}

function ManageActivitiesInner(props) {
     function mapActivities(data){
         return data.nodes.map((element) => {
                let temp = element.activityPrerequisitesByActivity.nodes.map((el) => el);
                return {
                    name: element.name,
                    key: element.id, // this is named value so it can be used by the dropdown box
                    id: element.id,
                    value: element.id,
                    category: element.categoryByCategory.id,
                    description: element.description,
                    prerequisites: temp,
                    url: element.url,
                    archive:element.archive
                }
            })
        }
        const activities = mapActivities(props.allActivities);
        return activities.map((activity) => {
                return <ManageActivitiesForm
                    mutation={UPDATE_ACTIVITY}
                    categories={props.categories}
                    {...activity}>
                    <PrerequisiteForm activityId={activity.id} activities={activities} />
                </ManageActivitiesForm>
            })
}

function InBetween(props){
    const categories = props.allCategories.nodes.map((element) =>  {return{name: element.name, value: element.id}})
    return <React.Fragment>
        <ManageActivitiesForm mutation={CREATE_ACTIVITY} name={"New Activity"} categories={categories}/>
        <ArchiveOptions query={GET_ACTIVITIES}>
            <ReactQuery>
                <ManageActivitiesInner categories={categories}/>
            </ReactQuery>
        </ArchiveOptions>
    </React.Fragment>
}

function ManageActivities(props) {
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <div className="manage-activities-container">
            <ReactQuery query={GET_DROPDOWN}>
                <InBetween />
            </ReactQuery>
        </div>
    </SecureRoute>
}

export default ManageActivities;
