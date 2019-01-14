import React, { Component } from 'react'
import OrderHistory from '../orderHistory/OrderHistory'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'

class AccountInner extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        return <div className="container column">
            <h2>My Account</h2>
            <div className='styled-container'>
                <h3>Account Information</h3>
                {JSON.stringify(this.props.getUserData)}
            </div>
            <div className='styled-container'>
                <h3>Order History</h3>
                <OrderHistory user={this.props.getUserData.id} />
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
