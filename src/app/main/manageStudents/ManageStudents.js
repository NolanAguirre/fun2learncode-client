import React, { Component } from 'react'
import './ManageStudents.css'
import StudentSelect from '../studentSelect/StudentSelect'
import EventMonths from '../eventMonths/EventMonths'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'
class ManageStudents extends Component {
  constructor (props) {
    super(props)
    this.state = { student: null }
    this.handleStudentChange = this.handleStudentChange.bind(this)
  }
  handleStudentChange (student) {
    this.setState({ student: student })
  }
  render () {
      return <div></div> // TODO: fix this 
    // return <QueryHandler query={GET_USER_DATA} child={(data) => {
    //   if (data.getUserData.role === 'FTLC_USER') {
    //     return (<div className='manage-students-container'>
    //                     ManageStudents
    //       <StudentSelect student={this.state.student} click={this.handleStudentChange} user={data.getUserData} />
    //     </div>)
    //   } else {
    //     return (<div>please login</div>)
    //   }
    // }} />
  }
}

export default ManageStudents
