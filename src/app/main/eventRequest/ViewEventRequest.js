import React, { Component } from 'react'
import axios from 'axios'
import './EventRequest.css'
import Popup from "reactjs-popup"
import xicon from '../../logos/x-icon.svg'

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
		return <React.Fragment>
			<Popup className='popup' open={this.state.showPopup} closeOnDocumentClick={false} onClose={this.clearPopupState}>
            <div className='popup-inner'>
                <div className='close-popup'>
                    <img onClick={this.clearPopupState} src={xicon}/>
                </div>
                <div className='login-container'>
					<h2 className='center-text'>Status: {this.props.status}</h2>
					<div>Refunded amount: {this.props.amountRefunded}$</div>
					<span>Reason for refund request:</span>
					<div id='refund-request-reason'>{this.props.reason}</div>
                    <span>Reason for refund decision:</span>
    				<div id='refund-request-reason'>{this.props.grantedReason}</div>
				</div>
            </div>
			</Popup>
            <div onClick={this.showPopup} className='center-text styled-button'>View refund Info</div>
		</React.Fragment>
	}
}

export default RefundRequest
