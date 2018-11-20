import React, { Component } from 'react'
import './Login.css'
import axios from 'axios'
import UserStore from '../../UserStore'
import Logo from '../../logos/drawing.svg'
class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { email: '', password: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  handleSubmit (event) {
    axios.post('http://localhost:3005/graphql', { query: `mutation{
          authenticate(input:{arg0:"${this.state.email}"password:"${this.state.password}"}){
        		jwtToken
          }
        }` }).then((res) => {
      if (res.data.data.authenticate.jwtToken) {
        UserStore.set('authToken', res.data.data.authenticate.jwtToken)
        window.location.reload()
        this.props.history.push(this.props.redirectUrl || '/')
      }
      // TODO handle failed login
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
          <form onSubmit={this.handleSubmit} className='login-form'>
            <input name='email' type='email' onChange={this.handleChange}placeholder='email' />
            <input name='password' type='password' onChange={this.handleChange}placeholder='password' />
            <button onClick={this.handleSubmit}>Sign In</button>
          </form>
        </div>
      </div>
    </div>)
  }
}
export default Login
