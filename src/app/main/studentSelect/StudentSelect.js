import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'
import {StudentWaiverForm} from '../studentWaiver/StudentWaiver'
import Popup from "reactjs-popup"
import {CreateAccount} from '../signUp/SignUp'
import DateTime from 'react-datetime';
import moment from 'moment'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {MultiSelect, Selectable} from '../common/Common'

const yearAgo = moment().subtract(1,'years').toISOString()

const GET_STUDENTS_BY_PARENT = parentId => `{
  allStudents(condition: {parent: "${parentId}"}) {
    nodes {
      nodeId
      parent
      id
      firstName
      lastName
      studentWaiversByStudent(filter:{createdOn:{greaterThan:"${yearAgo}"}}){
        nodes {
          id
          createdOn
        }
      }
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
function toProperCaps(string) {
    try{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }catch(error){
        return string
    }
}
class StudentForm extends Component{
    constructor(props){
        super(props);
        this.state = {showPopup:false, dateOfBirth:moment(), firstName:'', lastName:''}
        this.mutation = new Mutation({
            mutation:CREATE_STUDENT,
            onSubmit:this.handleSubmit,
            onResolve:this.onResolve
        })
    }

    handleChange = (event) => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: toProperCaps(value),
        error:undefined
        })
    }

    hasRequiredValues = () =>{
        let haveValues =  this.state.firstName !== '' &&
               this.state.lastName !== '' &&
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

    onResolve = () => {
        this.setState({dateOfBirth:moment()})
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
                        <div className='login-error'>{this.state.error}</div>
                    </div>
                    <form onSubmit={this.mutation.onSubmit} className='space-around'>
                            <div className='container'>
                                <div className='small-input edge-margin'>
                                    <input className='styled-input' name='firstName' value={this.state.firstName} onChange={this.handleChange} placeholder='first name' />
                                </div>
                                <div className='small-input edge-margin'>
                                    <input className='styled-input' name='lastName' value={this.state.lastName} onChange={this.handleChange} placeholder='last name' />
                                </div>
                            </div>
                            <div className='container margin-top-40'>
                                <span className='dob-label'>Date Of Birth:</span>
                                <div className='small-input edge-margin'>
                                    <DateTime onChange={(time)=>this.handleTimeChange('dateOfBirth',time)}value={this.state.dateOfBirth} inputProps={{className:'styled-input'}} dateFormat="M/D/YYYY"  timeFormat={false} viewMode='years' />
                                </div>
                            </div>
                            <div>
                                <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Add student</div>
                                <button className='hacky-submit-button' type='submit'/>
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

class StudentWaiverDisplay extends Component{
    constructor(props){
        super(props)
        this.state = {showPopup:false}
    }
    showPopup = (id) => {
        this.setState({showPopup:true, studentId:id});
    }
    clearPopupState = () =>{
        this.setState({showPopup:false});
    }

    render = () => {
        let attentionNeeded = false;
        const children = this.props.allStudents.nodes.map((student)=>{
            const waiver = student.studentWaiversByStudent.nodes[0];
            if(waiver){
                return <div key={student.nodeId} className='waiver-found'>{student.firstName} {student.lastName}</div>
            }
            attentionNeeded = true;
            return <div key={student.nodeId} onClick={()=>{this.showPopup(student.id)}} className='waiver-needed'>{student.firstName} {student.lastName}</div>
        })
        return <div>
            <Popup className='payment-overview-popup'open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <StudentWaiverForm studentId={this.state.studentId}/>
            </Popup>
            <h3 className='no-margin'>Waivers</h3>
            {attentionNeeded?<div className='error'>Attention Needed!</div>:''}
            {children}
        </div>
    }
}

function StudentSelectInner(props){
    return <div className='student-select-inner'>
        <div className='students-container'>
            <MultiSelect items={props.allStudents.nodes} {...props}>
                <Selectable className={{selected:'selected-student-preview-container', base: 'student-preview-container'}}>
                    <StudentPreview />
                 </Selectable>
            </MultiSelect>
            {props.children}
         </div>
        <StudentWaiverDisplay allStudents={props.allStudents} />
    </div>
}

function StudentSelect(props) {
    return <div className='styled-container column custom-scrollbar'>
            <h3>{(props.multiSelect)?'Select students':'Select a student'}</h3>
                <ReactQuery query={GET_STUDENTS_BY_PARENT(props.userId)} skipLoading>
                    <StudentSelectInner {...props}>
                        {props.createStudent?<StudentForm client={props.client} parentId={props.userId}/>:''}
                    </StudentSelectInner>
                </ReactQuery>
          </div>
}

export default StudentSelect
