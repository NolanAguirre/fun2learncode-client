import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import {SecureRoute} from '../common/Common'
import QueryHandler from '../queryHandler/QueryHandler'
import TimeTableRow from '../events/timeTableRow/TimeTableRow'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo';

const GET_DATE_GROUP_INFO_BY_ID = (id)=>{
    return gql`
    {
  dateGroupById(id:"${id}"){
    nodeId
    id
    name
    openRegistration
    closeRegistration
    addressByAddress{
      alias
      nodeId
      id
    }
    price
    datesJoinsByDateGroup{
      nodes{
        nodeId
        id
        dateInterval
        dateIntervalByDateInterval{
          id
          nodeId
          start
          end
        }
      }
    }
    eventByEvent{
      openRegistration
      closeRegistration
      nodeId
    	id
      activityByEventType{
        name
        id
        nodeId
      }
    }
  }
}`}

class RegistrationEventInfo extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const dateGroup = this.props.queryResult.dateGroupById;
        const event = dateGroup.eventByEvent;
        const activity = event.activityByEventType;
        const date = dateGroup.datesJoinsByDateGroup.nodes;
        const address = dateGroup.addressByAddress;
        return <div className="registration-form-container">
            <h3>Event Information</h3>
            <div className="registration-form-event-info">
            <table>
                <tbody>
                    <tr>
                        <td>Event:</td>
                        <td>{activity.name}</td>
                    </tr>
                    <tr>
                        <td>Location: </td>
                        <td>{address.alias}</td>
                    </tr>
                    <tr>
                        <td>Price:</td>
                        <td>{dateGroup.price}</td>
                    </tr>
                </tbody>
            </table>
            Dates:
            <table>
              <tbody>
                {date.map((date, index) => {
                  return <TimeTableRow data={date.dateIntervalByDateInterval} key={index} />
                })}
              </tbody>
            </table>
            </div>
        </div>
    }
}

class RegistrationInner extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedStudents:[],
            error:""
        }
        this.template = (name, student) => `${name}:createEventRegistration(input:{eventRegistration:{registeredBy:"${this.props.queryResult.getUserData.id}",student:"${student.id}",dateGroup:"${this.props.match.params.id}"}}){
            eventRegistration{
                dateGroup
            }
        }`
    }

    checkPrerequisites = (student) => {
        let options = {
            query: gql`{
	               checkPrerequisites(arg0:"${this.props.match.params.id}",arg1:"${student.id}")
               }`
        }
        return this.props.client.query(options).then((res)=>{
            if(!res.data.checkPrerequisites){
                this.setState({error:`${student.firstName} ${student.lastName} does not meet the prerequisites.`})
            }
            return res.data.checkPrerequisites;
        }).catch((err)=>{console.log(err)});
    }

    genRandomId = () =>{
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    setSelectedStudents = (students) =>{
        this.setState({selectedStudents:students, error:""});
    }
    post = (event) =>{
        event.preventDefault();
        let mutation = '';
        this.state.selectedStudents.forEach((student)=>{ mutation += this.template(this.genRandomId(), student) + `\n`});
        let options = {
            mutation: gql`mutation{
                    ${mutation}
                }`
        }
        console.log(mutation)
        this.props.client.mutate(options).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    }
    
    render = () =>{
        return <div className='registration-container'>
            <h2>Registration</h2>
            <span>{this.state.error}</span>
            <QueryHandler query={GET_DATE_GROUP_INFO_BY_ID(this.props.match.params.id)}>
                <RegistrationEventInfo />
            </QueryHandler>
            <StudentSelect multiSelect={true} isValidStudent={this.checkPrerequisites} setSelectedStudents={this.setSelectedStudents} user={this.props.queryResult.getUserData}/>
            <div>
                <h4>Add-ons</h4>

            </div>
            <button onClick={this.post}>Register</button>
        </div>
    }
}
function Registration(props){
    const login = <Login history={props.history} redirectUrl={props.location.pathname} />
    return<SecureRoute unauthorized={login} roles={["FTLC_USER"]}>
            <RegistrationInner {...props}/>
        </SecureRoute>
}

// {(this.state.studentId)?<QueryHandler studentId={this.state.studentId}></QueryHandler>:""}

export default withApollo(Registration)
