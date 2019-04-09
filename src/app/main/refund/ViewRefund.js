import React, { Component } from 'react'
import axios from 'axios'
import './Refund.css'
import Popup from "reactjs-popup"
import xicon from '../../logos/x-icon.svg'

function ViewRequest(props){
    let child
    if(props.status === 'PENDING'){
        child = <div> Reason for refund request: <br/>
            {props.reason}
        </div>
    }else{
        child = <React.Fragment>
        <div>Refunded amount: ${props.amountRefunded}</div>
        <span>Reason for refund request:</span>
        <div>{props.reason}</div>
        <span>Reason for refund decision:</span>
        <div>{props.grantedReason}</div>
        </React.Fragment>
    }
	return <div className='payment-container'>
            <h2 className='center-text'>Status: {props.status}</h2>
            {child}
        </div>
}

export default ViewRequest
