import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'
import Popup from "reactjs-popup"
import {CreateAccount} from '../signUp/SignUp'
import DateTime from 'react-datetime';

const GET_STUDENTS_BY_PARENT = (parentId) => {
    return gql `{
  allStudents(condition: {parent: "${parentId}"}) {
    nodes {
      nodeId
      id
      userByStudent {
        nodeId
        id
        firstName
        lastName
      }
    }
  }
}`}


class StudentForm extends Component{
    constructor(props){
        super(props);
        this.state = {showPopup:false}
    }

    handleChange = (event) => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: value,
        error:undefined
      })
    }

    showPopup = () =>{
        this.setState({showPopup:true});
    }

    clearPopupState = () =>{
        this.setState({showPopup:false});
    }

    render = () => {
        return <React.Fragment>
            <Popup
                 contentStyle={{width:"default"}}
                open={this.state.showPopup}
                closeOnDocumentClick
                onClose={this.clearPopupState}>
                <div className="create-student-container">
                    <h1>Add Student</h1>
                    <div className='login-error-container'>
                        <span className='login-error'>{this.state.error}</span>
                    </div>
                    <form className='sign-up-form'>
                      <div className='sign-up-input-container'>
                          <input className='sign-up-form-input-small' name='firstName' onChange={this.handleChange} placeholder='first name' />
                          <input className='sign-up-form-input-small' name='lastName' onChange={this.handleChange} placeholder='last name' />
                      </div>
                      <div className='sign-up-input-container'>
                          <span className='dob-label'>Date Of Birth:</span>
                          <DateTime inputProps={{className:'sign-up-form-input-small'}} dateFormat="M/D/YYYY"  timeFormat={false} viewMode='years' />
                      </div>
                      <div>
                          <button type='submit' className='login-form-btn' onClick={this.handleSubmit}>Add student</button>
                      </div>
                  </form>
            </div>
            </Popup>
        <div onClick={this.showPopup} className='student-preview-container'>

            new Student
        </div>
    </React.Fragment>
    }

}

class StudentSelectInner extends Component {
    constructor(props){
        super(props)
        this.state = {students:props.queryResult.allStudents, selectedStudents:[]}
    }

    toggleStudent = async (newStudent) =>{ // if props selected students returns false or nothing it updates
        if(!this.props.isValidStudent || await this.props.isValidStudent(newStudent)){
            if(this.state.selectedStudents.includes(newStudent)){
                const newSelectedStudents = this.state.selectedStudents.filter((student)=>{return student.id!=newStudent.id})
                this.props.setSelectedStudents(newSelectedStudents)
                this.setState({selectedStudents:newSelectedStudents})
            }else{
                if(this.props.multiSelect){
                    this.props.setSelectedStudents([...this.state.selectedStudents, newStudent])
                    this.setState({selectedStudents:[...this.state.selectedStudents, newStudent]})
                }else{
                    this.props.setSelectedStudents(newStudent)
                    this.setState({selectedStudents:[newStudent], students:this.props.queryResult.allStudents})
                }
            }
        }
    }
    render(){
      return this.state.students.nodes.map((element) => {
        const selected = this.state.selectedStudents.includes(element.userByStudent);
        return <StudentPreview key={element.userByStudent.id} selected={selected} onClick={this.toggleStudent} student={element.userByStudent} />
      })
    }
}

function StudentSelect(props) {
    return <div className='student-select-container'>
            <h3>Select A Student</h3>
          <div className='students-container'>
            <QueryHandler query={GET_STUDENTS_BY_PARENT(props.user.id)}>
                    <StudentSelectInner {...props}/>
            </QueryHandler>
            <StudentForm />
        </div>
  </div>
}

export default StudentSelect
