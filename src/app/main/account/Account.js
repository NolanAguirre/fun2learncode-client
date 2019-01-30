import React, { Component } from 'react'
import OrderHistory from '../orderHistory/OrderHistory'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, BasicPopup} from '../common/Common'
import moment from 'moment'
import PasswordReset from '../passwordReset/PasswordReset'
import './Account.css'
const RESET_PASSWORD = `mutation($password:String!){
  resetPassword(input:{arg0:$password,arg1:"BY USER"}){
    clientMutationId
  }
}`

class AccountInner extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        const user = this.props.getUserData;
        return <div className="container column section">
            <h2>My Account</h2>
            <div className='styled-container column'>
                <h3>Account Information</h3>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Name: </td>
                                <td>{user.firstName} {user.lastName}</td>
                            </tr>
                            <tr>
                                <td>Email: </td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td>Memeber since: </td>
                                <td>{moment(user.created_on).format('MMM, Do YYYY')}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <BasicPopup className="login-widget">
                                        <div className='space-around'>
                                            <h2 className='center-text no-margin'>Reset Password</h2>
                                            <PasswordReset mutation={RESET_PASSWORD}/>
                                        </div>
                                        <div style={{color:'blue'}}>Change Password</div>
                                    </BasicPopup>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='styled-container column'>
                <h2>Order History</h2>
                <OrderHistory userId={this.props.getUserData.id} />
            </div>
        </div>
    }
}

function Account(props){
    return <SecureRoute roles={["FTLC_USER"]}>
        <AccountInner />
    </SecureRoute>
}

export default Account
