import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {DropDown, BasicPopup, SecureRoute, GridView} from '../common/Common';
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment';
import OrderHistory from '../orderHistory/OrderHistory'
import './ManageUsers.css'
import alert from '../../logos/alert.svg'
const GET_USERS = `{
  allUsers{
    nodes{
      id
      firstName
      lastName
      createdOn
      email
      role
      nodeId
      refundRequestsByUserId(condition:{status:PENDING}){
        nodes{
          id
          status
          nodeId
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
            promote:this.props.role,
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
        return <div>
        <h1>{this.props.firstName} {this.props.lastName}</h1>
            <div>
                <h2>Account</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Name: </td>
                            <td>{this.props.firstName} {this.props.lastName}</td>
                        </tr>
                        <tr>
                            <td>ID: </td>
                            <td>{this.props.id}</td>
                        </tr>
                        <tr>
                            <td>Email: </td>
                            <td>{this.props.email}</td>
                        </tr>
                        <tr>
                            <td>Memeber since: </td>
                            <td>{moment(this.props.createdOn).format('MMM, Do YYYY')}</td>
                        </tr>
                        <tr>
                            <td>role: </td>
                            <td>{this.props.role}</td>
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
                <OrderHistory userId={this.props.id}/>
            </div>
            {this.props.students.length > 0?<div>
                <h2>Students</h2>
                <DropDown options={this.props.students} value={this.state.student} name='student' onChange={this.handleChange} />
            </div>:<div>
            <h2>This user has no students</h2>
        </div>}
        </div>
    }
}

class ManageUsersInner extends Component {
  constructor (props) {
    super(props)
  }
  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value
    const name = target.name
    this.setState({ [name]: value })
  }
  render = () => {
    const users = this.props.allUsers.nodes.map((user) =>{
        const students = user.studentsByParent.nodes.map((student)=>{
            return{
                name: `${student.firstName} ${student.lastName}`,
                value: student.id
            }
        })
        const showAlert = user.refundRequestsByUserId.nodes.length > 0
        return <BasicPopup key={user.id} buttonClassName="grid-item-container">
            <ManageUserForm
                id={user.id}
                email={user.email}
                createdOn={user.createdOn}
                firstName={user.firstName}
                lastName={user.lastName}
                role={user.role}
                students={students}
                hasRefundRequest={user.refundRequestsByUserId.nodes.length > 0}/>
                <React.Fragment>
                    <div className='user-btn'>
                        <span>{user.firstName} {user.lastName}</span>
                        {showAlert?<img src={alert} className='alert-logo'/>:''}
                    </div>
                </React.Fragment>
        </BasicPopup>
            })
    return <div className="main-contents container column">
        <GridView className="container column" fillerStyle={'grid-item-container'} itemsPerRow={5}>{users}</GridView>
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
