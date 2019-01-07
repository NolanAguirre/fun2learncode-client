import React, {Component} from 'react'
import axios from 'axios'
class Logout extends Component {
  componentDidMount () {
    axios.post('http://localhost:3005/logout').then((res)=>{
        window.location.reload()
        window.location.href = '/Home'
    })
  }
  render () {
    return (<div>Logging Out</div>)
  }
}

export default Logout
