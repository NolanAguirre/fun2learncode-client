import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'

const USER_DATA = `{
    getUserData{
        nodeId
        id
        firstName
        lastName
        role
    }
}`

class AccountInner extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        return <div>{JSON.stringify(this.props.getUserData)}</div>
    }
}

class Account extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        return <SecureRoute ignoreResult roles={["FTLC_USER"]}>
            <ReactQuery query={USER_DATA}>
                <AccountInner />
            </ReactQuery>
        </SecureRoute>
    }
}

export default Account
