import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'

import Popup from "reactjs-popup"
import {CreateAccount} from '../signUp/SignUp'
import DateTime from 'react-datetime';
import moment from 'moment'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'

const GET_STUDENTS_BY_PARENT =  `{
  allStudents(condition:{parent:"3025bed9-fa08-4753-87c2-2a9e2fdb3efd"}){
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
                    <form onSubmit={this.mutation.onSubmit}className='sign-up-form'>
                            <div className='sign-up-input-container'>
                                <input className='sign-up-form-input-small' name='firstName' onChange={this.handleChange} placeholder='first name' />
                                <input className='sign-up-form-input-small' name='lastName' onChange={this.handleChange} placeholder='last name' />
                            </div>
                            <div className='sign-up-input-container'>
                                <span className='dob-label'>Date Of Birth:</span>
                                <DateTime onChange={(time)=>this.handleTimeChange('dateOfBirth',time)}value={this.state.dateOfBirth} inputProps={{className:'sign-up-form-input-small'}} dateFormat="M/D/YYYY"  timeFormat={false} viewMode='years' />
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

class StudentSelectInner extends Component {
    constructor(props){
        super(props)
        console.log(props.queryResult)
        this.state = {selectedStudents:[]}
    }

    toggleStudent = async (newStudent) =>{ // if props selected students returns false or nothing it updates
        if(!this.props.isValidStudent || await this.props.isValidStudent(newStudent)){
            if(this.state.selectedStudents.includes(newStudent)){
                const newSelectedStudents = this.state.selectedStudents.filter((student)=>{return student.id!=newStudent.id})
                if(this.props.multiSelect){
                    this.props.setSelectedStudents(newSelectedStudents)
                }else{
                    this.props.setSelectedStudents(null)
                }
                this.setState({selectedStudents:newSelectedStudents})
            }else{
                if(this.props.multiSelect){
                    this.props.setSelectedStudents([...this.state.selectedStudents, newStudent])
                    this.setState({selectedStudents:[...this.state.selectedStudents, newStudent]})
                }else{
                    this.props.setSelectedStudents(newStudent)
                    this.setState({selectedStudents:[newStudent]})
                }
            }
        }
    }

    render(){
      return this.props.queryResult.allStudents.nodes.map((element) => {
        const selected = this.state.selectedStudents.includes(element);
        return <StudentPreview key={element.id} selected={selected} onClick={this.toggleStudent} student={element} />
      })
    }
}

function StudentSelect(props) {
    return <div className='student-select-container'>
            <h3>{(props.multiSelect)?'Select students':'Select a student'}</h3>
          <div className='students-container'>
            <ReactQuery query={GET_STUDENTS_BY_PARENT}>
                    <StudentSelectInner {...props}/>
            </ReactQuery>
            <StudentForm client={props.client} parentId={props.user.id}/>
        </div>
  </div>
}

export default StudentSelect
