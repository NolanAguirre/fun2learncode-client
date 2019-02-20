import React, {Component} from 'react';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView} from '../common/Common'
import moment from 'moment';

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
        this.id = Math.random().toString(36).substr(2, 9)
        this.mutation = new Mutation({
            mutation:CREATE_LOG,
            onSubmit:this.handleSubmit,
            onResolve: this.resetState
        })
    }
    componentWillUnmount = () => {
        this.mutation.removeListeners()
    }
    handleDescriptionChange = (event) => {
        event.persist();
        this.setState({comment:event.target.textContent})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        //!window.confirm('Do you want to write a log with no comment?')
        if(this.state.comment && this.state.comment != ''){
            return {eventLog:this.state}
        }
        return false;
    }
    resetState = () => {
        setTimeout(()=>document.getElementById(`${this.id}`).innerHTML = '', 0);
        this.setState({event: this.props.eventId,
        dateInterval: this.props.dateId,
        student:this.props.studentId,
        instructor: this.props.instructorId,
        comment:''})
    }

    render = () => {
        return <div className="column section">
            <form onSubmit={this.mutation.onSubmit}>
                <div id={this.id} onInput={this.handleDescriptionChange} className="styled-textarea" suppressContentEditableWarning={true} contentEditable></div>
                <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Write Log</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
        </div>
    }
}

export default InstructorLogForm
