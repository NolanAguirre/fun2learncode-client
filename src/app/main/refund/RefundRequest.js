import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {BasicPopup} from '../common/Common'
import axios from 'axios'
import './Refund.css'
import Popup from "reactjs-popup"

const CREATE_REFUND_REQUEST = `mutation($user:UUID!, $payment:UUID!, $reason:String!){
	createRefundRequest(input:{refundRequest:{reason:$reason, userId:$user, payment:$payment}}){
    refundRequest{
      nodeId
	  id
	  reason
	  status
	  createOn
	  paymentByPayment{
		  nodeId
	  }
    }
  }
}`

class RefundRequest extends Component{
	constructor(props){
		super(props);
		this.state = {reason:'',showPopup:false, error:''}
		this.mutation = new Mutation({
			mutation:CREATE_REFUND_REQUEST,
			onSubmit:this.handleSubmit,
			onResolve:this.clearPopupState
		})
	}
	showPopup = () => {
		this.setState({showPopup:true})
	}
	clearPopupState = () => {
		this.setState({showPopup:false})
	}
	handleReasonChange = (event) => {
        event.persist();
        this.setState({reason:event.target.textContent, error:''})
    }

	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.reason != ''){
			return {user:this.props.userId, payment:this.props.paymentId, reason:this.state.reason}
		}
		this.setState({error:'Please provide a reason for the refund.'})
		return false;
	}

	render = () => {
		return <React.Fragment>
			<Popup className='payment-overview-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
				<form className='login-widget' onSubmit={this.mutation.onSubmit}>
					<h2 className='center-text'>Estimated refund: {this.props.total}$</h2>
					<div className='error'>{this.state.error}</div>
					<span>Reason for refund:</span>
					<div id='refund-request-reason' onInput={this.handleReasonChange} className='styled-textarea' suppressContentEditableWarning={true} contentEditable></div>
					<span className='refund-footer'>Actual refund amounts may vary depending on promo code usage, distance from event start and other factors.</span>
					<div className='event-register-btn center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit for review</div>
					<button className='hacky-submit-button' type='submit'/>
				</form>
			</Popup>
            <div onClick={this.showPopup} className='center-text styled-button'>Request refund</div>
		</React.Fragment>
	}
}

export default RefundRequest
