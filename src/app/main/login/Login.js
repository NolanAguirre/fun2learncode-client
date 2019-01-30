import React, {Component} from 'react'
import './Login.css'
import {Link} from 'react-router-dom'
import Logo from '../../logos/drawing.svg'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }

    validEmail = () => {
        return this.state.email.match('^.+@.+\..+$');
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, error:null})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if(!this.validEmail()){
            this.setState({error:"No valid email address provided."})
        }else if(this.state.password === ''){
            this.setState({error:"No password provided."})
        }else{
            axios.post('http://localhost:3005/authenticate', {
                email: this.state.email,
                password: this.state.password
            }).then((res) => {
                if (res.data.error) {
                    this.setState({error:res.data.error})
                } else {
                    window.location.reload()
                    this.props.history.push(this.props.redirectUrl || '/')
                }
            })
        }

    }

    render = () => {
        let child = "";
        if(this.state.error){
            if(this.state.error === 'Email or Password was incorrect'){
                child = <React.Fragment>
                        <span className='login-error'>Incorrect email or password.</span>
                        <Link to={`/recover`}>Forgot password?</Link>
                    </React.Fragment>
            }else{
                child = <span className='login-error'>{this.state.error}</span>
            }
        }
        return (<div className='container section'>
            <div className='login-container'>
                <div className='login-widget'>
                    <div className='login-headers'>
                        <a><img src={Logo}/></a>
                    </div>
                    <div className='login-error-container'>
                        {child}
                    </div>
                    <form onSubmit={this.handleSubmit} className='login-form'>
                        <input className='styled-input' placeholder='email' name='email' type='email' onChange={this.handleChange}/>
                        <input className='styled-input' placeholder='password' name='password' type='password' onChange={this.handleChange}/>
                        <div className='event-register-btn center-text' onClick={this.handleSubmit}>Log In</div>
                        <button className='hacky-submit-button' type='submit'/>
                    </form>
                    <div className='sign-up-text'>
                        <Link to={`/Sign up`}>Sign up</Link>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default Login
