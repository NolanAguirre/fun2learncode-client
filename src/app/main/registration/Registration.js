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


const GET_DATE_GROUP_INFO_BY_ID = (id) => {
    return `{
  allDateGroups(condition:{id: "${id}"}) {
    nodes {
      nodeId
      id
      name
      openRegistration
      closeRegistration
      addOnJoinsByDateGroup{
        nodes{
          nodeId
          id
          addOnByAddOn{
            name
            nodeId
            id
            description
            price
          }
        }
      }
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
          activityPrerequisitesByActivity{
            nodes{
              nodeId
              id
              activityByPrerequisite{
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
}`}

class RegistrationInner extends Component{
    constructor(props){
        super(props)
        this.state = {
            students:[],
            addons:[],
            error:""
        }
        this.template = (name, student) => `${name}:createEventRegistration(input: {eventRegistration: {registeredBy: "${this.props.getUserData.id}", student: "${student.id}", dateGroup: "${this.props.dateGroupId}"}}) {
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
	               checkPrerequisites(arg0:"${this.props.dateGroupId}",arg1:"${student.id}")
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
        this.setState({students:students, error:""});
    }

    setSelectedAddons= (addons) =>{
        this.setState({addons:addons});
    }

    handleSubmit = ({token, promoCode, callback}) =>{
        let data = {
            students: this.state.students.map(student=>student.id),
            addons:this.state.addons.map(addon=>addon.id),
            dateGroup: this.props.dateGroupId,
            user:this.props.getUserData,
            event:this.props.event.id,
            stripeToken: token.id,
            promoCode
        }
        axios.post('http://localhost:3005/payment', data).then((res)=>{callback(res)})
    }

    totalChange = (total) => {
        this.total = total;
    }

    render = () =>{

        return <div className='registration-container'>
            <h2>Registration</h2>
            <div className='styled-container'>
                <div className='section'>
                    <FullEvent dateGroup={this.props.dateGroup}
                                activity={this.props.activity}
                                address={this.props.address}
                                prerequisites={this.props.prerequisites}
                                dates={this.props.dates}/>
                </div>
                <div className='section'>
                   <PaymentOverview totalChange={this.totalChange} dateGroup={{price: this.props.dateGroup.price,id: this.props.dateGroup.id,name: this.props.activity.name}} addons={this.state.addons} students={this.state.students}/>
               </div>
            </div>
            <span className='error'>{this.state.error}</span>
            <StudentSelect className='styled-container' multiSelect isValidChoice={this.checkPrerequisites} setSelected={this.setSelectedStudents} user={this.props.getUserData}/>
            <AddonSelect classNam='styled-container' multiSelect setSelected={this.setSelectedAddons} addons={this.props.addons} />
            <Payment handleSubmit={this.handleSubmit} getTotal={()=>{return this.total}}/>
        </div>
    }
}

function RegistrationInbetween(props){
    function formatResult(queryResult){
        const dateGroup = queryResult.allDateGroups.nodes[0]
        const addons =  dateGroup.addOnJoinsByDateGroup.nodes.map(element=>element.addOnByAddOn)
        const event = dateGroup.eventByEvent;
        const activity = event.activityByEventType;
        const dates = dateGroup.datesJoinsByDateGroup;
        const address = dateGroup.addressByAddress;
        const prerequisites = activity.activityPrerequisitesByActivity.nodes.map((prereq) => {return prereq.activityByPrerequisite})
        return {
            dateGroup,
            addons,
            event,
            activity,
            dates,
            address,
            prerequisites
        }
    }
    return <ReactQuery formatResult={formatResult} query={GET_DATE_GROUP_INFO_BY_ID(props.match.params.id)}>
        <RegistrationInner dateGroupId={props.match.params.id} getUserData={props.getUserData}/>
    </ReactQuery>
}


function Registration(props){
    const login = <Login history={props.history} redirectUrl={props.location.pathname} />



    return <SecureRoute unauthorized={login} roles={["FTLC_USER"]}>
            <RegistrationInbetween {...props}/>
        </SecureRoute>
}

export default Registration
