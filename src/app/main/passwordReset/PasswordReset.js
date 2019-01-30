import React, { Component } from 'react'
import {ReactQuery} from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'

class PasswordReset extends Component{
    constructor(props){
        super(props);
        this.state = {password:'', repeatPassword:''}
        this.mutation = new Mutation({
            networkPolicy: 'network-no-cache',
            mutation:this.props.mutation,
            onSubmit:this.handleSubmit,
            onResolve:this.handleResolve
        })
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

    passwordMatch = () => {
        return this.state.password === this.state.repeatPassword;
    }

    passwordValid = () =>{
        return this.state.password.match('^[a-zA-Z0-9]*$') && this.state.password.length > 5;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.passwordMatch() && this.passwordValid()){
            return{password:this.state.password}
        }
        return false;
    }
    handleResolve = (data) => {
        if(data.errors){
           this.setState({error:"password reset failed for unknown reason."})
        }else{
           this.setState({complete:true})
        }
    }

    render = () => {
        if(this.state.complete){
            return <div className='center-y section'>
                    <div className='center-text'>Password has been changed.</div>
                </div>
        }else{
            return <div className={this.props.className}>
                <div className="margin-top-40">
                    <input className='styled-input' name='password' type='password' onChange={this.handleChange} placeholder='password' />
                </div>
                <div className="margin-top-40">
                    <input className='styled-input' name='repeatPassword' type='password' onChange={this.handleChange} placeholder='repeat password' />
                </div>
                <div className="margin-top-40">
                    <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Change</div>
                </div>
            </div>
        }
    }
}
export default PasswordReset
