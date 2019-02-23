import React from 'react'
import PasswordReset from '../passwordReset/PasswordReset'

const RESET_PASSWORD = (UID) => `mutation($password:String!){
  resetPassword(input:{arg0:$password,arg1:"${UID}"}){
    clientMutationId
  }
}`

function ResetPassword(props) {
    return <div className='login-container'>
        <div className='login-headers'>
            <h2>Reset Password</h2>
        </div>
        <PasswordReset mutation={RESET_PASSWORD(decodeURIComponent(props.match.params.token))} />
    </div>

}
export default ResetPassword
