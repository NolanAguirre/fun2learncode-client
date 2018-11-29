import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import {SecureRoute} from '../common/Common'
import QueryHandler from '../queryHandler/QueryHandler'
class Registration extends Component {
  constructor (props) {
    super(props)
    this.state = { studentId: null }
    this.handleStudentChange = this.handleStudentChange.bind(this)
  }
  handleStudentChange (studentId) {
    this.setState({ studentId: studentId })
  }
  render () {
      const unauthorized = <Login history={this.props.history} redirectUrl={this.props.location.pathname} />
    return <SecureRoute unauthorized={unauthorized} roles={["FTLC_USER"]}>
        <div className='registration-container'>
          <StudentSelect click={this.handleStudentChange} user={this.props.user} />
        </div>
    </SecureRoute>

  }
}
// {(this.state.studentId)?<QueryHandler studentId={this.state.studentId}></QueryHandler>:""}

export default Registration
