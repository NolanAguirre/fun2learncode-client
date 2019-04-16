import React, { Component } from 'react'
import './SignUp.css'
import Logo from '../../logos/drawing.svg'
import Delv from '../../../delv/delv'
import axios from 'axios'
import Popup from 'reactjs-popup'
import xicon from '../../logos/x-icon.svg'
const CREATE_ACCOUNT = `mutation ($user: RegisterUserInput!) {
  registerUser(input: $user) {
    user{
      id
    }
  }
}`

const CHECK_EMAIL = (email) => `{
  checkEmail(email: "${email}")
}`

function TermsAndConditions(){ //TODO finish this
    return <div className='terms-of-service-container'>
        <h1 className='center-text'>Terms of service</h1>
        TODO MAKE THIS
    </div>
}

const toProperCaps = (string) => {
    try{
        return string.charAt(0).toUpperCase() + string.slice(1)
    }catch(error){
        return string
    }
}

class SignUp extends Component {
    constructor (props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            firstName:'',
            lastName:'',
            repeatPassword:'',
            showPopup:false
        }
    }

    componentWillUnmount = () => {
        this.handleServerErrors = null
    }

    handleChange = (event) => {
        const target = event.target
        const name = target.name
        const value = (target.name === 'firstName' || target.name === 'lastName')?toProperCaps(target.value):target.value
        this.setState({
            [name]: value,
            error:undefined
        })
    }

    passwordMatch = () => this.state.password === this.state.repeatPassword

    passwordValid = () =>  this.state.password.length > 5 && this.state.password.length < 72

    validEmail = () =>  this.state.email.match(/^.+@.+\..+$/)

    uniqueEmail = () => axios.post('http://localhost:3005/graphql', {query:CHECK_EMAIL(this.state.email)}).then((res)=>!res.data.data.checkEmail)

    hasRequiredValues = () => this.state.email && this.state.password && this.state.repeatPassword &&this.state.firstName && this.state.lastName

    showPopup = () => this.setState({showPopup: true})

    clearPopupState = () => this.setState({showPopup: false})

    handleServerErrors = (serverErrors) => {
        let errors = ''
        serverErrors.forEach(error=>{
            if(error.message === 'duplicate key value violates unique constraint "users_email_key"'){
                errors += 'The email given is not available. \n'
                return
            }
            if(error.message === 'new row for relation "users" violates check constraint "users_email_check"'){
                errors += 'The email give is not valid. \n'
                return
            }
            if(error.message === 'new row for relation "users" violates check constraint "users_first_name_check"'){
                errors += 'No first name provided. \n'
                return
            }
            if(error.message === 'new row for relation "users" violates check constraint "users_last_name_check"'){
                errors += 'No last name provided. \n'
                return
            }
            if(error.message === 'new row for relation "users" violates check constraint "users_last_name_check"'){
                errors += 'No last name provided. \n'
                return
            }
            if(error.message === 'Password must be between 6 and 72 characters.'){
                errors += 'Password must be between 6 and 72 characters.'
                return
            }
            if(error.message === 'No password was provided.'){
                errors += 'No password was provided. \n'
                return
            }
            errors += 'An Unknown error occured while attemping to make your account \n'
        })
        if(errors){
            this.setState({error:errors})
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        if(this.hasRequiredValues()){
            if(!this.validEmail()){
                this.setState({error:'The email give is not valid.'})
            }else if(!this.passwordValid()){
                this.setState({error:'Password must be between 5 and 72 characters'})
            }else if(!this.passwordMatch()){
                this.setState({error:'The passwords to not match.'})
            }else {
                let uniqueEmail = await this.uniqueEmail()
                if(uniqueEmail){
                    let user = Object.assign({}, this.state)
                    delete user.repeatPassword
                    delete user.error
                    delete user.showPopup
                    axios.post('http://localhost:3005/graphql', { query: CREATE_ACCOUNT,variables:{user}}).then((res) => {
                        if(res.data.errors){
                            this.handleServerErrors(res.data.errors)
                        }else{
                            Delv.clearCache()
                            window.location.href = '/Login'
                        }
                    })
                }else{
                    this.setState({error:'The email give is already registered to an account.'})
                }
            }
        }else{
            this.setState({error:'Please fill out all fields.'})
        }
    }

    render = () => {
        return <div className='login-container'>
            <div className='login-headers'>
                <a><img src={Logo} /></a>
            </div>
            <div className='error'>{this.state.error}</div>
            <form className='sign-up-form'onSubmit={this.handleSubmit}>
                <input className='styled-input' name='email' type='email' onChange={this.handleChange} value={this.state.email} placeholder='email' />
                <div className="container">
                    <div className='small-input edge-margin'>
                        <input className='styled-input' name='firstName' onChange={this.handleChange} value={this.state.firstName} placeholder='first name' />
                    </div>
                    <div className='small-input edge-margin'>
                        <input className='styled-input' name='lastName' onChange={this.handleChange} value={this.state.lastName} placeholder='last name' />
                    </div>
                </div>
                <input className='styled-input' name='password' type='password' onChange={this.handleChange} value={this.state.password} placeholder='password' />
                <input className='styled-input' name='repeatPassword' type='password' onChange={this.handleChange} value={this.state.repeatPassword} placeholder='repeat password' />
                <div>
                    <div className='styled-button center-text' onClick={this.handleSubmit}>Sign Up</div>
                    <button className='hacky-submit-button' type='submit'/>
                    By creating this account you agree to our <span onClick={this.showPopup}>terms of service</span>.
                </div>
            </form>
            <Popup className='popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
            <div className='popup-inner'>
                <div className='close-popup'>
                    <img onClick={this.clearPopupState} src={xicon}/>
                </div>
                <TermsAndConditions />
            </div>
            </Popup>
        </div>
    }
}
export  {SignUp}
