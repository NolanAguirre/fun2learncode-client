import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'

import Popup from "reactjs-popup"
import {CreateAccount} from '../signUp/SignUp'
import DateTime from 'react-datetime';
import moment from 'moment'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {MultiSelect, Selectable} from '../common/Common'

const GET_STUDENTS_BY_PARENT = parentId => `{
  allStudents(condition:{parent:"${parentId}"}){
    nodes{
        parent
        nodeId
        id
        firstName
        lastName
    }
  }
}`

const CREATE_STUDENT = `mutation($student:CreateStudentInput!){
  createStudent(input:$student){
      student{
        parent
        nodeId
        id
        firstName
        lastName
    }
  }
}`

class StudentForm extends Component{
    constructor(props){
        super(props);
        this.state = {showPopup:false, dateOfBirth:moment()}
        this.mutation = new Mutation({
            mutation:CREATE_STUDENT,
            onSubmit:this.handleSubmit
        })
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

    hasRequiredValues = () =>{
        let haveValues =  this.state.firstName &&
               this.state.lastName  &&
               this.state.dateOfBirth
         return haveValues
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let student = Object.assign({}, this.state)
            delete student.error
            delete student.showPopup
            student.parent = this.props.parentId
            this.clearPopupState()
            return {student: { student }}
        }
        this.clearPopupState()
        return false
    }

    handleTimeChange = (key, value)=> {
        this.setState({[key]:value})
    }

    showPopup = () =>{
        this.setState({showPopup:true});
    }

    clearPopupState = () =>{
        this.setState({showPopup:false});
    }

    render = () => {
        return <React.Fragment>
            <Popup contentStyle={{width:"default"}}
                open={this.state.showPopup}
                closeOnDocumentClick
                onClose={this.clearPopupState}>
                <div className="login-widget">
                    <h1 className='center-text'>Add Student</h1>
                    <div className='login-error-container'>
                        <span className='login-error'>{this.state.error}</span>
                    </div>
                    <form onSubmit={this.mutation.onSubmit}className='container column'>
                            <div className='container'>
                                <div className='small-input edge-margin'>
                                    <input className='styled-input' name='firstName' onChange={this.handleChange} placeholder='first name' />
                                </div>
                                <div className='small-input edge-margin'>
                                    <input className='styled-input' name='lastName' onChange={this.handleChange} placeholder='last name' />
                                </div>
                            </div>
                            <div className='container margin-top-40'>
                                <span className='dob-label'>Date Of Birth:</span>
                                <div className='small-input edge-margin'>
                                    <DateTime onChange={(time)=>this.handleTimeChange('dateOfBirth',time)}value={this.state.dateOfBirth} inputProps={{className:'styled-input'}} dateFormat="M/D/YYYY"  timeFormat={false} viewMode='years' />
                                </div>
                            </div>
                            <div>
                                <button type='submit' className='login-form-btn'>Add student</button>
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

function StudentSelectInner(props){
    return <MultiSelect items={props.allStudents.nodes} {...props}>
        <Selectable className={{selected:'selected-student-preview-container', base: 'student-preview-container'}}>
            <StudentPreview />
         </Selectable>
    </MultiSelect>
}

function StudentSelect(props) {
    return <div className='styled-container column custom-scrollbar'>
            <h3>{(props.multiSelect)?'Select students':'Select a student'}</h3>
                <div className='students-container'>
                  <ReactQuery query={GET_STUDENTS_BY_PARENT(props.userId)}>
                      <StudentSelectInner {...props}/>
                  </ReactQuery>
                  {props.createStudent?<StudentForm client={props.client} parentId={props.userId}/>:''}
              </div>
          </div>
}

export default StudentSelect
