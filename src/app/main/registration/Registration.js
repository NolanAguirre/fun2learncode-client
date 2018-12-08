import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import {SecureRoute} from '../common/Common'
import QueryHandler from '../queryHandler/QueryHandler'
import TimeTableRow from '../events/timeTableRow/TimeTableRow'
import gql from 'graphql-tag'

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
    }
    render = () =>{
        return <div className='registration-container'>
            <h2>Registration</h2>
            <QueryHandler query={GET_DATE_GROUP_INFO_BY_ID(this.props.match.params.id)}>
                <RegistrationEventInfo />
            </QueryHandler>
            <StudentSelect user={this.props.queryResult.getUserData}/>
            <div>
                <h4>Add-ons</h4>

            </div>
            <button>Register</button>
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

export default Registration
