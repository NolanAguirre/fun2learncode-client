import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import AddonSelect from '../addonSelect/AddonSelect'
import PaymentOverview from '../paymentOverview/PaymentOverview'
import FullEvent from '../events/event/FullEvent';
import {SecureRoute, DatesTable, MultiSelect, Selectable} from '../common/Common'
import {ReactQuery} from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'
import Delv from '../../../delv/delv'
import Payment from '../payment/Payment'
import axios from 'axios'
import moment from 'moment'

const GET_EVENT_INFO_BY_ID = (id) => `{
  allEvents(condition: {id: "${id}"}) {
    nodes {
      nodeId
      id
      archive
      name
      openRegistration
      closeRegistration
      seatsLeft
      capacity
      price
      addOnJoinsByEvent {
        nodes {
          nodeId
          id
          addOnByAddOn {
            name
            description
            price
            nodeId
            id
          }
        }
      }
      dateJoinsByEvent {
        nodes {
          nodeId
          id
          dateIntervalByDateInterval {
            id
            nodeId
            start
            end
          }
        }
      }
      addressByAddress {
        alias
        nodeId
        id
      }
      activityByActivity {
        id
        nodeId
        name
        activityPrerequisitesByActivity {
          nodes {
            nodeId
            id
            activityByPrerequisite {
              nodeId
              id
              name
            }
          }
        }
      }
    }
  }
}`

class RegistrationInner extends Component{
    constructor(props){
        super(props)
        this.state = {
            students:[],
            addons:[],
            error:""
        }
    }

    checkPrerequisites = (student) => {
        let query = `{
  checkPrerequisite(arg0: "${this.props.eventId}", arg1: "${student.id}")
  checkRegistration(arg0: "${this.props.eventId}", arg1: "${student.id}")
  checkTime(arg0: "${this.props.eventId}", arg1: "${student.id}")
  checkWaiver(arg0:"${student.id}")
}`
        return Delv.post(query).then((res)=>{
            if(!res.data.data.checkPrerequisite){
                this.setState({error:`${student.firstName} ${student.lastName} does not meet the prerequisites.`})
            }else if(!res.data.data.checkRegistration){
                this.setState({error:`${student.firstName} ${student.lastName} is already registered for this class.`})
            }else if(!res.data.data.checkTime){
                this.setState({error:`${student.firstName} ${student.lastName} already has classes planned for this time.`})
            }else if(res.data.data.checkWaiver){
                this.setState({error:`${student.firstName} ${student.lastName} has no waiver on file.`})
            }else{
                return true
            }
            return false
        }).catch((err)=>{console.log(err)});
    }

    genRandomId = () =>{
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    setSelectedStudents = (students) =>{
        this.setState({students:students, error:""});
    }

    setSelectedAddons= (addons) =>{
        this.setState({addons:addons});
    }

    getSelections = () => {
        return {
            students: this.state.students.map(student=>student.id),
            addons:this.state.addons.map(addon=>addon.id),
            event: this.props.eventId,
            user:this.props.getUserData.id
        }
    }
    render = () =>{
        const info = this.getSelections();
        return <div className='registration-container main-contents'>
            <h2>Registration</h2>
            <div className='styled-container'>
                <div className='section'>
                    <FullEvent event={this.props.event}
                                activity={this.props.activity}
                                address={this.props.address}
                                prerequisites={this.props.prerequisites}
                                dates={this.props.dates}/>
                </div>
                <div className='section'>
                   <PaymentOverview event={{price: this.props.event.price,id: this.props.event.id,name: this.props.activity.name}} addons={this.state.addons} students={this.state.students}/>
               </div>
            </div>
            <div className='error'>{this.state.error}</div>
            <StudentSelect className='styled-container' multiSelect createStudent isValidChoice={this.checkPrerequisites} setSelected={this.setSelectedStudents} userId={this.props.getUserData.id}/>
            <AddonSelect className='styled-container column' multiSelect setSelected={this.setSelectedAddons} addons={this.props.addons} />
            <Payment info={info}/>
        </div>
    }
}

function RegistrationInbetween(props){
    function formatResult(queryResult){
        const event = queryResult.allEvents.nodes[0]
        const addons =  event.addOnJoinsByEvent.nodes.map(element=>element.addOnByAddOn)
        const activity = event.activityByActivity;
        const dates = event.dateJoinsByEvent;
        const address = event.addressByAddress;
        const prerequisites = activity.activityPrerequisitesByActivity.nodes.map((prereq) => {return prereq.activityByPrerequisite})
        return {
            event,
            addons,
            activity,
            dates,
            address,
            prerequisites
        }
    }
    return <ReactQuery formatResult={formatResult} query={GET_EVENT_INFO_BY_ID(props.match.params.id)}>
        <RegistrationInner eventId={props.match.params.id} getUserData={props.getUserData}/>
    </ReactQuery>
}


function Registration(props){
    const login = <Login history={props.history} redirectUrl={props.location.pathname} />
    return <SecureRoute unauthorized={login} roles={["FTLC_USER"]}>
            <RegistrationInbetween {...props}/>
        </SecureRoute>
}

export default Registration
