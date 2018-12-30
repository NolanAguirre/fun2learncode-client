import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import {SecureRoute, DatesTable} from '../common/Common'
import {Query} from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'
import Delv from '../../../delv/delv'

const GET_DATE_GROUP_INFO_BY_ID = (id)=>{
    return `{
  allDateGroups(condition:{id: "${id}"}) {
    nodes {
      nodeId
      id
      name
      openRegistration
      closeRegistration
      addressByAddress {
        alias
        nodeId
        id
      }
      price
      datesJoinsByDateGroup {
        nodes {
          nodeId
          id
          dateInterval
          dateIntervalByDateInterval {
            id
            nodeId
            start
            end
          }
        }
      }
      eventByEvent {
        openRegistration
        closeRegistration
        nodeId
        id
        activityByEventType {
          name
          id
          nodeId
        }
      }
    }
  }
}`}

class AddOns extends Component{
    constructor(props){
        super(props);
        this.state = {selected:[]}
    }

    render = () => {
        return <div></div>
    }
}

class RegistrationEventInfo extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const dateGroup = this.props.queryResult.allDateGroups.nodes[0];
        const event = dateGroup.eventByEvent;
        const activity = event.activityByEventType;
        const dates = dateGroup.datesJoinsByDateGroup;
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
            <DatesTable className="registration-dates-table" dates={dates}/>
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
        this.template = (name, student) => `${name}:createEventRegistration(input: {eventRegistration: {registeredBy: "${this.props.queryResult.getUserData.id}", student: "${student.id}", dateGroup: "${this.props.match.params.id}"}}) {
    eventRegistration {
      nodeId
      studentByStudent {
        nodeId
      }
      dateGroupByDateGroup {
        nodeId
      }
    }
  }`
    }

    checkPrerequisites = (student) => {
        let query = `{
	               checkPrerequisites(arg0:"${this.props.match.params.id}",arg1:"${student.id}")
               }`
        return Delv.post(query).then((res)=>{
            if(!res.data.data.checkPrerequisites){
                this.setState({error:`${student.firstName} ${student.lastName} does not meet the prerequisites.`})
            }
            return res.data.data.checkPrerequisites;
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
        mutation = `mutation{
                    ${mutation}
                }`
        new Mutation({
            mutation:mutation,
            onSubmit:()=>{return{}}
        }).onSubmit()

    }

    render = () =>{
        return <div className='registration-container'>
            <h2>Registration</h2>
            <Query networkPolicy='cache-first' query={GET_DATE_GROUP_INFO_BY_ID(this.props.match.params.id)}>
                <RegistrationEventInfo />
            </Query>
            <span className='error'>{this.state.error}</span>
            <StudentSelect multiSelect={true} isValidStudent={this.checkPrerequisites} setSelectedStudents={this.setSelectedStudents} user={this.props.queryResult.getUserData}/>
            <div>
                <h4>Add-ons</h4>
                <AddOns />
            </div>
            <button onClick={this.post}>Register</button>
        </div>
    }
}

function Registration(props){
    const login = <Login history={props.history} redirectUrl={props.location.pathname} />
    return <SecureRoute unauthorized={login} roles={["FTLC_USER"]}>
            <RegistrationInner {...props}/>
        </SecureRoute>
}

// {(this.state.studentId)?<QueryHandler studentId={this.state.studentId}></QueryHandler>:""}

export default Registration
