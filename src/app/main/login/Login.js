import React, {Component} from 'react'
import './Login.css'
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

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
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

    render() {
        return (<div className='container section'>
            <div className='login-container'>
                <div className='login-widget'>
                    <div className='login-headers'>
                        <a><img className='nav-logo' src={Logo}/></a>
                    </div>
                    <div className='login-error-container'>
                        {
                            (this.state.error)
                                ? <React.Fragment>
                                        <span className='login-error'>Incorrect email or password.</span>
                                        <a href='/'>Forgot password?</a>
                                    </React.Fragment>
                                : ""
                        }
                    </div>
                    <form onSubmit={this.handleSubmit} className='login-form'>
                        <input className='styled-input' placeholder='email' name='email' type='email' onChange={this.handleChange}/>
                        <input className='styled-input' placeholder='password' name='password' type='password' onChange={this.handleChange}/>
                        <div className='event-register-btn center-text' onClick={this.handleSubmit}>Log In</div>
                    </form>
                    <div className='sign-up-text'>
                        <a href="/Sign up">Sign up</a>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default Login
