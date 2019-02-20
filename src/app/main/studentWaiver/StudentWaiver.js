import React, {Component} from 'react'
import './StudentWaiver.css'
import Mutation from '../../../delv/Mutation'

const CREATE_STUDENT_WAIVER = `mutation ($studentWaiver: StudentWaiverInput!) {
  createStudentWaiver(input: {studentWaiver: $studentWaiver}) {
    studentWaiver {
      nodeId
      id
      createdOn
      studentByStudent {
        nodeId
        id
      }
    }
  }
}`

function StudentWaiver(props){
    return <div className='student-waiver-container'>
            <h2 className='center-text'>Student Waiver</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Primary care name:</td>
                        <td>{props.primaryCare}</td>
                    </tr>
                    <tr>
                        <td>Primary care phone:</td>
                        <td>{props.primaryCarePhone}</td>
                    </tr>
                    <tr>
                        <td>Emergency phone:</td>
                        <td>{props.emergencyPhone}</td>
                    </tr>
                    <tr>
                        <td>Pickup one:</td>
                        <td>{props.pickupOne}</td>
                    </tr>
                    <tr>
                        <td>Pickup two:</td>
                        <td>{props.pickupTwo}</td>
                    </tr>
                    <tr>
                        <td>Created on:</td>
                        <td>{props.createdOn}</td>
                    </tr>
                </tbody>
            </table>
            Allergies/Other information:
            {props.other}
        </div>
}

export { StudentWaiver }

class StudentWaiverForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            primaryCare: '',
            primaryCarePhone:'',
            emergencyPhone:'',
            pickupOne:'',
            pickupTwo:'',
            other:''
        }
        this.mutation = new Mutation({
            mutation: CREATE_STUDENT_WAIVER,
            onSubmit: this.handleSubmit
        })
    }

    hasRequiredValues = () =>{
        let haveValues =  (this.state.pickupOne ||
               this.state.pickupTwo)&&
               this.state.primaryCare &&
               this.state.emergencyPhone.length === 14 &&
               this.state.primaryCarePhone.length === 14
         return haveValues
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            return {studentWaiver:{...this.state, student:this.props.studentId}}
        }
        this.clearPopupState()
        return false
    }

    formatNumber = (n) => {
        let formatted = ''
        n = n.replace(/[^0-9]+/g, '')
        if(n.length >= 7){
            return`(${n.substring(0, 3)})-${n.substring(3, 6)}-${n.substring(6,10)}`
        }else if (n.length >= 3){
            return`(${n.substring(0, 3)})-${n.substring(3, 6)}`
        }else if(n.length > 0){
            return`(${n.substring(0, 3)}`
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        if(name.endsWith('Phone')){
            this.setState({[name]:this.formatNumber(value)})
            return
        }
        this.setState({[name]: value});
    }

    handleTextAreaChange = (event) => {
        event.persist();
        this.setState({other:event.target.textContent})
    }

    render = () => {
        return <form className='student-waiver-container' onSubmit={this.mutation.onSubmit}>
                <h2 className='center-text'>Student Waiver</h2>
                Primary care name:
                <input className='styled-input' name='primaryCare' onChange={this.handleChange} />
                Primary care phone:
                <input className='styled-input' value={this.state.primaryCarePhone} name='primaryCarePhone' onChange={this.handleChange} />
                Emergency phone:
                <input className='styled-input' value={this.state.emergencyPhone} name='emergencyPhone' onChange={this.handleChange} />
                Allowed pickup name one:
                <input className='styled-input' name='pickupOne' onChange={this.handleChange} />
                Allowed pickup name two:
                <input className='styled-input' name='pickupTwo' onChange={this.handleChange} />
                Allergies/Other information:
                <div id='new' onInput={this.handleTextAreaChange} className="styled-textarea" style={{minHeight:'80px'}} suppressContentEditableWarning={true} contentEditable></div>
                <div className='styled-button margin-top-10' onClick={this.mutation.onSubmit}>Finish waiver</div>
            </form>
    }
}


export {StudentWaiverForm}
