import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView} from '../common/Common'
import Popup from "reactjs-popup";
import './ManageUsers.css'

const GET_USERS = `query{
  allUsers{
    nodes{
        id
      firstName
      lastName
      nodeId
    }
  }
}`

const CREATE_USER = `mutation($addon:CreateAddOnInput!){
  createAddOn(input:$addon){
    addOn{
      nodeId
      description
      id
      name
      price
      addOnJoinsByAddOn{
        nodes{
          nodeId
        }
      }
    }
  }
}`

const UPDATE_USER = `mutation($id:UUID!, $addon:AddOnPatch!){
  updateAddOnById(input:{id:$id, addOnPatch:$addon}){
    addOn{
      nodeId
      description
      id
      name
      price
      addOnJoinsByAddOn{
        nodes{
          nodeId
        }
      }
    }
  }
}`

class ManageUserPopup extends Component{
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
                            <td>Email: </td>
                            <td>Bob@gmail.com</td>
                        </tr>
                        <tr>
                            <td>Memeber since: </td>
                            <td>8/3/2004</td>
                        </tr>
                        <tr>
                            <td>role: </td>
                            <td>FTLC_USER</td>
                        </tr>
                    </tbody>
                </table>
                SEND EMAIL
                UPDATE ROLE
                RESET PASSWORD
            </div>
            <div>
                <h2>Billing</h2>
                ADD CREDIT
                VIEW HISTORY
            </div>
            <div>
                <h2>Registration history</h2>
                VIEW HISTORY
            </div>
            <div>
                <h2>Students</h2>
                REGISTER FOR CLASSES
                VIEW LOGS
            </div>
        </div>
    }
}

class ManageUserForm  extends Component{
    constructor(props){
        super(props)
        this.state = {
            showPopup:false
        }
    }

    showPopup = () => {
        this.setState({showPopup:true})
    }

    clearPopupState = () => {
        this.setState({showPopup:false})
    }

    render = () => {
        return <React.Fragment>
        <Popup
      open={this.state.showPopup}
      closeOnDocumentClick
      onClose={this.clearPopupState}>
      <ManageUserPopup firstName={this.props.firstName} lastName={this.props.lastName}/>
      </Popup>
        <div onClick={this.showPopup} className="manage-address-form-container">

            <h2 className="manage-address-form-header">{this.props.name}</h2>
            <span>{this.props.firstName} {this.props.lastName}</span>
        </div>
        </React.Fragment>
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
      console.log(this.props)
    const users = this.props.allUsers.nodes.map((user) =><ManageUserForm mutation={UPDATE_USER} key={user.id} id={user.id} firstName={user.firstName} lastName={user.lastName} />)
    return <div className="manage-addresses-container">
        <GridView className="manage-addresses-body" childStyle={'manage-address-form-container'} itemsPerRow={5}>{users}</GridView>
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
