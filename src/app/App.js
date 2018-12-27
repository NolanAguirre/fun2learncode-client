import React, { Component } from 'react'
import './App.css'
import NavBar from './navbar/NavBar'
import Main from './main/Main'
import Footer from './footer/Footer'
class App extends Component {
  constructor (props) {
    super(props)
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
