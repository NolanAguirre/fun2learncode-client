import React, {Component} from 'react';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView} from '../common/Common'
import moment from 'moment';

const GET_INSTRUCTOR_LOGS = `{
  allEventLogs(condition:{instructor:null}){
    nodes{
      nodeId
      id
      instructor
      comment
      dateIntervalByDateInterval{
          nodeId
          id
          start
      }
      dateGroupByDateGroup{
        nodeId
        id
        eventByEvent{
          nodeId
          id
          activityByEventType{
            nodeId
            id
            name
          }
        }
      }
      studentByStudent{
        nodeId
        id
        firstName
        lastName
      }
    }
  }
}`

const UPDATE_INSTRUCTOR_LOG = `mutation($eventLog:UpdateEventLogByIdInput!){
  updateEventLogById(input:$eventLog){
    eventLog{
      nodeId
      id
      instructor
      comment
      dateGroupByDateGroup{
        nodeId
        id
      }
      userByInstructor{
        nodeId
        id
      }
      dateIntervalByDateInterval{
        nodeId
        id
      }
    }
  }
}`

class InstructorLogForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            dateGroup: props.log.dateGroupByDateGroup.id,
            dateInterval: this.props.log.dateIntervalByDateInterval.id,
            student:this.props.log.studentByStudent.id,
            instructor: this.props.getUserData.id
        }
        this.mutation = new Mutation({
            mutation:UPDATE_INSTRUCTOR_LOG,
            onSubmit:this.handleSubmit
        })
    }

    handleDescriptionChange = (event) => {
        event.persist();
        this.setState({comment:event.target.textContent})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.comment && this.state.comment != ''){
            return {eventLog:{id:this.props.log.id, eventLogPatch:this.state}}
        }
        return false;
    }

    render = () => {
        const student = this.props.log.studentByStudent
        const name = this.props.log.dateGroupByDateGroup.eventByEvent.activityByEventType.name
        const start = this.props.log.dateIntervalByDateInterval.start
        return <div className="styled-container column section edge-margin">
            <form onSubmit={this.mutation.onSubmit}>
                <h2 className='no-margin center-text'>{student.firstName} {student.lastName}</h2>
                <h5 className='no-margin center-text'>{name} {moment(start).format('MMMM, Do h:mm a')}</h5>
                <div id={this.props.id} onInput={this.handleDescriptionChange} className="manage-activity-textarea" suppressContentEditableWarning={true} contentEditable></div>
                <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Write Log</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
        </div>
    }
}

function InstructorLogsInner(props){
        return <GridView className='section' fillerStyle={"styled-container section"} itemsPerRow={3}>
                {props.allEventLogs.nodes.map((log)=>{return<InstructorLogForm getUserData={props.getUserData} key={log.nodeId} log={log} />})}
            </GridView>
}

function Inbetween (props){
    return <ReactQuery query={GET_INSTRUCTOR_LOGS}>
        <InstructorLogsInner getUserData={props.getUserData}/>
    </ReactQuery>
}

class InstructorLogs extends Component{
    constructor(props){
        super(props)
        this.state = {viewRange:''}
    }

    render = () => {
        return <SecureRoute roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_INSTRUCTOR"]}>
            <Inbetween />
        </SecureRoute>
    }
}

export default InstructorLogs
