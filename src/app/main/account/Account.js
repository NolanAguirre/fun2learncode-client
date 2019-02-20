import React, { Component } from 'react'
import {OrderHistory} from '../orderHistory/OrderHistory'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, BasicPopup} from '../common/Common'
import moment from 'moment'
import PasswordReset from '../passwordReset/PasswordReset'
import './Account.css'
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
      nodeId
    }
  }
}
`


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
    customCache = (cache, data) => {
        const {
            updateUserById: {
                user:{
                    nodeId,
                    email
                }
            }
        } = data
        cache.cache.User[nodeId].email = email
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
        return this.state.email.match('^.+@.+\..+$')
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
        if(data.errors){
           this.setState({error:"Email is not valid, or is taken already."})
        }else{
           this.setState({complete:true})
        }
    }

    render = () => {
        if(this.state.complete){
            return <div className='center-y section'>
                    <div className='center-text'>Email has been changed.</div>
                </div>
        }else{
            return <form onSubmit={this.mutation.onSubmit}>
                <div className="email-input-container">
                    <div className='error'>{this.state.error}</div>
                    <input className='styled-input' name='email' type='email' onChange={this.handleChange} placeholder='email' />
                </div>
                <div className="email-input-container">
                    <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Change email</div>
                </div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
        }
    }
}

class AccountInner extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        const user = this.props.getUserData;
        return <div className="container column main-contents">
            <h2>My Account</h2>
            <div className='styled-container column'>
                <h3>Account Information</h3>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Name: </td>
                                <td>{user.firstName} {user.lastName}</td>
                            </tr>
                            <tr>
                                <td>Email: </td>
                                <td>{user.email}</td>
                                <td>
                                    <BasicPopup className="login-widget">
                                        <div className='space-around'>
                                            <h2 className='center-text no-margin'>Change email</h2>
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
                                    <BasicPopup className="login-widget">
                                        <div className='space-around'>
                                            <h2 className='center-text no-margin'>Reset Password</h2>
                                            <PasswordReset mutation={RESET_PASSWORD}/>
                                        </div>
                                        <div style={{color:'blue'}}>Change Password</div>
                                    </BasicPopup>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='styled-container column'>
                <h2>Order History</h2>
                <OrderHistory userId={this.props.getUserData.id} />
            </div>
        </div>
    }
}

function Account(props){
    return <SecureRoute roles={["FTLC_USER"]}>
        <AccountInner />
    </SecureRoute>
}

export default Account
