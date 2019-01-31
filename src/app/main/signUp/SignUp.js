import React, { Component } from 'react'
import './SignUp.css'
import Logo from '../../logos/drawing.svg'
import gql from 'graphql-tag';
import axios from 'axios'
import Popup from "reactjs-popup"

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
           repeatPassword:'',
           showPopup:false
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

    handleSubmit = async (event) => {
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
                        window.location.reload()
                    }
                })
            }
        }
    }

    showPopup = (total) => {
        this.setState({showPopup: true});
    }

    clearPopupState = () => {
        this.setState({showPopup: false});
    }


    render () {
      return<React.Fragment>
          <div className='login-error-container'>
              <span className='login-error'>{this.state.error}</span>
          </div>
          <form className='container column'>
            <input className='styled-input' name='email' type='email' onChange={this.handleChange} placeholder='email' />
            <div className="container margin-top-40">
                <div className='small-input edge-margin'>
                    <input className='styled-input' name='firstName' onChange={this.handleChange} placeholder='first name' />
                </div>
                <div className='small-input edge-margin'>
                    <input className='styled-input' name='lastName' onChange={this.handleChange} placeholder='last name' />
                </div>
            </div>
            <div className="margin-top-40">
                <input className='styled-input' name='password' type='password' onChange={this.handleChange} placeholder='password' />
            </div>
            <div className="margin-top-40">
                <input className='styled-input' name='repeatPassword' type='password' onChange={this.handleChange} placeholder='repeat password' />
            </div>
            <div>
                <button type='submit' className='login-form-btn' onClick={this.handleSubmit}>Create Account</button>
            </div>
            <div>
                By creating this account you agree to our <span onClick={this.showPopup}>terms of service</span>.
            </div>
        </form>
        <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
            <div className='terms-of-service-container'>
                <h1 className='center-text'>Terms of service</h1>
                <div>
                    Uh so, I'm not a lawyer or anything, so I'm going to give you the TL;DR version of some terms of service.
                </div>
                <div>
                    <h4>Your Information</h4>
                    We require accounts to be created for one reason, to automate the sign-in/sign-up process. We encourage accounts for many other reasons, but its up to you to use those features.
                    The information we collect is for internal use only, such as where to offer classes next, and will not be sold. We collect: first name, last name, email, and information collected
                    in the transaction step such as cardholder name and the billing address information. However, we do not store, or even touch sensitive credit card information, all transactions are
                    handled through Stripe. For students we collect first name, last name, date of birth, and allergies. All the information is secure above industry standards (we use cookies,
                    not local storage),but we are not liable if this information is to be compromised.
                </div>
                <div>
                    <h4>Signing up for events</h4>
                    We have prerequesites to some of our camps that are coded into the site, if you feel you student should be allowed in a higher level class then contact the owner and ask. However
                    age, and typing speed cannot be enforced on this website (it's easy to lie). If you sign up a student who does not meet the per-event requirement (listed in the event description),
                    the student could be denied access into that camp without a refund. An example is a 5 year old signing up for a minecraft modding camp, it just won't work out.
                </div>
                <div>
                    <h4>Refunds</h4>
                    Ask for a refund, they are handled on a per case basis. Generally if the event is 2 weeks away you may recieve a full refund, minus any auto-generated promo codes used from the
                    refunded event. Within two weeks of cancling there is a 20$ fee for cancling, unless the spot is able to be filled. Within one week of the event is very case by case.
                </div>
                <div>
                    <h4>Attending camps</h4>
                     I give permission for my child to attend Fun 2 Learn Code and to fully participate in all Fun 2 Learn Code programs and activities. I understand that accidents and injuries may
                     occur during participation in such activities, and that every reasonable effort will be made to provide reasonable care by the Fun 2 Learn Code staff.<br/>

                     I give permission for medical attention to be administered to my child by the Fun 2 Learn Code staff in the event of a medical emergency. When I cannot be contacted, I hereby
                     give my consent to have my child transported to a hospital emergency room and the hospital and medical staff have my authorization to provide any treatment, at my expense, that
                     a physician deems necessary for the well-being of my child.<br/>

                     I waive and release Fun 2 Learn Code and its trustees, officers, teachers, employees, volunteers, agents and assigns from and against any and all present and future claims, costs,
                     liabilities, expenses, or judgments, including attorneys fees and court costs, resulting from any damage, loss, personal injury or illness to my child and/or damage to my child’s
                     property arising from or out of my child’s attendance or enrollment in, or out of my child’s participation in activities at or offered
                     by, Fun 2 Learn Code.<br/>

                     We reserve the right to remove a disruptive student from the class.
                </div>
                <div>
                    <h4>Other</h4>
                    You cannot delete your account once it has been created, we need it for record keeping, but no one can see your information besides admins/owners at fun 2 learn code.<br/>

                    We cannot merge accounts, so dont make two, just recover your password.<br/>

                    We cannot delete students after they have signed up for a class, even if it is refunded, its still a part of record keeping.<br/>

                    Events go live at midnight CST, if you are registering for events at midnight, please refresh and validate that the information is still what you expect.<br/>

                    We email you recipts to your account email, news letters will be an optional and can be a different email.<br/>
                </div>
            </div>
        </Popup>
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
    return <div className='container section'>
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
