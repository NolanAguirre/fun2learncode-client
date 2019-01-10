import React, { Component } from 'react'
import './Registration.css'
import Login from '../login/Login'
import StudentSelect from '../studentSelect/StudentSelect'
import {SecureRoute, DatesTable, MultiSelect} from '../common/Common'
import {ReactQuery} from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'
import Delv from '../../../delv/delv'
import Payment from '../payment/Payment'
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
        }
      }
    }
  }
}`}

function Addon(props) {
    let className;
    if(props.selected){
        className = 'addon-container-selected'
    }else{
        className = 'addon-container'
    }
  return  <div onClick={() => props.onClick(props.item)} className={className}>
        <h3>{props.item.name}</h3>
        <div className='addon-container-description'>
            {props.item.description}
        </div>
        <div>
            {props.item.price}$
        </div>
      </div>
}

class RegistrationEventInfo extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const dateGroup = this.props.dateGroup
        const event = dateGroup.eventByEvent;
        const activity = event.activityByEventType;
        const dates = dateGroup.datesJoinsByDateGroup;
        const address = dateGroup.addressByAddress;
        return <div className='registration-info-section'>
            <div className="registration-event-info">
                <h3>Event Information</h3>
                <div className="registration-info-tables-container">
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
            <div className='payment-overview-container'>
                <PaymentOverview dateGroup={{price: dateGroup.price,id: dateGroup.id,name: activity.name}} addons={this.props.addons} students={this.props.students}/>
            </div>
        </div>
    }
}

function PaymentOverviewRow(props){
    return <tr>
            <td>{props.name}</td>
            <td>{props.student}</td>
            <td>{props.type}</td>
            <td>{props.price}$</td>
        </tr>
}


function PaymentOverview(props){
    const {dateGroup, addons, students} = props
    let rows = [];
    let total = 0;
    let rowCount =0;
    students.forEach((student) => {
        rowCount++;
        rows.push(<PaymentOverviewRow key={rowCount} type={'Event'} name={dateGroup.name} student={student.firstName + " " + student.lastName} price={dateGroup.price} />)
        total+= dateGroup.price
        addons.forEach((addon)=>{
            rowCount++;
            total+= addon.price
            rows.push(<PaymentOverviewRow key={rowCount} type={'Add-on'} name={addon.name} student={student.firstName + " " + student.lastName} price={addon.price} />)
        })
    })
    return <table className='payment-overview-table'>
        <tbody>
            <tr>
                <th>Item</th>
                <th>Student</th>
                <th>Type</th>
                <th>Price</th>
            </tr>
            {rows}
            <tr>
                <th></th>
                <th></th>
                <th>Total: </th>
                <th>{total}$</th>
            </tr>
        </tbody>
    </table>
}

class RegistrationInner extends Component{
    constructor(props){
        super(props)
        this.state = {
            students:[],
            addons:[],
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
        this.setState({students:students, error:""});
    }

    setSelectedAddons= (addons) =>{
        this.setState({addons:addons});
    }

    post = (event) =>{
        event.preventDefault();
        let mutation = '';
        this.state.students.forEach((student)=>{ mutation += this.template(this.genRandomId(), student) + `\n`});
        mutation = `mutation{
                    ${mutation}
                }`
        new Mutation({
            mutation:mutation,
            onSubmit:()=>{return{}}
        }).onSubmit()

    }

    formatAddons = (queryResult) =>{
        return queryResult.nodes.map(element=>element.addOnByAddOn)
    }

    render = () =>{
        const userData = this.props.delv.queryResult.getUserData
        const dateGroup = this.props.queryResult.allDateGroups.nodes[0]
        return <div className='registration-container'>
            <h2>Registration</h2>
            <RegistrationEventInfo dateGroup={dateGroup} addons={this.state.addons} students={this.state.students} />
            <span className='error'>{this.state.error}</span>
            <StudentSelect className='registration-section' multiSelect isValidChoice={this.checkPrerequisites} setSelected={this.setSelectedStudents} user={userData}/>
            <div className='registration-section'>
                <h3>Add-ons</h3>
                <div className='registration-addons-container'>
                    <MultiSelect multiSelect setSelected={this.setSelectedAddons} formatter={this.formatAddons} queryResult={dateGroup.addOnJoinsByDateGroup}>
                        <Addon />
                    </MultiSelect>
                </div>
            </div>
            <Payment/>
        </div>
    }
}

function Registration(props){
    const login = <Login history={props.history} redirectUrl={props.location.pathname} />
    return <SecureRoute unauthorized={login} roles={["FTLC_USER"]}>
            <ReactQuery query={GET_DATE_GROUP_INFO_BY_ID(props.match.params.id)}>
                <RegistrationInner {...props}/>
            </ReactQuery>
        </SecureRoute>
}

export default Registration
