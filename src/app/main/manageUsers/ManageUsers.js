import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {DropDown, BasicPopup, SecureRoute, GridView, RoutePopup} from '../common/Common';
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment';
import {StatelessOrderHistory} from '../orderHistory/OrderHistory'
import './ManageUsers.css'
import alert from '../../logos/alert.svg'
import Popup from "reactjs-popup"
import {StudentWaiver} from '../studentWaiver/StudentWaiver'
import next from '../../logos/next.svg'
import DateTime from 'react-datetime'
import EventResponse from '../eventRequest/EventResponse'
import xicon from '../../logos/x-icon.svg'
const yearAgo = moment().subtract(1,'years').toISOString()

const GET_USERS = `{
  allUsers{
    nodes{
      id
      createdOn
      role
      firstName
      lastName
      email
      eventRequestsByUserId(condition:{status:PENDING}){
        nodes{
          id
          status
        }
      }
      refundRequestsByUserId(condition:{status:PENDING}){
        nodes{
          id
          status
        }
      }
    }
  }
}`

const UPDATE_USER_ROLE = (userId, role) => `mutation($id:UUID!, $role:RoleType!){
  updateUserById(input:{id:$id, userPatch:{role:$role}}){
    user{
      id
      role
    }
  }
}`

const GET_STUDENTS = (parentId) => `{
  allStudents(condition: {parent: "${parentId}"}) {
    nodes {
      id
      firstName
      parent
      dateOfBirth
      lastName
      studentWaiversByStudent(filter: {createdOn: {greaterThan: "${yearAgo}"}}) {
        nodes {
          id
          createdOn
          primaryCare
          primaryCarePhone
          pickupOne
          pickupTwo
          emergencyPhone
          other
        }
      }
    }
  }
}`

const CREATE_OVERRIDE = `mutation($override:RegistrationOverrideInput!){
  createRegistrationOverride(input:{registrationOverride:$override}){
    registrationOverride{
      id
    }
  }
}`

const DROPDOWN_OPTIONS = [
    {
        name:'User',
        value:'FTLC_USER'
    },{
        name:'Instructor',
        value:'FTLC_INSTRUCTOR'
    },{
        name:'Attendant',
        value:'FTLC_ATTENDANT'
    },{
        name:'Admin',
        value:'FTLC_ADMIN'
    },{
        name:'Owner',
        value:'FTLC_OWNER'
    }
]

class UserForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            promote:props.user.role
        }
        this.promoteMutation = new Mutation({
            mutation:UPDATE_USER_ROLE(this.props.user.id, this.state.promote),
            onSubmit:this.promoteUser
        })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    promoteUser = (event) => {
        event.preventDefault()
        if(this.state.promote){
            return{id:this.props.user.id, role:this.state.promote}
        }
        return false;
    }
    render = () => {
        const user = this.props.user
        return <div>
            <h2>Account</h2>
            <table className='manage-user-table'>
                <tbody>
                    <tr>
                        <td>Name: </td>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>Email: </td>
                        <td>{user.email}</td>
                    </tr>
                    <tr className='no-wrap'>
                        <td>Memeber since: </td>
                        <td>{moment(user.createdOn).format('MMM, Do YYYY')}</td>
                        <td>ID: </td>
                        <td>{user.id}</td>
                    </tr>
                    <tr>
                        <td>role: </td>
                        <td>{user.role}</td>
                        <td>promote to: </td>
                        <td><DropDown options={DROPDOWN_OPTIONS} value={this.state.promote} name='promote' onChange={this.handleChange} /> <button onClick={this.promoteMutation.onSubmit}>promote</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    }

}

class OverrideForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            event:'',
            modifiedPrice:0,
            validEnd: moment().add(1, 'months')
        }
        this.mutation = new Mutation({
            mutation:CREATE_OVERRIDE,
            onSubmit:this.handleSubmit,
            onResolve:this.resetState
        })
    }
    componentWillUnmount = () => {
        this.mutation.removeListeners()
    }
    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    hasRequiredValues = () => {
        return this.state.event
    }
    handleSubmit = (event) => {
        event.preventDefault()
        if(this.hasRequiredValues){
            return {override:{...this.state, student:this.props.studentId}}
        }
    }
    resetState = () => {
        this.setState({
            event:'',
            modifiedPrice:0,
            validEnd: moment().add(1, 'months')
        })
    }
    render = () => {
        return <form className='override-form' onSubmit={this.mutation.onSubmit}>
            <h2>Override</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Event Id</td>
                        <td><input autoComplete="off" value={this.state.event} onChange={this.handleChange} name='event'placeholder='Event Id'/></td>
                    </tr>
                    <tr>
                        <td>New Price: (optional)</td>
                        <td><input value={this.state.modifiedPrice} onChange={this.handleChange} name='modifiedPrice' type='number'/></td>
                    </tr>
                    <tr>
                        <td>Valid until:</td>
                        <td><DateTime className="full-date-input" dateFormat="MMM Do YYYY" timeFormat="H:mm"  value={this.state.validEnd} onChange={(time) => {this.handleTimeChange("validEnd", time)}}/></td>
                    </tr>
                </tbody>
            </table>
            <div className='styled-button' onClick={this.mutation.onSubmit}>Create</div>
        </form>
    }
}

function StudentForm(props){
    const studentWaiver = props.studentWaiversByStudent.nodes[0]
    return<div>
        <h3 className='no-margin'>{props.firstName} {props.lastName}</h3>
        <div className='section container'>
            <OverrideForm studentId={props.id} />
            <div className='section'>
                <StudentWaiver {...studentWaiver}/>
            </div>
            <div className='section'>
                <h2>Student info</h2>
                <div>{props.firstName} {props.lastName}</div>
                Date of Birth: {moment(props.dateOfBirth).format('MMMM, YYYY')}
                <div>{props.id}</div>
            </div>
        </div>
    </div>
}

function StudentsForm(props){
    return props.allStudents.nodes.map((student)=><StudentForm key={student.id} {...student}/>)
}

class ManageUserForm extends Component{
    constructor(props){
        super(props)
        this.state = {UI:'default'}
    }
    render = () => {
        const user = this.props.user
        if(this.state.UI === 'students'){
            return<div className='manage-user-popup'>
                <h1>{user.firstName} {user.lastName}s Students</h1> // TODO add '
                <ReactQuery query={GET_STUDENTS(user.id)}>
                    <StudentsForm/>
                </ReactQuery>
                <div className='back-container' onClick={()=>{this.setState({UI:'default'})}}> <img className='previous back-arrow' src={next} title='Icon made by Gregor Cresnar'/> Back</div>
            </div>
        }else if(this.state.UI === 'orders'){
            return <div className='manage-user-popup'>
                <h1>{user.firstName} {user.lastName}s order history</h1>
                <StatelessOrderHistory userId={user.id} adminForm/>
                <div className='back-container' onClick={()=>{this.setState({UI:'default'})}}> <img className='previous back-arrow' src={next} title='Icon made by Gregor Cresnar'/> Back</div>
            </div>
        }else if(this.state.UI === 'events'){
            return <div className='manage-user-popup'>
               <h1>{user.firstName} {user.lastName}s Event Requests</h1>
               <EventResponse userId={user.id}/>
               <div className='back-container' onClick={()=>{this.setState({UI:'default'})}}> <img className='previous back-arrow' src={next} title='Icon made by Gregor Cresnar'/> Back</div>
           </div>
        }
        return <div className='manage-user-popup'>
            <h1>{user.firstName} {user.lastName}</h1>
            <UserForm user={user} />
            <div className='manage-user-btn-container'>
                <span className='styled-button' onClick={()=>{this.setState({UI:'orders'})}}>View orders</span>
                <span className='styled-button' onClick={()=>{this.setState({UI:'students'})}}>View Students</span>
                <span className='styled-button' onClick={()=>{this.setState({UI:'events'})}}>View Requests</span>
            </div>
    </div>

    }
}

const itemsPerRow = 5;
class ManageUsersInner extends Component {
    constructor(props){
        super(props)
        this.state = {showPopup:false}
    }
    showPopup = (user) => {
        this.setState({showPopup:true, user})
    }
    clearPopupState = () => {
        this.setState({showPopup:false, user:undefined})
    }
    render = () => {
        const allUsers = this.props.allUsers.nodes
        let child = [];
        for(let x = 0; x < allUsers.length; x+=itemsPerRow){
            let rows = allUsers.slice(x,x+itemsPerRow).map((user)=>{
            let className = ''
            if(user.eventRequestsByUserId.nodes.length && user.refundRequestsByUserId.nodes.length){
                className = 'orange-tint'
            }else if(user.eventRequestsByUserId.nodes.length){
                className='blue-tint'
            }else if(user.refundRequestsByUserId.nodes.length){
                className='red-tint'
            }
            return <td key={user.id}>
            <div className={className} onClick={()=>{this.showPopup(user)}}>{user.firstName} {user.lastName}<br/>{user.email}</div>
        </td>})
            child.push(<tr key={x}>{rows}</tr>)
        }
        return<div className='manage-users'>
            <Popup open={this.state.showPopup} closeOnDocumentClick={false} onClose={this.clearPopupState} className='popup'>
            <div className='popup-inner'>
                <div className='close-popup'>
                    <img onClick={this.clearPopupState} src={xicon}/>
                </div>
                <ManageUserForm user={this.state.user}/>
            </div>
            </Popup>
            <table className='manage-users-table'>
                <tbody>
                    {child}
                </tbody>
            </table>
        </div>
    }
}

function ManageUsers(props){
    return <SecureRoute ignoreResult roles={["FTLC_OWNER", "FTLC_ADMIN"]}>
        <ReactQuery query={GET_USERS}>
            <ManageUsersInner />
        </ReactQuery>
    </SecureRoute>
}

export default RoutePopup(ManageUsers)
