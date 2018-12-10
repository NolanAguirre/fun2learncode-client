import React, { Component } from 'react'
import './Login.css'
import axios from 'axios'
import UserStore from '../../UserStore'
import Logo from '../../logos/drawing.svg'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '' }
  }
  handleChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  handleSubmit = (event) => { // dont want to handle loading state, use axios
    axios.post('http://localhost:3005/graphql', { query: `{
          authenticate(arg0:"${this.state.email}", password:"${this.state.password}")
        }` }).then((res) => {
      if (res.data.data.authenticate) {
        UserStore.set('authToken', res.data.data.authenticate)
        window.location.reload()
        this.props.history.push(this.props.redirectUrl || '/')
    }else{
        this.setState({errors:true})
    }
    })
    event.preventDefault()
  }

  render () {
    return (<div className='login'>
      <div className='login-container'>
        <div className='login-widget'>
          <div className='login-headers'>
            <a><img className='nav-logo' src={Logo} /></a>
          </div>
          <div className='login-error-container'>
             {(this.state.errors)?<React.Fragment><span className='login-error'>Incorrect email or password.</span> <a href='/'>Forgot password?</a></React.Fragment>:""}
          </div>
          <form onSubmit={this.handleSubmit} className='login-form'>
            <input name='email' type='email' onChange={this.handleChange}placeholder='email' />
            <input name='password' type='password' onChange={this.handleChange}placeholder='password' />
            <button className='login-form-btn' onClick={this.handleSubmit}>Log In</button>
          </form>
          <div className='sign-up-text'>
              <a href="/Sign up" >Sign up</a>
          </div>
        </div>
      </div>
    </div>)
  }
}
export default Login
