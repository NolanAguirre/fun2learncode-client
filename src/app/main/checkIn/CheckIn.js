import React, { Component } from 'react'
import './CheckIn.css'
import {SecureRoute} from '../common/Common'
import Logo from '../../logos/drawing.svg'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag';
import moment from 'moment'

const GET_STUDENT = (studentName) => {
    return gql`{
	allUsers(condition:{role:FTLC_STUDENT, firstName:"${studentName}"}){
    nodes{
      firstName
      lastName
      id
      nodeId
    }
  }
}`
}

const GET_POSSIBLE_EVENTS = (studentId) => {
    return gql`{
	dateIntervalByStudent(studentId:"${studentId}", filter:{start:{greaterThan:"${moment().subtract(1,'hours').toISOString()}", lessThan:"${moment().add(1,'hours').toISOString()}"}}){
    nodes{
      start
      end
      id
      nodeId
  		datesJoinsByDateInterval{
        nodes{
          nodeId
          dateGroupByDateGroup{
            nodeId
            eventRegistrationsByDateGroup(condition:{student:"${studentId}"}){
              nodes{
                nodeId
                status
                dateGroupByDateGroup{
                  nodeId
                  eventByEvent{
                    nodeId
                    activityByEventType{
                      nodeId
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`
}

class ConfirmName extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:""
        }
        console.log(props.queryResult)
    }
    handleChange = (event) => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: value
      })
    }

    handeSubmit = (event) =>{
        event.preventDefault();
    }

    render = () => {
        return<div>
        NAME SIGN IN
            <form  autoComplete="off" onSubmit={this.handeSubmit}>
                <input className='sign-up-form-input' name='name' onChange={this.handleChange} placeholder='Last name' />
                <button type="submit">next</button>
            </form>
        </div>
    }
}


class GetStudent extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:""
        }
    }
    handleChange = (event) => {
      const target = event.target
      const value = target.value
      const name = target.name
      this.setState({
        [name]: value
      })
    }

    handeSubmit = (event) =>{
        event.preventDefault();
        this.props.setLastName(this.state.name);
    }

    render = () => {
        return<div>
            <form  autoComplete="off" onSubmit={this.handeSubmit}>
                <input className='sign-up-form-input' name='name' onChange={this.handleChange} placeholder='Last name' />
                <button type="submit">next</button>
            </form>
        </div>
    }
}

class CheckInInner extends Component{
    constructor(props){
        super(props);
        this.state = {
            UI: 'getStudent',
            lastName: ''
        }
    }
    setLastName = (name) => {
        this.setState({lastName:name, UI:'confirm'})
    }
    render = () => {
        let inner;
        if(this.state.UI === 'getStudent'){
            inner = <GetStudent setLastName={this.setLastName} />
        }else if(this.state.UI === 'confirm'){
            inner = <QueryHandler query={GET_STUDENT(this.state.lastName)}>
                <ConfirmName />
            </QueryHandler>
        }
        return<div className='login'>
          <div className='login-container'>
            <div className='login-widget'>
              <div className='login-headers'>
                <a><img className='nav-logo' src={Logo} /></a>
              </div>
                {inner}
            </div>
          </div>
        </div>
    }
}

function CheckIn(props){
    return <SecureRoute roles={['FTLC_ATTENDANT']}>
        <CheckInInner />
    </SecureRoute>
}

export default CheckIn;