import React, {Component} from 'react';
import gql from 'graphql-tag';
import Logo from '../../logos/x-icon.svg'
import './ManageActivities.css';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, DropDown, ArchiveOptions, GridView} from '../common/Common'
import {PrerequisiteForm, Prerequisites} from '../prerequisiteForm/PrerequisiteForm'
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

// TODO make this its own form
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
        if(this.state.edit){
            return <form className='activity-card' key={this.props.id} onSubmit={this.mutation.onSubmit}>
                    <textarea className='activity-image' value={this.state.url} name='url' placeholder='Image URL' onChange={this.handleInputChange}/>
                        <div className='container column'>
                            <div>
                                <input name="name" onChange={this.handleInputChange} value={this.state.name} />
                                <DropDown options={this.props.categories} name="category" value={this.state.category} onChange={this.handleInputChange}/>
                            </div>
                             <span className='archive-txt'>Archive: <input name='archive' onChange={this.handleInputChange} checked={this.state.archive} type='checkbox'/></span>
                        </div>
                      <div className='activity-body'>
                          <div id={this.props.id || 'new'} onInput={this.handleDescriptionChange} className="styled-textarea" suppressContentEditableWarning={true} contentEditable></div>
                      </div>
                      <div className='styled-button margin-top-10' onClick={this.mutation.onSubmit}>Finish</div>
                      <button className='hacky-submit-button' type='submit'/>
                  </form>
        }else{
            const prerequisites = this.props.prerequisites && this.props.prerequisites.length !== 0?<div><h4 className='no-margin'>Prerequisites</h4></div>:''
            return <div className='activity-card'>
                    <img className='activity-image mobile-center-x' src={this.props.url || 'https://via.placeholder.com/350x150'} />
                  <h2>{this.props.name}</h2>
                      {(this.props.prerequisites)?<Prerequisites prerequisites={this.props.prerequisites} />:""}
                      {this.props.children}
                  <div className='activity-body'>{this.props.description}</div>
                  <div className='styled-button margin-top-10' onClick={this.toggleEdit}>Edit</div>
              </div>
        }
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
        const mapped = activities.map((activity) => {
            return <ManageActivitiesForm
                mutation={UPDATE_ACTIVITY}
                categories={props.categories}
                {...activity}>
                <PrerequisiteForm activityId={activity.id} activities={activities} />
            </ManageActivitiesForm>
        })
        const child = [<ManageActivitiesForm mutation={CREATE_ACTIVITY} key='new' name={"New Activity"} categories={props.categories}/>, ...mapped]
        return <GridView fillerStyle='activity-card' className='container column section' itemsPerRow={3}>{child}</GridView>
}

function InBetween(props){
    const categories = props.allCategories.nodes.map((element) =>  {return{name: element.name, value: element.id}})
    return <React.Fragment>
        <ArchiveOptions query={GET_ACTIVITIES}>
            <ReactQuery>
                <ManageActivitiesInner categories={categories}/>
            </ReactQuery>
        </ArchiveOptions>
    </React.Fragment>
}

function ManageActivities(props) {
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <div className="main-contents container column">
            <ReactQuery query={GET_DROPDOWN}>
                <InBetween />
            </ReactQuery>
        </div>
    </SecureRoute>
}

export default ManageActivities;
