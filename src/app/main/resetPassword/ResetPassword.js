import React, { Component } from 'react'
import {ReactQuery} from '../../../delv/delv-react'
import PasswordReset from '../passwordReset/PasswordReset'

const RESET_PASSWORD = (UID) => `mutation($password:String!){
  resetPassword(input:{arg0:$password,arg1:"${UID}"}){
    clientMutationId
  }
}`

class ResetPassword extends Component{
    constructor(props){
        super(props);
        this.state = {password:'', repeatPassword:''}
    }
    render = () => {
        return <div className='container section'>
            <div className='login-container'>
              <div className='login-widget'>
                  <div className='login-headers'>
                    <h2>Reset Password</h2>
                  </div>
                  <PasswordReset className="margin-top-40" mutation={RESET_PASSWORD(decodeURIComponent(this.props.match.params.token))} />
              </div>
            </div>
        </div>
    }
}
export default ResetPassword
