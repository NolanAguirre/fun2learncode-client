import React, {Component} from 'react';
import {SecureRoute, DropDown, EventDropDownInner, ArchiveOptions, GridView} from '../common/Common'
import DateTime from 'react-datetime';
import { ReactQuery } from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'
import moment from 'moment'
import './ManagePromoCodes.css'
const GET_DROPDOWN = `{
  allCategories {
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
      categoryByCategory {
        name
        id
        nodeId
      }
    }
  }
}`

const GET_PROMO_CODES =  (archive) =>`{
  allPromoCodes (condition:{${archive}}) {
    nodes {
      id
      nodeId
      code
      effect
      uses
      code
      validStart
      validEnd
      userByUserId {
        nodeId
        id
        firstName
        lastName
      }
      categoryByCategory {
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
      forCategory
      percent
      archive
      disabled
    }
  }
}`

const CREATE_PROMO_CODE = `mutation($promoCode:PromoCodeInput!){
  createPromoCode(input:{promoCode:$promoCode}){
    promoCode{
      id
      nodeId
      code
      effect
      uses
      code
      validStart
      validEnd
      userByUserId {
        nodeId
      }
      categoryByCategory {
        nodeId
      }
      activityByActivity {
        nodeId
      }
      forUser
      forActivity
      forCategory
      percent
      archive
      disabled
    }
  }
}`

const UPDATE_PROMO_CODE = `mutation($archive:Boolean, $disable:Boolean, $id:UUID!){
  updatePromoCodeById(input:{promoCodePatch:{archive:$archive,disabled:$disable},id:$id}){
    promoCode{
      nodeId
      archive
      disabled
      userByUserId {
        nodeId
      }
      categoryByCategory {
        nodeId
      }
      activityByActivity {
        nodeId
      }
    }
  }
}`

class CreatePromoCode extends Component{
    constructor(props){
        super(props)
        this.state={
            forCategory:false,
            forActivity:false,
            forUser:false,
            percent:false,
            uses:1,
            effect:10,
            isRandom: false,
            code:"NOCODE",
            event:undefined,
            category:undefined,
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
            forCategory:false,
            forActivity:false,
            forUser:false,
            percent:false,
            uses:1,
            effect:10,
            isRandom: false,
            code:"NOCODE",
            activity:undefined,
            category:undefined,
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
        let forCategory = !this.state.forCategory || this.state.category
        let forActivity = !this.state.forActivity || this.state.activity
        let forUser = !this.state.forUser || this.state.userId != ''
        let values = this.state.code != 'NOCODE' && this.state.uses > 0 && this.state.effect > 0
        return forCategory && forActivity && forUser && values
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let {
                isRandom,
                error,
                userId,
                category,
                activity,
                ...promoCode
            } = this.state
            if(this.state.forUser){
                promoCode = {...promoCode, userId}
            }
            if(this.state.forActivity){
                promoCode = {...promoCode, activity}
            }
            if(this.state.forCategory){
                promoCode= {...promoCode, activity}
            }
            return {promoCode}
        }
        this.setState({error:'Some required data is missing.'})
        return false;

    }
    render = () => {
        const types = this.props.allCategories.nodes.map((element) =>  {return{name: element.name, value: element.id}})
        return <form className='styled-container column' onSubmit={this.mutation.onSubmit}>
            <div className='section container center-x'>
                <div className='promo-form-column'>
                    <div>For category <input checked={this.state.forCategory} name='forCategory' onChange={this.handleChange} type='checkbox'/>{this.state.forCategory?<DropDown options={types} name="category" value={this.state.category} onChange={this.handleChange}/>:''}</div>
                    <div>For activity <input checked={this.state.forActivity} name='forActivity' onChange={this.handleChange} type='checkbox'/>{this.state.forActivity?<EventDropDownInner name='activity' value={this.state.activity} allActivities={this.props.allActivities} onChange={this.handleChange}/>:''}</div>
                    <div>For user <input checked={this.state.forUser} name='forUser' onChange={this.handleChange} type='checkbox'/>{this.state.forUser?<React.Fragment>id: <input value={this.state.userId} name='userId' onChange={this.handleChange}/></React.Fragment>:''}</div>
                    <div>Percent Reduction <input checked={this.state.percent} name='percent' onChange={this.handleChange} type='checkbox'/></div>
                    <div>Amount: <input value={this.state.effect} name='effect' type='number' onChange={this.handleChange} style={{width:'30px'}}/> {this.state.percent?"% off":"$ off"}</div>
                </div>
                <div className='promo-form-column'>
                    <div className='container'>Start Date: <DateTime style={{width:'150px'}} dateFormat="MMMM Do YYYY" value={this.state.validStart} timeFormat={false} onChange={(time) =>{this.handleTimeChange("validStart", time)}}/></div>
                    <div className='container'>End Date: <DateTime className='tiny-input' dateFormat="MMMM Do YYYY" value={this.state.validEnd} timeFormat={false} onChange={(time) =>{this.handleTimeChange("validEnd", time)}}/></div>
                    <div>Code random <input value={this.state.isRandom} name='isRandom' onChange={this.handleChange} type='checkbox'/></div>
                    <div>Code <input value={this.state.code} name='code' onChange={this.handleChange} style={{width:'100px'}}/></div>
                    <div>Uses <input name='uses' onChange={this.handleChange} value={this.state.uses} type='number' style={{width:'30px'}}/></div>
                </div>
            </div>
            <div className='event-register-btn center-text center-x' style={{width:'200px'}}onClick={this.mutation.onSubmit}>Create</div>
            <button className='hacky-submit-button' type='submit'/>
        </form>
    }
}

class DisablePromoCode extends Component{
    constructor(props){
        super(props);
        this.state = {
            archive:this.props.archive,
            disabled:this.props.disabled
        }
        this.mutation = new Mutation({
            mutation:UPDATE_PROMO_CODE,
            onSubmit:this.handleSubmit
        })
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    hasRequiredValues = () =>{
        return this.state.archive != this.props.archive ||
            this.state.disabled != this.props.disabled
    }
    handleSubmit = (event) => {
        event.preventDefault()
        if(this.hasRequiredValues()){
            return {...this.state, id:this.props.id}
        }
        return false;
    }
    getFor = () => {
        if(this.props.forCategory){
            return this.props.categoryByCategory.name
        }else if(this.props.forActivity){
            return this.props.activityByActivity.name
        }else if(this.props.forUser){
            const user = this.props.userByUserId
            return `${user.firstName} ${user.lastName}`
        }
        return 'All'
    }
    render = () => {
        return <form className='grid-item-container'>
            <table>
                <tbody>
                    <tr>
                        <td>Code:</td>
                        <td>{this.props.code}</td>
                    </tr>
                    <tr>
                        <td>uses left:</td>
                        <td>{this.props.uses}</td>
                    </tr>
                    <tr>
                        <td>effect:</td>
                        <td>{this.props.effect}{this.props.percent?'%':'$'} off</td>
                    </tr>
                    <tr>
                        <td>For:</td>
                        <td>{this.getFor()}</td>
                    </tr>
                    <tr>
                        <td>Start:</td>
                        <td>{moment(this.props.validStart).format('MMM Do YYYY')}</td>
                    </tr>
                    <tr>
                        <td>End:</td>
                        <td>{moment(this.props.validEnd).format('MMM Do YYYY')}</td>
                    </tr>
                    <tr>
                        <td>Archive:</td>
                        <td><input checked={this.state.archive} name='archive' onChange={this.handleChange} type='checkbox'/></td>
                    </tr>
                    <tr>
                        <td>Disable:</td>
                        <td><input checked={this.state.disabled} name='disabled' onChange={this.handleChange} type='checkbox'/></td>
                    </tr>
                </tbody>
            </table>
            <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>update</div>
            <button className='hacky-submit-button' type='submit'/>
        </form>
    }
}

function ViewPromoCodes(props){
    return <GridView itemsPerRow={4}>
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
        <div className='main-contents container column'>
            <ReactQuery query={GET_DROPDOWN}>
                    <ManagePromoCodesInner />
            </ReactQuery>
        </div>
        </SecureRoute>
}
export default ManagePromoCodes;
