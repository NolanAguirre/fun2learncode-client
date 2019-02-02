import React, {Component} from 'react';
import {SecureRoute, DropDown, EventDropDownInner, ArchiveOptions, GridView} from '../common/Common'
import DateTime from 'react-datetime';
import { ReactQuery } from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'
import moment from 'moment'
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

const GET_PROMO_CODES =  (archive) =>`{
  allPromoCodes (condition:{${archive}}){
    nodes {
      id
      nodeId
      code
      effect
      uses
      code
      userByUserId {
        nodeId
        id
        firstName
        lastName
      }
      activityCatagoryByCatagory {
        nodeId
        id
        name
      }
      activityByActivity {
        nodeId
        id
        name
      }
      forUser
      forActivity
      forCatagory
      percent
      archive
      disabled
    }
  }
}`

const CREATE_PROMO_CODE = `mutation($promoCode:PromoCodeInput!){
  createPromoCode(input:{promoCode:$promoCode}){
    promoCode{
      nodeId
      id
      code
      uses
    }
  }
}`

class CreatePromoCode extends Component{
    constructor(props){
        super(props)
        this.state={
            forCatagory:false,
            forActivity:false,
            forUser:false,
            percent:false,
            uses:1,
            effect:10,
            isRandom: false,
            code:"NOCODE",
            event:undefined,
            catagory:undefined,
            userId:'',
            validStart:moment().subtract(1, 'days'),
            validEnd:moment().add(1, 'months')
        }
        this.mutation = new Mutation({
            mutation:CREATE_PROMO_CODE,
            onSubmit:this.handleSubmit,
            onResolve: this.resetState
        })
    }
    resetState = () =>{
        this.setState({
            forCatagory:false,
            forActivity:false,
            forUser:false,
            percent:false,
            uses:1,
            effect:10,
            isRandom: false,
            code:"NOCODE",
            activity:undefined,
            catagory:undefined,
            userId:'',
            validStart:moment().subtract(1, 'days'),
            validEnd:moment().add(1, 'months')
        })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        if(name === 'isRandom' && value === true){
            this.setState({code: Math.random().toString(36).substr(2, 9), error:null})
        }else{
            this.setState({[name]: value, error:undefined});
        }
    }
    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }

    hasRequiredValues = () => {
        let forCatagory = !this.state.forCatagory || this.state.catagory
        let forActivity = !this.state.forActivity || this.state.activity
        let forUser = !this.state.forUser || this.state.userId != ''
        let values = this.state.code != 'NOCODE' && this.state.uses > 0 && this.state.effect > 0
        return forCatagory && forActivity && forUser && values
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let {
                isRandom,
                error,
                userId,
                catagory,
                activity,
                ...promoCode
            } = this.state
            if(this.state.forUser){
                promoCode = {...promoCode, userId}
            }
            if(this.state.forActivity){
                promoCode = {...promoCode, activity}
            }
            if(this.state.forCatagory){
                promoCode= {...promoCode, activity}
            }
            return {promoCode}
        }
        this.setState({error:'Some required data is missing.'})
        return false;

    }
    render = () => {
        const types = this.props.allActivityCatagories.nodes.map((element) =>  {return{name: element.name, value: element.id}})
        return <form onSubmit={this.mutation.onSubmit}>
            <table>
                <tbody>
                    <tr>
                        <td>For specific catagory</td>
                        <td><input checked={this.state.forCatagory} name='forCatagory' onChange={this.handleChange} type='checkbox'></input></td>
                        {this.state.forCatagory?<td>Catagory: <DropDown options={types} name="catagory" value={this.state.catagory} onChange={this.handleChange}/></td>:<td></td>}
                    </tr>
                    <tr>
                        <td>For specific activity</td>
                        <td><input checked={this.state.forActivity} name='forActivity' onChange={this.handleChange} type='checkbox'></input></td>
                        {this.state.forActivity?<td>Activity: <EventDropDownInner name='activity' value={this.state.activity} allActivities={this.props.allActivities} onChange={this.handleChange}/></td>:<td></td>}
                    </tr>
                    <tr>
                        <td>For specific user</td>
                        <td><input checked={this.state.forUser} name='forUser' onChange={this.handleChange} type='checkbox'></input></td>
                        {this.state.forUser?<td>user id: <input value={this.state.userId} name='userId' onChange={this.handleChange}></input></td>:<td></td>}
                    </tr>
                    <tr>
                        <td>Percent Reduction</td>
                        <td><input checked={this.state.percent} name='percent' onChange={this.handleChange} type='checkbox'></input></td>
                        <td>Amount: <input type='number'></input> {this.state.percent?"% off":"$ off"}</td>
                    </tr>
                    <tr>
                        <td>Uses</td>
                        <td></td>
                        <td><input name='uses' onChange={this.handleChange} value={this.state.uses} type='number'></input></td>
                    </tr>
                    <tr>
                        <td>Start Date:</td>
                        <td></td>
                        <td><DateTime dateFormat="MMMM Do YYYY" value={this.state.validStart} timeFormat={false} onChange={(time) =>{this.handleTimeChange("validStart", time)}}/></td>
                    </tr>
                    <tr>
                        <td>End Date:</td>
                        <td></td>
                        <td><DateTime dateFormat="MMMM Do YYYY" value={this.state.validEnd} timeFormat={false} onChange={(time) =>{this.handleTimeChange("validEnd", time)}}/></td>
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
            <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Create</div>
            <button className='hacky-submit-button' type='submit'/>
        </form>
    }
}

class DisablePromoCode extends Component{
    constructor(props){
        super(props);
        this.state = {
            archive:this.props.archive,
            disabled: this.props.disabled
        }
    }
    render = () => {
        return <div>
            <table>
                <tbody>
                    <tr>
                        <td>Code</td>
                        <td>{this.props.code}</td>
                    </tr>
                    <tr>
                        <td>uses left:</td>
                        <td>{this.props.uses}</td>
                    </tr>
                    <tr>
                        <td>effect</td>
                        <td>{this.props.effect}{this.props.percent?'%':'$'} off</td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
}
function ViewPromoCodes(props){
    return <GridView itemsPerRow={5}>
        {props.allPromoCodes.nodes.map(promoCode=><DisablePromoCode key={promoCode.nodeId}{...promoCode}/>)}
    </GridView>
}

class ManagePromoCodesInner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <React.Fragment>
            <CreatePromoCode {...this.props}/>
            <ArchiveOptions query={GET_PROMO_CODES}>
                <ReactQuery>
                    <ViewPromoCodes />
                </ReactQuery>
            </ArchiveOptions>
        </React.Fragment>
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
