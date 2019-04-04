import React, {Component} from 'react'

function CreateAccount(props){
    return <div>
        <h2>Create card management account.</h2>
        <div></div>
        <button onClick={props.createAccount}>Create</button>
    </div>
}

export default CreateAccount
