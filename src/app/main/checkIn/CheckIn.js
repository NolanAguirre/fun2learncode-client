import React, { Component } from 'react'
import './CheckIn.css'
import {SecureRoute, MultiSelect, Selectable} from '../common/Common'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import Logo from '../../logos/drawing.svg'
import moment from 'moment'

//////// TODO this page does not persist thru a refresh, it needs to

const GET_POSSIBLE_EVENTS = `{
	allDateIntervals(filter:{start:{greaterThan:"${moment().subtract(10,'hours').toISOString()}", lessThan:"${moment().add(10,'hours').toISOString()}"}}){
    nodes{
      start
      end
      id
      nodeId
  		datesJoinsByDateInterval{
        nodes{
          nodeId
          id
          dateGroupByDateGroup{
            nodeId
            id
            eventRegistrationsByDateGroup{
              nodes{
                nodeId
                id
                studentByStudent{
                  nodeId
                  id
                  firstName
                  lastName
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
              }
            }
          }
        }
      }
    }
  }
}`

const TEMPLATE = (dateInterval, dateGroup, student) => {
return `createAttendance(input:{attendance:{dateInterval:"${dateInterval}",dateGroup:"${dateGroup}", student:"${student}",present:true}}){
    attendance{
      nodeId
    }
  }
  createEventLog(input:{eventLog:{dateInterval:"${dateInterval}",dateGroup:"${dateGroup}", student:"${student}"}}){
		eventLog{
    	nodeId
  	}
}`
}

function InlineEvent(props) {
    return<div className={props.className} onClick={()=>props.onClick(props.item)}>
        <h2 className="no-margin">{props.item.student.firstName} {props.item.student.lastName}</h2>
        <span>Event: {props.item.dateGroup.eventByEvent.activityByEventType.name} {moment(props.item.dateInterval.start).format('h:mm a')}-{moment(props.item.dateInterval.end).format('h:mm a')}</span>
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
        let mutation = this.selected.map((element)=>{return TEMPLATE(element.dateInterval.id, element.dateGroup.id, element.student.id)})
        new Mutation({
            mutation:`mutation{${mutation}}`,
            onSubmit:()=>{return {}},
            onResolve:this.handleResolve
        }).onSubmit()

    }

    setSelected = (selected) => {
        this.selected = selected
    }

    render = () => {
		if(this.state.signedIn){
			return <div>You've Been Signed in!</div>

		}else{
			return <div className='container column section'>
				<h1 className='no-margin center-text'>Sign in</h1>
				<form className='section container column' onSubmit={this.handleSubmit}>
					<div className='section'>
						<MultiSelect multiSelect setSelected={this.setSelected} items={this.props.choices}>
							<Selectable className={{base:'check-in-student', selected:'check-in-student-selected'}}>
								<InlineEvent/>
							</Selectable>
						</MultiSelect>
					</div>
					<div className='event-register-btn' onClick={this.handleSubmit}>Finish</div>
				</form>
			</div>
		}
    }
}

class CheckInInner extends Component{
    constructor(props){
        super(props);
        this.state = {}
        this.name = React.createRef()
        this.attendance = []
        this.props.allDateIntervals.nodes.forEach((dateInterval)=>{
            dateInterval.datesJoinsByDateInterval.nodes.forEach((datesJoin)=>{
                datesJoin.dateGroupByDateGroup.eventRegistrationsByDateGroup.nodes.forEach((registration)=>{
                    this.attendance.push({
                        student:registration.studentByStudent,
                        dateGroup:registration.dateGroupByDateGroup,
                        dateInterval:dateInterval,
                        id:registration.id
                    })
                })
            })
        })
		this.signedIn = [];
    }

    loadStudents = () => {
        const name = this.name.current.value.toUpperCase()
        let choices = this.attendance.filter(element=>element.student.lastName.toUpperCase() === name)
        if(choices.length > 0){
            this.setState({choices})
        }else{
			if(this.signedIn.includes(name)){
				this.setState({error:`You've already been signed in`})
			}else{
				this.setState({error:`No students with an event today found`})
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
					this.signedIn.push(element.student.lastName.toUpperCase())
				}
			})
			return temp;
		})
		this.setState({choices:null})
	}

    render = () => {

        return<div className='login'>
          <div className='login-container'>
            <div className='login-widget'>
              <div className='login-headers'>
                <a><img className='nav-logo' src={Logo} /></a>
              </div>
              {this.state.choices?
                  <CheckInChoice reset={this.reset} choices={this.state.choices}/>:<React.Fragment>
					  <span className='error'>{this.state.error}</span>
                <div className='center-y section'>
                    <input className='sign-up-form-input check-in-input' ref={this.name} placeholder='Students last name' onChange={this.clearError}></input>
                    <div className='event-register-btn' onClick={this.loadStudents}>Check in</div>
              </div>
		  </React.Fragment>}
            </div>
          </div>
        </div>
    }
}

function CheckIn(props){
    return <SecureRoute ignoreResult roles={['FTLC_ATTENDANT']}>
        <ReactQuery query={GET_POSSIBLE_EVENTS}>
            <CheckInInner />
        </ReactQuery>
    </SecureRoute>
}

export default CheckIn;
