import React, {Component} from 'react'
import Logo from '../../logos/x-icon.svg'
import './PrerequisiteForm.css'
import Mutation from '../../../delv/Mutation'
import {DropDown} from '../common/Common'

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

function Prerequisites(props){
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

export {Prerequisites}

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

export {PrerequisiteForm}
