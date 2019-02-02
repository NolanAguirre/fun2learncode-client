import React, { Component } from 'react'
import {ReactQuery} from '../../../delv/delv-react'
import Logo from '../../logos/drawing.svg'
import axios from 'axios'

class RecoverPassword extends Component{
    constructor(props){
        super(props);
        this.state = {email:''}
    }
    validEmail = () => {
        return this.state.email.match('^.+@.+\..+$');
    }
    handleChange = (event) => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: value,
        error:null
      })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(!this.validEmail()){
            this.setState({error:'No valid email address provided.'})
        }else{
            axios.post('http://localhost:3005/recover', {email:this.state.email}).then((res) => {
                if(res.data.error){
                    this.setState({error:'No valid email address provided.'})
                }else{
                    this.setState({complete:res.data.message})
                }
            })
        }
    }

    render = () => {
        let child;
        if(this.state.complete){
            child = <div className='center-y section'>{this.state.complete}</div>
        }else{
            child = <React.Fragment>
            <div>
              <h3 className='center-text'>Forgot your password?</h3>
              <div className='center-text gray'>
                  You can reset it by entering your account email and clicking "Reset Password".
              </div>
            </div>
            <div className='center-y section'>
              <div className='error'>{this.state.error}</div>
              <input className='styled-input' name='email' type='email' onChange={this.handleChange} placeholder='email' />
            </div>
            <div className='event-register-btn center-text' onClick={this.handleSubmit}>Reset Password</div>
            </React.Fragment>
        }
        return <div className='container section'>
            <div className='login-container'>
              <div className='login-widget'>
                  <div className='login-headers'>
                        <a><img className='nav-logo' src={Logo}/></a>
                  </div>
                  {child}
              </div>
            </div>
        </div>
    }
}

export default RecoverPassword
