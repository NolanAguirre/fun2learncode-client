import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {BasicPopup} from '../common/Common'
import axios from 'axios'
import './Refund.css'
import Popup from "reactjs-popup"
import xicon from '../../logos/x-icon.svg'

const UPDATE_CACHE = (id) => `{
  allRefundRequests (condition:{id:"${id}"}){
    nodes {
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

const REFUND_RESPONSE = `mutation($grantedReason:String!, $paymentId:UUID!, $amount:Float!, $unregister:Boolean!, $grant:Boolean!){
  refundTransaction(grantedReason:$grantedReason, paymentId:$paymentId, amount:$amount, unregister:$unregister, grant:$grant)
}`


class RefundResponse extends Component{
	constructor(props){
		super(props);
		this.state = {grantedReason:'', grant:false, amount:this.props.total, unregister:true}
        this.mutation = new Mutation({
            mutation:REFUND_RESPONSE,
            onSubmit:this.handleSubmit,
            onResolve:this.handleResolve
        })
	}
    componentWillUnmount = () => this.mutation.removeListeners()
	handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
		if(name === 'amountRefunded' && (value > this.props.total ||  value < 0)){
			return;
		}
		this.setState({[name]: value, error:undefined});
    }

	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.grantedReason === ''){
			this.setState({error:`Please provide a reason, such as "Full refund granted"`})
			return
		}
		if(this.state.grant && this.state.amountRefunded < 1){
			this.setState({error:'Cannot grant refund for less than one dollar.'})
			return
		}
		if(window.confirm('Are you sure? this account cannot be undone or edited after submission.')){
            return {paymentId:this.props.paymentId,...this.state}
		}
        return false
	}

    handleResolve = (data, error) => {
        console.log(data)
        if(error){

        }else{
            return UPDATE_CACHE(data.refundTransaction)
        }
    }

	render = () => {
        console.log(this.props)
        if(this.state.complete){
            return <div className='popup-inner-complete'>
                Refund request has been send.
            </div>
        }else{
            return <form className='payment-container' onSubmit={this.mutation.onSubmit}>
                        <div>Refund Status: {this.props.status}</div>
                        <div>Reason for refund:</div>
                        <div>{this.props.reason}</div>
                        <div className='error center-text'>{this.state.error}</div>
                        Reason for grant:
                        <textarea className='refund-textarea' value={this.state.grantedReason} name='grantedReason' onChange={this.handleChange}></textarea>
                        <div style={{height:'40px'}}>

                            Grant:<input checked={this.state.grant} name='grant' type='checkbox'  onChange={this.handleChange}/>
                            {this.state.grant?
                                <React.Fragment>Amount:<input style={{width:'80px'}} type='number' name='amount' value={this.state.amount} onChange={this.handleChange}/> of {this.props.total}
                            </React.Fragment>:''}
                            {this.state.grant?<div>
                                Unregister:<input checked={this.state.unregister} name='unregister' type='checkbox'  onChange={this.handleChange}/>
                            </div>:''}
                        </div>
                        <div className='styled-button center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit response</div>
                        <button className='hacky-submit-button' type='submit'/>
                    </form>
        }
	}
}

export default RefundResponse
