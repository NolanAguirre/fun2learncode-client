import React, {
  Component
} from 'react'
import './Logout.css'
import UserStore from '../../UserStore'
class ManageStudents extends Component {
  componentDidMount () {
    localStorage.removeItem('authToken')
    window.location.reload()
    window.location.href = '/Home'
  }
  render () {
    return (<div>Logging Out</div>)
  }
}

export default ManageStudents
