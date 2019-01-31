import React, {Component} from 'react';
import {SecureRoute, DropDown, EventDropDownInner} from '../common/Common'
import DateTime from 'react-datetime';
import { ReactQuery } from '../../../delv/delv-react'

const GET_DROPDOWN = `{
    allActivityCatagories {
      nodes {
        nodeId
        id
        name
      }
    }
    allActivities {
     nodes {
       id
       nodeId
       name
       activityCatagoryByType{
         name
         id
         nodeId
       }
     }
   }
}`

class CreatePromoCode extends Component{
    constructor(props){
        super(props)
        this.state={
            forCatagory:false,
            forEvent:false,
            forUser:false,
            isPercent:false,
            uses:1,
            effect:10,
            isRandom: false,
            code:"NOCODE",
            event:undefined,
            activity:undefined,
            start:new Date(),
            end:new Date()
        }
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        if(name === 'isRandom' && value === true){
            this.setState({code: Math.random().toString(36).substr(2, 9)})
        }else{
            this.setState({[name]: value});
        }
    }
    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }
    render = () => {
        const types = this.props.allActivityCatagories.nodes.map((element) =>  {return{name: element.name, value: element.id}})
        return <table>
            <tbody>
                <tr>
                    <td>For specific catagory</td>
                    <td><input value={this.state.forCatagory} name='forCatagory' onChange={this.handleChange} type='checkbox'></input></td>
                    {this.state.forCatagory?<td>Catagory: <DropDown options={types} name="activity" value={this.state.activity} onChange={this.handleChange}/></td>:<td></td>}
                </tr>
                <tr>
                    <td>For specific event</td>
                    <td><input value={this.state.forEvent} name='forEvent' onChange={this.handleChange} type='checkbox'></input></td>
                    {this.state.forEvent?<td>Event: <EventDropDownInner name='event' value={this.state.event} allActivities={this.props.allActivities} onChange={this.handleChange}/></td>:<td></td>}
                </tr>
                <tr>
                    <td>For specific user</td>
                    <td><input value={this.state.forUser} name='forUser' onChange={this.handleChange} type='checkbox'></input></td>
                    {this.state.forUser?<td>user id: <input></input></td>:<td></td>}
                </tr>
                <tr>
                    <td>Percent Reduction</td>
                    <td><input value={this.state.isPercent} name='isPercent' onChange={this.handleChange} type='checkbox'></input></td>
                    <td>Amount: <input type='number'></input> {this.state.isPercent?"% off":"$ off"}</td>
                </tr>
                <tr>
                    <td>Uses</td>
                    <td></td>
                    <td><input name='uses' onChange={this.handleChange} value={this.state.uses} type='number'></input></td>
                </tr>
                <tr>
                    <td>Start Date:</td>
                    <td></td>
                    <td><DateTime dateFormat="MMMM Do YYYY" value={this.state.start} timeFormat={false} onChange={(time) =>{this.handleTimeChange("start", time)}}/></td>
                </tr>
                <tr>
                    <td>End Date:</td>
                    <td></td>
                    <td><DateTime dateFormat="MMMM Do YYYY" value={this.state.end} timeFormat={false} onChange={(time) =>{this.handleTimeChange("end", time)}}/></td>
                </tr>
                <tr>
                    <td>Code random</td>
                    <td><input value={this.state.isRandom} name='isRandom' onChange={this.handleChange} type='checkbox'></input></td>
                </tr>
                <tr>
                    <td>Code</td>
                    <td></td>
                    <td><input value={this.state.code} name='code' onChange={this.handleChange}></input></td>
                </tr>
            </tbody>
        </table>
    }
}

class ManagePromoCodesInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeEvent: null,
            activeDateGroup: {id:null}
        }
    }

    render() {
        return <CreatePromoCode {...this.props}/>
    }
}

function ManagePromoCodes(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
            <ReactQuery query={GET_DROPDOWN}>
                <ManagePromoCodesInner />
            </ReactQuery>
        </SecureRoute>
}
export default ManagePromoCodes;
