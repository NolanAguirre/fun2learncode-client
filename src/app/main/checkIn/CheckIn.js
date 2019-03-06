import React, { Component } from 'react'
import './CheckIn.css'
import {SecureRoute, MultiSelect, Selectable} from '../common/Common'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import Logo from '../../logos/drawing.svg'
import moment from 'moment'

const GET_POSSIBLE_EVENTS = `{
  allDateIntervals(filter: {start: {greaterThan: "${moment().subtract(10000,'hours').toISOString()}", lessThan: "${moment().add(10000,'hours').toISOString()}"}}) {
    nodes {
      start
      end
      id
      attendancesByDateInterval {
        nodes {
          id
          studentByStudent {
            id
            firstName
            lastName
          }
        }
      }
      dateJoinsByDateInterval {
        nodes {
          id
          eventByEvent {
            id
            eventRegistrationsByEvent {
              nodes {
                id
                studentByStudent {
                  id
                  firstName
                  lastName
                }
                eventByEvent {
                  id
                  activityByActivity {
                    id
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
}`

const genRandomId = () =>{
	return '_' + Math.random().toString(36).substr(2, 9);
}
const localize = (timestamp) =>{
    return moment(moment.utc(timestamp)).local()
}

const TEMPLATE = (dateInterval, event, student, instructor) => {
    const NOW = new Date().toISOString()
return `${genRandomId()}:createAttendance(input:{attendance:{dateInterval:"${dateInterval}",event:"${event}", student:"${student}", checkInTime:"${NOW}"present:true}}){
    attendance{
      id
    }
  }
  ${genRandomId()}:createEventLog(input: {eventLog: {dateInterval: "${dateInterval}", instructor:"${instructor}", event: "${event}", student: "${student}", comment:"Student signed in at ${localize(NOW).format('h:mm a')}."}}) {
    eventLog {
      id
    }
  }`
}

function InlineEvent(props) {
    return<div className={props.className} onClick={()=>props.onClick(props.item)}>
        <h2 className="no-margin">{props.item.student.firstName} {props.item.student.lastName}</h2>
        <span>Event: {props.item.event.activityByActivity.name} {moment(props.item.dateInterval.start).format('h:mm a')}-{moment(props.item.dateInterval.end).format('h:mm a')}</span>
    </div>
}


class CheckInChoice extends Component{
    constructor(props){
        super(props)
		this.state = {};
    }

    handleResolve = (data) => {
		let allGood = true;
		for(let key in data){
			allGood = allGood && data[key]
		}
		if(allGood){
			this.setState({signedIn:true})
			setTimeout(()=>{this.props.reset(this.selected)}, 1500);
		}
    }

    handleSubmit = (event) => {
        event.preventDefault()
		if(this.selected && this.selected.length > 0){
			let mutation = this.selected.map((element)=>{return TEMPLATE(element.dateInterval.id, element.event.id, element.student.id, this.props.instructorId)})
	        new Mutation({
	            mutation:`mutation{${mutation}}`,
	            onSubmit:()=>{return {}},
	            onResolve:this.handleResolve
	        }).onSubmit()
		}else{
			this.props.reset(this.selected || [])
		}
    }

    setSelected = (selected) => {
        this.selected = selected
    }

    render = () => {
		if(this.state.signedIn){
			return <div className='check-in-container'>
				<h1 className='center-text'>You've Been Signed in!</h1>
			</div>

		}else{
			return <form className='section container column custom-scrollbar' onSubmit={this.handleSubmit}>
					<div className='check-in-choice-container'>
						<MultiSelect multiSelect setSelected={this.setSelected} items={this.props.choices}>
							<Selectable className={{base:'check-in-student', selected:'check-in-student-selected'}}>
								<InlineEvent/>
							</Selectable>
						</MultiSelect>
					</div>
					<div className='event-register-btn center-text' onClick={this.handleSubmit}>Check in</div>
				</form>
		}
    }
}

class CheckInInner extends Component{
    constructor(props){
        super(props);
        this.state = {}
        this.name = React.createRef()
        this.attendance = []
		this.signedIn = [];
        this.props.allDateIntervals.nodes.forEach((dateInterval)=>{
			const signedIn = dateInterval.attendancesByDateInterval.nodes.map((attendance)=>{
				return attendance.studentByStudent.id
			})
            dateInterval.dateJoinsByDateInterval.nodes.forEach((dateJoin)=>{
                dateJoin.eventByEvent.eventRegistrationsByEvent.nodes.forEach((registration)=>{
					const student = registration.studentByStudent
					const temp = {
                        student,
                        event:registration.eventByEvent,
                        dateInterval:dateInterval,
                        id:`${dateInterval.id}${student.id}`
                    }
					if(signedIn.includes(student.id)){
						this.signedIn.push(temp)
					}else{
						this.attendance.push(temp)
					}
                })
            })
        })
    }

	allSignedIn = (name) => {
		const signedIn = this.signedIn.filter(obj=>obj.student.lastName.toUpperCase() === name).length
		const notSignedIn = this.attendance.filter(obj=>obj.student.lastName.toUpperCase() === name).length
		return signedIn > 0 && notSignedIn === 0;
	}

    loadStudents = () => {
        const name = this.name.current.value.toUpperCase()
        let choices = this.attendance.filter(element=>element.student.lastName.toUpperCase() === name)
        if(choices.length > 0){
            this.setState({choices})
        }else{
			if(this.allSignedIn(name)){
				this.setState({error:`All students with the last name ${this.name.current.value} have been signed in.`})
			}else{
				this.setState({error:`No students with an event today found.`})
			}
        }
    }

	clearError = () => {
		if(this.state.error){
			this.setState({error:null});
		}
	}

	reset = (selected) => {
		this.attendance = this.attendance.filter((attendance)=>{
			let temp = true;
			selected.forEach((element)=>{
				if(attendance.student.id === element.student.id && attendance.dateInterval.id === element.dateInterval.id){
					temp = false;
					this.signedIn.push(attendance)
				}
			})
			return temp;
		})
		this.setState({choices:null})
	}

    render = () => {
        return <div className='login-container check-in'>
              <div className='login-headers'>
                <h1>Sign In</h1>
              </div>
              {this.state.choices?
                  <CheckInChoice reset={this.reset} instructorId={this.props.getUserData.id} choices={this.state.choices}/>:<React.Fragment>
                  <div className='check-in-container'>
					  <div className='error'>{this.state.error}</div>
                    <input className='styled-input' ref={this.name} placeholder='Students last name' onChange={this.clearError}></input>
              </div>
              <div className='event-register-btn center-text' onClick={this.loadStudents}>Check in</div>
		  </React.Fragment>}
            </div>

    }
}

function CheckIn(props){
    return <SecureRoute roles={['FTLC_ATTENDANT']}>
        <ReactQuery query={GET_POSSIBLE_EVENTS}>
            <CheckInInner />
        </ReactQuery>
    </SecureRoute>
}

export default CheckIn;
