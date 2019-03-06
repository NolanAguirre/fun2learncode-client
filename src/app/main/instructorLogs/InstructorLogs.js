import React, {Component} from 'react';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView} from '../common/Common'
import moment from 'moment';
import './InstructorLogs.css'
const GET_INSTRUCTOR_LOGS = `{
  allEventLogs(condition:{instructor:null}){
    nodes{
      id
      instructor
      comment
      dateIntervalByDateInterval{
          id
          start
      }
      eventByEvent{
        id
        activityByActivity{
          id
          name
        }
      }
      studentByStudent{
        id
        firstName
        lastName
      }
    }
  }
}`

const CREATE_LOG = `mutation ($eventLog: EventLogInput!) {
  createEventLog(input: {eventLog:$eventLog}) {
    eventLog {
      id
      event
      student
      comment
      eventByEvent {
        id
      }
      userByInstructor {
        id
      }
      dateIntervalByDateInterval {
        id
      }
      studentByStudent{
        id
      }
    }
  }
}`
const localize = (timestamp) =>{
    return moment(moment.utc(timestamp)).local()
}

class InstructorLogForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            event: props.eventId,
            dateInterval: props.dateId,
            student:props.studentId,
            instructor: props.instructorId,
            comment:''
        }
        this.mutation = new Mutation({
            mutation:CREATE_LOG,
            onSubmit:this.handleSubmit,
            onResolve: this.resetState
        })
    }
    componentWillUnmount = () => this.mutation.removeListeners()
    handleInputChange = event => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({[name]: value})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.comment){
            return {eventLog:this.state}
        }
        return false;
    }
    resetState = () => {
        this.setState({event: this.props.eventId,
        dateInterval: this.props.dateId,
        student:this.props.studentId,
        instructor: this.props.instructorId,
        comment:''})
    }


    render = () => {
        return <form className="instructor-logs" onSubmit={this.mutation.onSubmit}>
                <textarea name='comment' value={this.state.comment} onChange={this.handleInputChange} className='activity-description-textarea'/>
                <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Write Log</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
    }
}

export default InstructorLogForm
