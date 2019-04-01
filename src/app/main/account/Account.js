import React, { Component } from 'react'
import {OrderHistory} from '../orderHistory/OrderHistory'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, BasicPopup} from '../common/Common'
import moment from 'moment'
import PasswordReset from '../passwordReset/PasswordReset'
import './Account.css'
import EventRequest from '../eventRequest/EventRequest'
import xicon from '../../logos/x-icon.svg'
const RESET_PASSWORD = `mutation($password:String!){
  resetPassword(input:{arg0:$password,arg1:"BY USER"}){
    clientMutationId
  }
}`
const UPDATE_EMAIl = (id) => `mutation ($email: String!) {
  updateUserById(input: {userPatch: {email: $email}, id: "${id}"}) {
    user {
      email
      id
    }
  }
}`


class UpdateEmail extends Component{
    constructor(props){
        super(props);
        this.state = {email:''}
        this.mutation = new Mutation({
            mutation:this.props.mutation,
            onSubmit:this.handleSubmit,
            onResolve:this.handleResolve,
            customCache: this.customCache
        })
    }
    componentWillUnmount = () => this.mutation.removeListeners()
    customCache = (cache, data) => {
        const {
            updateUserById: {
                user:{
                    id,
                    email
                }
            }
        } = data
        cache.cache.User[id].email = email
        cache.emitter.changeType('User')
        cache.emitter.emitCacheUpdate()
    }
    handleChange = (event) => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: value,
        error:undefined
      })
    }

    validEmail = () => {
        return this.state.email.match(/^.+@.+\..+$/)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.error){
            return false
        }
        if(!this.validEmail()){
            this.setState({error:'Email is not valid.'})
            return false
        }
        if(this.state.email.toUpperCase() === this.props.email.toUpperCase()){
            this.setState({error:'Email is already set to provided email.'})
            return false
        }
        return {email:this.state.email}
    }

    handleResolve = (data) => {
        if(!data.updateUserById){
           this.setState({error:"Email is not valid, or is taken already."})
        }else{
           this.setState({complete:true})
        }
    }

    render = () => {
        if(this.state.complete){
            return <div className="login-form">
                    <div className='center-text'>Email has been changed.</div>
                </div>
        }else{
            return <form onSubmit={this.mutation.onSubmit} className="login-form">
                <div />
                <div>
                    <div className='error'>{this.state.error}</div>
                    <input className='styled-input' name='email' type='email' onChange={this.handleChange} placeholder='email' />
                </div>
                <div className='styled-button center-text' onClick={this.mutation.onSubmit}>Change email</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
        }
    }
}

function AccountInner(props){
    const user = props.getUserData;
    return <div className="account main-contents">
        <h2 className='account-header'>My Account</h2>
        <div className='account-info-container'>
            <div className='account-info-section'>
                <h3>Account Information</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Name: </td>
                            <td>{user.firstName} {user.lastName}</td>
                        </tr>
                        <tr>
                            <td>Email: </td>
                            <td>{user.email}</td>
                    </tr>
                        <tr>
                            <td></td>
                            <td>
                                <BasicPopup className='popup'>
                                    <div className="login-container">
                                        <h2 className='center-text'>Change email</h2>
                                        <UpdateEmail email={user.email} mutation={UPDATE_EMAIl(user.id)}/>
                                    </div>
                                    <div style={{color:'blue'}}>Change email</div>
                                </BasicPopup>
                            </td>
                        </tr>
                        <tr>
                            <td>Memeber since: </td>
                            <td>{moment(user.createdOn).format('MMM, Do YYYY')}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <BasicPopup className='popup'>
                                    <div className="login-container">
                                        <h2 className='center-text'>Reset Password</h2>
                                        <PasswordReset mutation={RESET_PASSWORD}/>
                                    </div>
                                    <div style={{color:'blue'}}>Change Password</div>
                                </BasicPopup>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                    //TODO make form for managing credit cards
            </div>
        </div>
        <div className='account-order-history-container'>
            <h2>Order History</h2>
            <OrderHistory userId={user.id} />
        </div>
        <div className='private-event'>
            <div className='account-event-request-section'>
                <h2 className='center-text'>Request private event</h2>
                <EventRequest userId={user.id}/>
            </div>
            <div className='private-event-footer'>
                This feature is intended for birthday parties and similar events, to request a public event email info@fun2learncode.com
            </div>
        </div>
    </div>
}

function Account(props){
    return <SecureRoute roles={["FTLC_USER"]}>
        <AccountInner />
    </SecureRoute>
}

export default Account
