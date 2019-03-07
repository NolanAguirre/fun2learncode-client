import React, { Component } from 'react'
import axios from 'axios'
import './Refund.css'
import Popup from "reactjs-popup"


class RefundRequest extends Component{
	constructor(props){
		super(props);
        this.state = {showPopup:false}
	}
	showPopup = () => {
		this.setState({showPopup:true})
	}
	clearPopupState = () => {
		this.setState({showPopup:false})
	}

	render = () => {
        let child
        if(this.props.status === 'PENDING'){
            child =<React.Fragment>
            <span>Reason for refund request:</span>
            <div id='refund-request-reason'>{this.props.reason}</div>
            </React.Fragment>
        }else{
            child = <React.Fragment>
            <div>Refunded amount: {this.props.amountRefunded}$</div>
            <span>Reason for refund request:</span>
            <div id='refund-request-reason'>{this.props.reason}</div>
            <span>Reason for refund decision:</span>
            <div id='refund-request-reason'>{this.props.grantedReason}</div>
            </React.Fragment>
        }
		return <React.Fragment>
			<Popup className='payment-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
				<div className='login-container'>
					<h2 className='center-text'>Status: {this.props.status}</h2>
                    {child}
				</div>
			</Popup>
            <div onClick={this.showPopup} className='center-text styled-button'>View refund Info</div>
		</React.Fragment>
	}
}

export default RefundRequest
