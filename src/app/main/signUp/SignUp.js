import React, { Component } from 'react'
import './SignUp.css'
import Logo from '../../logos/drawing.svg'
import MutationHandler from '../queryHandler/MutationHandler';
import gql from 'graphql-tag';

const CREATE_USER = gql`mutation($user:CreateUserInput!){
  createUser(input:$user){
    user{
      id
    }
  }
}`

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '', firstName:'', lastName:'', repeatPassword:''}
  }

  handleChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  hasRequiredValues = () => {
      let haveValues = this.state.email != '' &&
        this.state.password != '' &&
        this.state.repeatPassword != '' &&
        this.state.firstName != '' &&
        this.state.lastName != ''
    let passwordValid = this.state.password.match('^[a-zA-Z0-9]*$');
    let passwordMatch = this.state.password === this.state.repeatPassword;
    return haveValues && passwordValid && passwordMatch
  }

  handleSubmit = (event, mutation) => {
      event.preventDefault();
      console.log('handle submit');
      if(this.hasRequiredValues()){
          console.log('creating account');
      }
    event.preventDefault()
  }

  render () {
    return <div className='login'>
      <div className='login-container'>
        <div className='login-widget'>
          <div className='login-headers'>
            <a><img className='nav-logo' src={Logo} /></a>
          </div>
          <MutationHandler handleMutation={this.handleSubmit} mutation={CREATE_USER} className='sign-up-form'>
            <input className='sign-up-form-input' name='email' type='email' onChange={this.handleChange}placeholder='email' />
            <div className='sign-up-input-container'>
                <input className='sign-up-form-input-small' name='firstName' onChange={this.handleChange}placeholder='first name' />
                <input className='sign-up-form-input-small' name='lastName' onChange={this.handleChange}placeholder='last name' />
            </div>
            <div className='sign-up-input-container'>
                <input className='sign-up-form-input-small' name='password' type='password' onChange={this.handleChange}placeholder='password' />
                <input className='sign-up-form-input-small' name='repeatPassword' type='password' onChange={this.handleChange}placeholder='repeat password' />
            </div>
            <div>
                <button type='submit' className='login-form-btn' onClick={this.handleSubmit}>Sign Up</button>
            </div>
            </MutationHandler>
        </div>
      </div>
    </div>
  }
}
export default SignUp
