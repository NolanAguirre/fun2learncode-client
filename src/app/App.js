import React, { Component } from 'react'
import './App.css'
import NavBar from './navbar/NavBar'
import Main from './main/Main'
import Footer from './footer/Footer'
import axios from 'axios'
import UserStore from './UserStore'
import gql from 'graphql-tag'
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authToken: localStorage.getItem('authToken')
    }
    UserStore.on('authToken', (authToken) => { this.handleAuthToken(authToken) })
  }
  handleAuthToken (authToken) {
    if (authToken) {
      localStorage.setItem('authToken', authToken)
    } else {
      localStorage.removeItem('authToken')
    }
    this.setState({ authToken: authToken })
  }
  render () {
    return (<div className='app-container'>
        <div className='app-inner'>
            <NavBar />
            <Main />
          </div>
      <Footer />
    </div>)
  }
}

export default App
