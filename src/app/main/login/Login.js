import React, {Component} from 'react'
import './Login.css'
import {Link} from 'react-router-dom'
import Logo from '../../logos/drawing.svg'
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {email: '', password: ''}
    }
    componentDidMount = () => {
        this.mounted = true
        this.loading = false
    }
    componentWillUnmount = () => this.mounted = false

    validEmail = () =>  this.state.email.match(/^.+@.+\..+$/)

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, error:null})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if(this.loading) return;
        if(!this.validEmail()){
            this.setState({error:'No valid email address provided.'})
        }else if(!this.state.password || (this.state.password && this.state.password.length < 6)){
            this.setState({error:'No valid password provided.'})
        }else{
            this.loading = true
            axios.post('http://localhost:3005/authenticate', {
                email: this.state.email,
                password: this.state.password
            }).then((res) => {
                if(!this.mounted) return;
                this.loading = false
                if (res.data.error) {
                    this.setState({error:res.data.error})
                } else {
                    window.location.href = this.props.redirectUrl || '/'
                }
            })
        }
    }

    render = () => {
        let child = <div className='error'>{this.state.error}</div>
        if(this.state.error === 'Email or Password was incorrect.'){
            child = <React.Fragment>
                <div className='error'>Incorrect email or password. <Link to={'/recover'}>Forgot password?</Link></div>
            </React.Fragment>
        }
        return <div className='login-container'>
            <div className='login-headers'>
                <a><img src={Logo}/></a>
            </div>
            {child}
            <form onSubmit={this.handleSubmit} className='login-form'>
                <input className='styled-input' placeholder='email' name='email' type='email' onChange={this.handleChange}/>
                <input className='styled-input' placeholder='password' name='password' type='password' onChange={this.handleChange}/>
                <div className='styled-button center-text' onClick={this.handleSubmit}>Log In</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
            <Link to={'/sign-up'}>Sign up</Link>
        </div>
    }
}
export default Login
