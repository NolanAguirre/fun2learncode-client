import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import AddonSelect from '../addonSelect/AddonSelect'
import PaymentOverview from '../paymentOverview/PaymentOverview'
import FullEvent from '../events/event/FullEvent';
import {SecureRoute} from '../common/Common'
import {ReactQuery} from '../../../delv/delv-react'
import Delv from '../../../delv/delv'
import Payment from '../payment/Payment'
import moment from 'moment'
const NOW = new Date().toISOString()
const EVENT_FRAGMENT = `id
      archive
      name
      openRegistration
      closeRegistration
      seatsLeft
      capacity
      price
      publicDisplay
      registrationOverridesByEvent(filter:{validEnd:{greaterThanOrEqualTo:"${NOW}"}}){
        nodes{
          id
          validEnd
          modifiedPrice
          student
        }
      }
      addOnJoinsByEvent {
        nodes {
          id
          addOnByAddOn {
            name
            description
            price
            id
          }
        }
      }
      dateJoinsByEvent {
        nodes {
          id
          dateIntervalByDateInterval {
            id
            start
            end
          }
        }
      }
      addressByAddress {
        alias
        id
      }
      activityByActivity {
        id
        name
        activityPrerequisitesByActivity {
          nodes {
            id
            activityByPrerequisite {
              id
              name
            }
          }
        }
      }`


const GET_EVENT_INFO_BY_ID = (id) => `{
  allEvents(condition: {id: "${id}", publicDisplay:true}) {
    nodes {
     ${EVENT_FRAGMENT}
    }
    }

}`
const GET_EVENT_BY_TOKEN = (token) => `{
  eventByToken(arg0:"${token}"){
      ${EVENT_FRAGMENT}
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
            }else if(!res.data.data.checkWaiver){
                this.setState({error:`${student.firstName} ${student.lastName} has no waiver on file.`})
            }else{
                this.setState({})
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
        if(this.props.error){
            return 'No Event Found'
        }
        return <div className='registration-container main-contents'>
            <h2>Registration</h2>
            <div className='error'>{moment(this.props.event.closeRegistration).unix() < moment().unix()
                ?'Registration for this event has already closed, you will not be able to register unless you have been granted an override.':''}</div>
            <div className='styled-container'>
                <div className='section'>
                    <FullEvent event={this.props.event}
                                activity={this.props.activity}
                                address={this.props.address}
                                prerequisites={this.props.prerequisites}
                                dates={this.props.dates}/>
                </div>
                <PaymentOverview event={{price: this.props.event.price,id: this.props.event.id,name: this.props.activity.name}} overrides={this.props.overrides} addons={this.state.addons} students={this.state.students}/>
            </div>
            <div className='error'>{this.state.error}</div>
            <StudentSelect className='styled-container' multiSelect createStudent isValidChoice={this.checkPrerequisites} setSelected={this.setSelectedStudents} userId={this.props.getUserData.id}/>
            <AddonSelect className='styled-container column' multiSelect setSelected={this.setSelectedAddons} addons={this.props.addons} />
            <Payment info={info}/>
        </div>
    }
}

function RegistrationInbetween(props){
    const query = (window.location.href.includes('Private'))?GET_EVENT_BY_TOKEN(props.match.params.id):GET_EVENT_INFO_BY_ID(props.match.params.id)
    const networkPolicy = (window.location.href.includes('Private'))?'network-no-cache':'network-once'
    function formatResult(queryResult){
        console.log(queryResult)
        const event = (window.location.href.includes('Private'))? queryResult.data.eventByToken:queryResult.allEvents.nodes[0]
        if(!event){
            return {error:'No event found'}
        }
        const addons =  event.addOnJoinsByEvent.nodes.map(element=>element.addOnByAddOn)
        const activity = event.activityByActivity;
        const overrides = event.registrationOverridesByEvent
        const dates = event.dateJoinsByEvent;
        const address = event.addressByAddress;
        const prerequisites = activity.activityPrerequisitesByActivity.nodes.map((prereq) => {return prereq.activityByPrerequisite})
        return {
            event,
            addons,
            activity,
            dates,
            address,
            prerequisites,
            overrides
        }
    }
    return <ReactQuery formatResult={formatResult} query={query} networkPolicy={networkPolicy}>
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
