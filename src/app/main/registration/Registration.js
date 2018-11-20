import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
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
    if (this.props.user) {
      return (
        <div className='registration-container'>
          <StudentSelect click={this.handleStudentChange} user={this.props.user} />
          {JSON.stringify(this.props.event)}
        </div>)
    } else {
      return (<Login history={this.props.history} redirectUrl={this.props.location.pathname} />)
    }
  }
}
// {(this.state.studentId)?<QueryHandler studentId={this.state.studentId}></QueryHandler>:""}

export default Registration
