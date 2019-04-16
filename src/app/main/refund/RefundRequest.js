import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import axios from 'axios'
import './Refund.css'

const CREATE_REFUND_REQUEST = `mutation($payment:UUID!, $reason:String!){
	createRefundRequest(input:{refundRequest:{reason:$reason, payment:$payment}}){
    refundRequest{
	  id
      reason
      amountRefunded
      grantedReason
      status
      createdOn
	  paymentByPayment{
		  id
	  }
    }
  }
}`

class RefundRequest extends Component{
	constructor(props){
		super(props);
		this.state = {reason:'', error:'', complete:false}
		this.mutation = new Mutation({
			mutation:CREATE_REFUND_REQUEST,
			onSubmit:this.handleSubmit,
            onResolve:this.onResolve
		})
	}
    componentWillUnmount = () => this.mutation.removeListeners()
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.reason){
			return {payment:this.props.paymentId, reason:this.state.reason}
		}
		this.setState({error:'Please provide a reason for the refund.'})
		return false;
	}
    onResolve = (data) => {
        if(data.error){
            this.setState({complete:true, error:data.error})
        } else {
            this.setState({complete:true})
        }
    }

	render = () => {
        if(this.state.complete){
            return <div className='popup-inner-complete'>
                Refund request has been send.
            </div>
        }else{
            return <form className='payment-container' onSubmit={this.mutation.onSubmit}>
                    <h2 className='center-text'>Estimated refund: ${this.props.total}</h2>
                    <div className='error'>{this.state.error}</div>
                    <span>Reason for refund:</span>
                    <textarea className='refund-textarea' value={this.state.reason} name='reason' onChange={this.handleChange}></textarea>
                    <span className='refund-footer'>Actual refund amounts may vary depending on promo code usage, distance from event start and other factors.</span>
                    <div className='styled-button center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit for review</div>
                    <button className='hacky-submit-button' type='submit'/>
                </form>
        }
	}
}

export default RefundRequest
