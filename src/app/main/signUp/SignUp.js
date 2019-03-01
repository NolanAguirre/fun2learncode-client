import React, { Component } from 'react'
import './SignUp.css'
import Logo from '../../logos/drawing.svg'
import Delv from '../../../delv/delv'
import axios from 'axios'
import Popup from 'reactjs-popup'

const CREATE_ACCOUNT = `mutation ($user: RegisterUserInput!) {
  registerUser(input: $user) {
    clientMutationId
  }
}`

const CHECK_EMAIL = (email) => `{
  checkEmail(email: "${email}")
}`

function TermsAndConditions(){ //TODO finish this
    return <div className='terms-of-service-container'>
        <h1 className='center-text'>Terms of service</h1>
        <div>
            Uh so, I'm not a lawyer or anything, so I'm going to give you the TLDR version of some terms of service.
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

    uniqueEmail = () => axios.post('http://localhost:3005/graphql', {query:CHECK_EMAIL(this.state.email)}).then((res)=>res.data.data.checkEmail)

    hasRequiredValues = () => this.state.email && this.state.password && this.state.repeatPassword &&this.state.firstName && this.state.lastName

    showPopup = () => this.setState({showPopup: true})

    clearPopupState = () => this.setState({showPopup: false})

    handleServerErrors = (serverErrors) => {
        let errors = ''
        serverErrors.forEach(error=>{
            if(error.message === 'duplicate key value violates unique constraint "users_email_key"'){
                errors += 'The email give is already registered to an account. \n'
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
                }
                this.setState({error:'The email give is already registered to an account.'})
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
            <form onSubmit={this.handleSubmit}>
                <input className='styled-input' name='email' type='email' onChange={this.handleChange} placeholder='email' />
                <div className="container margin-top-40">
                    <div className='small-input edge-margin'>
                        <input className='styled-input' name='firstName' onChange={this.handleChange} placeholder='first name' />
                    </div>
                    <div className='small-input edge-margin'>
                        <input className='styled-input' name='lastName' onChange={this.handleChange} placeholder='last name' />
                    </div>
                </div>
                <input className='styled-input margin-top-40' name='password' type='password' onChange={this.handleChange} placeholder='password' />
                <input className='styled-input margin-top-40' name='repeatPassword' type='password' onChange={this.handleChange} placeholder='repeat password' />
                <div className='event-register-btn center-text margin-top-40' onClick={this.handleSubmit}>Sign Up</div>
                <button className='hacky-submit-button' type='submit'/>
                By creating this account you agree to our <span onClick={this.showPopup}>terms of service</span>.
            </form>
            <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <TermsAndConditions />
            </Popup>
        </div>
    }
}
export  {SignUp}
