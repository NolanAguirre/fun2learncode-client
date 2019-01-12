import React, { Component } from 'react'
import './SignUp.css'
import Logo from '../../logos/drawing.svg'
import gql from 'graphql-tag';
import axios from 'axios'
import UserStore from '../../UserStore'

function IAm(props){
    return <div className='i-am-container'>
        <h4>I am a... </h4>
        <div className='i-am-btn-container'>
            <div className='i-am-btn' onClick={()=>{props.setUI('studentDOB')}}>Student</div>
            <div className='i-am-btn' onClick={()=>{props.setUI('createAccount')}}>Parent</div>
        </div>
    </div>
}

function StudentDOB(props){
    return <div>
        <div>
            Please have your parent create your account for you. <br />
            If you plan to enroll yourself, create an account as a parent and follow the steps for adding students. Add yourself as a student to enroll
        </div>
        <div onClick={()=>{props.setUI('iAm')}}>back</div>
    </div>
}

class CreateAccount extends Component{
    constructor (props) {
      super(props)
      this.state = {
           email: '',
           password: '',
           firstName:'',
           lastName:'',
           repeatPassword:''
          }
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

    setStateValue = (key, value) =>{
        this.setState({[key]:value})
    }

    passwordMatch = () => {
        return this.state.password === this.state.repeatPassword;
    }

    passwordValid = () =>{
        return this.state.password.match('^[a-zA-Z0-9]*$') && this.state.password.length > 5;
    }

    validEmail = () => {
        return this.state.email.match('^.+@.+\..+$');
    }

    uniqueEmail = () => {
          return axios.post('http://localhost:3005/graphql', { query: `{
              checkEmail(email:"${this.state.email}")
          }`}).then((res) => {
              return !res.data.data.checkEmail;
          })
        }

    hasRequiredValues = () => {
        let haveValues = this.state.email != '' &&
          this.state.password != '' &&
          this.state.repeatPassword != '' &&
          this.state.firstName != '' &&
          this.state.lastName != ''

      return haveValues;
    }

    handleServerErrors = (erros) => {
        let errors = ''
        for(var index in errors){
            const error = errors[index];
            if(error.message === `duplicate key value violates unique constraint "users_email_key"`){
                errors += `The email give is already registered to an account. \n`
                continue
            }
            if(error.message === `new row for relation "users" violates check constraint "users_email_check"`){
                errors += `The email give is not valid. \n`
                continue
            }
            if(error.message === `new row for relation "users" violates check constraint "users_first_name_check"`){
                errors += `No first name provided. \n`
                continue
            }
            if(error.message === `new row for relation "users" violates check constraint "users_last_name_check"`){
                errors += `No last name provided. \n`
                continue
            }
            if(error.message === `new row for relation "users" violates check constraint "users_last_name_check"`){
                errors += `No last name provided. \n`
                continue
            }
            if(error.message === 'No password was provided.'){
                errors += `No password was provided. \n`
                continue
            }
            errors += `An Unknown error occured while attemping to make your account \n`

        }
        this.setState({error:errors})
    }

    handleSubmit = async (event) => { // dont want a loading state, custom handling of errors where no error state is displayed, used axios
        event.preventDefault()
        if(this.hasRequiredValues()){
            let uniqueEmail = await this.uniqueEmail();
            if(!this.passwordValid()){
                this.setState({error:'Password must be longer than 5 characters'})
            }else if(!this.passwordMatch()){
                this.setState({error:'The passwords to not match'})
            }else if(!this.validEmail()){
                this.setState({error:'The email give is not valid'})
            }else if(!uniqueEmail){
                this.setState({error:'The email give is already registered to an account'})
            }else {
                let user = Object.assign({}, this.state);
                delete user.repeatPassword
                delete user.error
                axios.post('http://localhost:3005/graphql', { query: `mutation($user:RegisterUserInput!) {
                  registerUser(input:$user){
                      query{
                          authenticate(arg0:"${this.state.email}", password:"${this.state.password}")
                      }
                  }
                }`,variables:{user}}).then((res) => {
                    if(res.data.errors){
                        this.handleServerErrors(res.data.errors);
                    }else{
                        UserStore.set('authToken', res.data.data.registerUser.query.authenticate)
                        window.location.reload()
                    }
                })
            }
        }
    }

    render () {
      return<React.Fragment>
          <div className='login-error-container'>
              <span className='login-error'>{this.state.error}</span>
          </div>
          <form className='sign-up-form'>
            <input className='sign-up-form-input' name='email' type='email' onChange={this.handleChange} placeholder='email' />
            <div className='sign-up-input-container'>
                <input className='sign-up-form-input-small edge-margin' name='firstName' onChange={this.handleChange} placeholder='first name' />
                <input className='sign-up-form-input-small edge-margin' name='lastName' onChange={this.handleChange} placeholder='last name' />
            </div>
            <div className='sign-up-input-container'>
                <input className='sign-up-form-input-small edge-margin' name='password' type='password' onChange={this.handleChange} placeholder='password' />
                <input className='sign-up-form-input-small edge-margin' name='repeatPassword' type='password' onChange={this.handleChange} placeholder='repeat password' />
            </div>
            {this.props.children?React.cloneElement(this.props.children, {handleChange:this.handleChange}):''}
            <div>
                <button type='submit' className='login-form-btn' onClick={this.handleSubmit}>Create Account</button>
            </div>
            <div>
                By creating this account you agree to our terms of service.
            </div>
        </form>
    </React.Fragment>
    }
}

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {UI:'iAm'};
  }

  setUIValue = (value) =>{
      this.setState({'UI':value})
  }


  render () {
      let inner;
      if(this.state.UI === 'iAm'){
          inner = <IAm setUI={this.setUIValue}/>
      }else if(this.state.UI === 'studentDOB'){
          inner = <StudentDOB setUI={this.setUIValue}/>
      }else if(this.state.UI === 'createAccount'){
          inner = <CreateAccount setUI={this.setUIValue}/>
      }
    return <div className='login'>
      <div className='login-container'>
          <div className='login-widget'>
                <div className='login-headers'>
                  <a><img className='nav-logo' src={Logo} /></a>
                </div>
                {inner}
         </div>
      </div>
    </div>
  }
}
export  {SignUp, CreateAccount}
