import React, {Component} from 'react';
import gql from 'graphql-tag';
import { Query } from '../../Queries'
import memoize from "memoize-one";
import {DropDown} from '../common/Common';
import './ManageActivities.css';
import QueryHandler from '../queryHandler/QueryHandler';
import MutationHandler from '../queryHandler/MutationHandler';
//TODO make prerequisites work, make description text box keep text on edit, change mutations to update not refetch
const GET_ADDRESSES = gql `query tempname{
...userData
...activityCatagories
...activities
}
${Query.fragments.activityCatagories}
${Query.fragments.userData}
${Query.fragments.activities}
`
const CREATE_ACTIVITY = gql `
mutation($name:String!, $type:UUID!, $description:String!){
  createActivity(input:{activity:{name:$name,type:$type,description:$description}}){
    activity{
      name
      description
      id
      type
    }
  }
}`;

const UPDATE_ACTIVITY = gql`
mutation($id:UUID!, $patch:ActivityPatch!){
  updateActivityById(input:{id:$id, activityPatch:$patch}){
    activity{
      name
      id
      type
      description
    }
  }
}`;
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
        if (this.state.type != undefined) {
            let temp = Object.assign({}, this.state);
            delete temp.edit;
            this.setState({
                edit:false,
                type: this.props.type,
                description:this.props.description,
                name:this.props.name
            });
            if(this.props.id){
                mutation({
                    variables: {"id":this.props.id, "patch": temp}
                });
            }else{
                mutation({
                    variables: temp
                });
            }
        } else {
            alert("Please fill in Type at least");
        }
    }
render(){
    const form = <React.Fragment>
        <div className="activity-header">
            <img className="activity-image" src="https://via.placeholder.com/350x150"></img>
            <div className="activity-header-text">
                <h2 className="activity-title">
                    {(this.state.edit)?<input name="name" onChange={this.handleInputChange} value={this.state.name} /> : this.props.name}
                    {(this.state.edit)?<DropDown options={this.props.types} name="type" value={this.state.type} onChange={this.handleInputChange}/>: ""}
                </h2>
            </div>
            <div className="activity-view-events">
                {(this.state.edit)?
                    <button type="submit" className="activity-view-events-btn">Finish</button>:
                    <button type="button" onClick={(event)=>{event.preventDefault();this.setState({edit:true})}} className="activity-view-events-btn">Edit Details</button>}
            </div>
        </div>
        <div className="activity-body">
                {(this.state.edit)?
                    <div onInput={(test)=>{test.persist(); this.setState({description:test.target.textContent})}} className="manage-activity-textarea" suppressContentEditableWarning={true} contentEditable></div>:
                    this.props.description}
        </div>
        </React.Fragment>

        return(<div key={this.props.id}className="activity-container">
                  <MutationHandler refetchQueries={["tempname"]} handleMutation={this.handleSubmit} mutation={this.props.query} form={form}/>
              </div>);
    }
}
class ManageActivitiesClass extends Component {
    constructor(props) {
        super(props);
    }
    mapTypes = memoize(
        (data) =>  data.nodes.map((element) =>  {return{name: element.name, value: element.id}})
    );
    mapPrerequisites = memoize(
        (data) => data.nodes.map((element) => {return {name: element.name + " (" + element.activityCatagoryByType.name + ")",value: element.id}})
    );
    mapActivities = memoize(
        (data) => data.nodes.map((element) => {
            let temp = element.eventPrerequisitesByPrerequisite.nodes.map((el) => {return el.activityByEvent});
            return {
                name: element.name,
                type: element.activityCatagoryByType.id,
                description: element.description,
                value: element.id, // this is named value so it can be used by the dropdown box
                prerequisite: temp
            }
        })
    );
    render() {
        if(this.props.queryResult.getUserData.role === 'FTLC_INSTRUCTOR'){
            const types = this.mapTypes(this.props.queryResult.allActivityCatagories);
            const prerequisites = this.mapPrerequisites(this.props.queryResult.allActivities);
            const activities = this.mapActivities(this.props.queryResult.allActivities);
            return (
            <div className="manage-activities-container">
                <ManageActivitiesForm query={CREATE_ACTIVITY} name={"New Activity"}types={types}/>
                {activities.map((activity)=>{return <ManageActivitiesForm query={UPDATE_ACTIVITY} types={types} key={activity.value} id={activity.value} type={activity.type} description={activity.description} name={activity.name}/>})}
            </div>);
        }else{
            <div>Not authorized to view this page</div>
        }
    }
}
function ManageActivities(props) {
    return <QueryHandler query={GET_ADDRESSES}
        child={(data) => {return <ManageActivitiesClass queryResult={data} {...props}/>}} />
}
export default ManageActivities;
