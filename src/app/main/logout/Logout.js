import React, {Component} from 'react'
import axios from 'axios'
import Delv from '../../../delv/delv'
class Logout extends Component {
    componentDidMount () {
        axios.post('http://localhost:3005/logout').then(()=>{
            Delv.clearCache()
            window.location.href = '/'
        })
    }
    render () {
        return <div>Logging Out</div>
    }
}

export default Logout
