import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'
import {StudentWaiverForm} from '../studentWaiver/StudentWaiver'
import Popup from "reactjs-popup"
import DateTime from 'react-datetime';
import moment from 'moment'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {MultiSelect, Selectable, RoutePoup} from '../common/Common'

const yearAgo = moment().subtract(1,'years').toISOString()

const GET_STUDENTS_BY_PARENT = parentId => `{
  allStudents(condition: {parent: "${parentId}"}) {
    nodes {
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
        this.state = { dateOfBirth:moment(), firstName:'', lastName:''}
        this.mutation = new Mutation({
            mutation:CREATE_STUDENT,
            onSubmit:this.handleSubmit,
            onResolve:this.onResolve
        })
    }

    componentWillUnmount = () => this.mutation.removeListeners()

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
        let haveValues =  this.state.firstName &&
               this.state.lastName &&
               this.state.dateOfBirth
         return haveValues
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let student = Object.assign({}, this.state)
            delete student.error
            delete student.showPopup
            return {student: { student }}
        }
        return false
    }

    onResolve = () => {
        this.props.popup.close()
    }

    handleTimeChange = (key, value)=> {
        this.setState({[key]:value})
    }

    render = () => {
        return <div className="login-container">
            <h1 className='center-text'>Add Student</h1>
            <div className='error'>{this.state.error}</div>
            <form onSubmit={this.mutation.onSubmit} className='login-form'>
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
                        <div className='styled-button center-text' onClick={this.mutation.onSubmit}>Add student</div>
                        <button className='hacky-submit-button' type='submit'/>
                    </div>
            </form>
        </div>
    }

}

function StudentWaiverDisplay(props){
    let attentionNeeded = false;
    const children = props.allStudents.nodes.map((student)=>{
        const waiver = student.studentWaiversByStudent.nodes[0];
        if(waiver){
            return <div key={student.id} className='waiver-found'>{student.firstName} {student.lastName}</div>
        }
        attentionNeeded = true;
        return <div key={student.id} onClick={()=>{props.popup.open(<StudentWaiverForm studentId={student.id}/>)}} className='waiver-needed'>{student.firstName} {student.lastName}</div>
    })
    return <div className='student-waiver-display'>
        <h3 className='student-waiver-header'>Waivers</h3>
        {attentionNeeded?<div className='error'>Attention Needed!</div>:''}
        <div className='stuednt-waiver-status-container'>
            {children}
        </div>
    </div>
}

function StudentSelectInner(props){
    const newStudentPopup = () => {props.popup.open(<StudentForm client={props.client} parentId={props.userId} popup={props.popup}/>)}
    return <div className='student-select-inner'>
        <div className='student-select-left'>
            <h3 className='student-select-header'>{(props.multiSelect)?'Select students':'Select a student'}</h3>
            <div className='students-container'>
                <MultiSelect items={props.allStudents.nodes} {...props}>
                    <Selectable className={{selected:'selected-student-preview-container', base: 'student-preview-container'}}>
                        <StudentPreview />
                     </Selectable>
                </MultiSelect>
                {props.createStudent?<StudentPreview className='student-preview-container'item={{firstName:'new',lastName:'Student'}} onClick={newStudentPopup}/>:''}
             </div>
         </div>
        {props.hideWaivers?'':<StudentWaiverDisplay allStudents={props.allStudents} popup={props.popup}/>}
    </div>
}

function StudentSelect(props) {
    return <div className='styled-container custom-scrollbar'>
                <ReactQuery query={GET_STUDENTS_BY_PARENT(props.userId)}>
                    <StudentSelectInner {...props} />
                </ReactQuery>
          </div>
}

export default StudentSelect
