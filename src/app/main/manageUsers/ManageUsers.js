import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {DropDown, BasicPopup, SecureRoute, GridView} from '../common/Common';
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment';
import OrderHistory from '../orderHistory/OrderHistory'
import './ManageUsers.css'
import alert from '../../logos/alert.svg'
import Popup from "reactjs-popup"
const GET_USERS = `{
  allUsers{
    nodes{
      nodeId
      id
      firstName
      lastName
      email
    }
  }
}`

const GET_USER_DATA = (userId) => `{
  allUsers(condition:{id:"${userId}"}){
    nodes{
      nodeId
      id
      createdOn
      role
      firstName
      lastName
      email
      refundRequestsByUserId{
        nodes{
          nodeId
          id
          reason
          amountRefunded
          grantedReason
          status
          createdOn
        }
      }
      studentsByParent{
        nodes{
          nodeId
          id
          firstName
          lastName
        }
      }
    }
  }
}`

const UPDATE_USER_ROLE = (userId, role) => `mutation($id:UUID!, $role:RoleType!){
  updateUserById(input:{id:$id, userPatch:{role:$role}}){
    user{
      nodeId
      role
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
        name:'Lead instructor',
        value:'FTLC_LEAD_INSTRUCTOR'
    },{
        name:'Admin',
        value:'FTLC_ADMIN'
    },{
        name:'Owner',
        value:'FTLC_OWNER'
    }
]

class ManageUserForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            promote:props.allUsers.nodes[0].role,
            student:undefined
        }
        this.promoteMutation = new Mutation({
            mutation:UPDATE_USER_ROLE(this.props.id, this.state.promote),
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
            return{id:this.props.id, role:this.state.promote}
        }
        return false;
    }
    setSelectedStudents = (student) =>{
        this.setState({selectedStudent:student});
    }
    render = () => {
        const user = this.props.allUsers.nodes[0]
        return <div className='manage-user-form'>
        <h1>{this.props.firstName} {this.props.lastName}</h1>
            <div>
                <h2>Account</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Name: </td>
                            <td>{user.firstName} {user.lastName}</td>
                        </tr>
                        <tr>
                            <td>ID: </td>
                            <td>{user.id}</td>
                        </tr>
                        <tr>
                            <td>Email: </td>
                            <td>{user.email}</td>
                        </tr>
                        <tr className='no-wrap'>
                            <td>Memeber since: </td>
                            <td>{moment(user.createdOn).format('MMM, Do YYYY')}</td>
                        </tr>
                        <tr>
                            <td>role: </td>
                            <td>{user.role}</td>
                        </tr>
                        <tr>
                            <td>promote to: </td>
                            <td><DropDown options={DROPDOWN_OPTIONS} value={this.state.promote} name='promote' onChange={this.handleChange} /></td>
                            <td><button onClick={this.promoteMutation.onSubmit}>promote</button></td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div>
                <h2>Order History</h2>
                <OrderHistory userId={user.id} adminForm={true}/>
            </div>
            {user.studentsByParent.nodes.length > 0?<div>
                <h2>Students</h2>
            </div>:<div>
            <h2>This user has no students</h2>
        </div>}
        </div>
    }
}
// <DropDown options={this.props.students} value={this.state.student} name='student' onChange={this.handleChange} />



const itemsPerRow = 5;
class ManageUsersInner extends Component {
    constructor(props){
        super(props)
        this.state = {showPopup:false}
    }
    showPopup = (userId) => {
        this.setState({showPopup:true, userId})
    }
    clearPopupState = () => {
        this.setState({showPopup:false, userId:undefined})
    }
    render = () => {
        const allUsers = this.props.allUsers.nodes
        let child = [];
        for(let x = 0; x < allUsers.length; x+=itemsPerRow){
            let rows = allUsers.slice(x,x+itemsPerRow).map((user)=><td key={user.id}><div onClick={()=>{this.showPopup(user.id)}}>{user.firstName} {user.lastName}<br/>{user.email}</div></td>)
            child.push(<tr key={x}>{rows}</tr>)
        }
        return<div className='manage-users'>
            <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState} className='main-contents'>
                <ReactQuery query={GET_USER_DATA(this.state.userId)}>
                    <ManageUserForm/>
                </ReactQuery>
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
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <ReactQuery query={GET_USERS}>
            <ManageUsersInner />
        </ReactQuery>
    </SecureRoute>
}

export default ManageUsers
