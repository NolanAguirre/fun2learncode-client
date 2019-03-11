import React, {Component} from 'react'
import './StudentWaiver.css'
import Mutation from '../../../delv/Mutation'

const CREATE_STUDENT_WAIVER = `mutation ($studentWaiver: StudentWaiverInput!) {
  createStudentWaiver(input: {studentWaiver: $studentWaiver}) {
    studentWaiver {
      id
      createdOn
      studentByStudent {
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
            onSubmit: this.handleSubmit,
            onResolve: this.handleResolve
        })
    }

    componentWillUnmount = () => {
        this.mutation.removeListeners()
    }

    hasRequiredValues = () =>{
        let haveValues = (this.state.pickupOne ||
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
        return false
    }

    formatNumber = (event) => {
        const target = event.target;
        const name = target.name;
        let value = target.value.replace(/[^0-9]+/g, '')
        if(value.length >= 7){
            value = `(${value.substring(0, 3)})-${value.substring(3, 6)}-${value.substring(6,10)}`
        }else if (value.length >= 3){
            value = `(${value.substring(0, 3)})-${value.substring(3, 6)}`
        }else if(value.length > 0){
            value = `(${value.substring(0, 3)}`
        }
        this.setState({[name]: value});
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleResolve = () => {
        this.setState({complete:true})
    }

    render = () => {
        if(this.state.complete){
            return <div className='student-waiver-container'>
                    <h2 className='center-text'>Student Waiver created</h2>
            </div>
        }
        return <form className='student-waiver-container' onSubmit={this.mutation.onSubmit}>
                <h2 className='center-text'>Student Waiver</h2>
                Primary care name:
                <input className='styled-input' name='primaryCare' onChange={this.handleChange} />
                Primary care phone:
                <input className='styled-input' value={this.state.primaryCarePhone} name='primaryCarePhone' onChange={this.handleChange} onBlur={this.formatNumber}/>
                Emergency phone:
                <input className='styled-input' value={this.state.emergencyPhone} name='emergencyPhone' onChange={this.handleChange} onBlur={this.formatNumber}/>
                Allowed pickup name one:
                <input className='styled-input' name='pickupOne' onChange={this.handleChange} />
                Allowed pickup name two:
                <input className='styled-input' name='pickupTwo' onChange={this.handleChange} />
                Allergies/Other information:
                <textarea className='student-waiver-other' name='other' valu={this.state.other} onChange={this.handleChange} placeholder='Please include who to ask for if the emergency phone is an office number.'/>
                <div className='styled-button margin-top-10' onClick={this.mutation.onSubmit}>Finish waiver</div>
            </form>
    }
}


export {StudentWaiverForm}
