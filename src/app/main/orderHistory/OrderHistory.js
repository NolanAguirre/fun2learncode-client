import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, BasicPopup} from '../common/Common'
import moment from 'moment'
import './OrderHistory.css'
import Popup from "reactjs-popup"

const USER_DATA = id => `{
	allPayments(condition:{userId:"${id}"}){
    nodes{
      nodeId
      id
      snapshot
      status
      createOn
	  userId
      refundRequestsByPayment{
        nodes{
          nodeId
          id
          reason
          status
          createdOn
        }
      }
    }
  }
}`

const CREATE_REFUND_REQUEST = `mutation($user:UUID!, $payment:UUID!, $reason:String!){
	createRefundRequest(input:{refundRequest:{reason:$reason, userId:$user, payment:$payment}}){
    refundRequest{
      nodeId
    }
  }
}`

class RefundForm extends Component{
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
					<div id='refund-request-reason' onInput={this.handleReasonChange} className="manage-activity-textarea" suppressContentEditableWarning={true} contentEditable></div>
					<span className='refund-footer'>Actual refund amounts may vary depending on promo code usage, distance from event start and other factors.</span>
					<div className='event-register-btn center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit for review</div>
					<button className='hacky-submit-button' type='submit'/>
				</form>
			</Popup>
            <div onClick={this.showPopup}>Request a refund</div>
		</React.Fragment>
	}
}

class AdminRefundFrom extends Component{
	constructor(props){
		super(props);
	}
	showPopup = () => {
		this.setState({showPopup:true})
	}
	clearPopupState = () => {
		this.setState({showPopup:false})
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
					<h2 className='center-text'>Refund Status: {this.props.status}$</h2>
					<span>Reason for refund:</span>
					<div>this.props.reason</div>
					<input></input>
					<div className='event-register-btn center-text margin-top-10' onClick={this.mutation.onSubmit}>Grant Refund</div>
					<button className='hacky-submit-button' type='submit'/>
				</form>
			</Popup>
            <div onClick={this.showPopup}>View refund request</div>
		</React.Fragment>
	}
}

function Order(props){
	const students = props.payment.snapshot.students.map((student)=>{
		return <div key={student.id}>
			{student.first_name} {student.last_name}
			<div className='margin-left-30'>
			{props.payment.snapshot.addons.map(addon=><div key={addon.id}>{addon.name}</div>)}
			</div>
		</div>
	})
	let refundRequest = props.payment.refundRequestsByPayment.nodes
	if(refundRequest.length === 1){
		refundRequest = refundRequest[0].status;
	}
	let requestForm;
	if(props.adminForm && refundRequest){
		//requestForm = <admin>
	}else{
		requestForm = <React.Fragment>{refundRequest?<span>Refund {refundRequest.toLowerCase()}.</span>:
		<RefundForm total={props.payment.snapshot.payment.total/100} userId={props.payment.userId} paymentId={props.payment.id}/>}</React.Fragment>
	}
    return <div className='margin-left-30 container column'>
		<div className='order-header'>
			<div><h3 className='no-margin'>{moment(props.payment.createOn).format('MMMM, Do YYYY')}</h3></div>
			<div><span>Order # {props.payment.id}</span></div>
		</div>
		<div className='container section'>
			<div className='padding-10 section'>
				<h4 className='no-margin'>{props.payment.snapshot.activity.name}</h4>
				<div className='margin-left-30'>
					{students}
				</div>
			</div>
			<div className='container column padding-10'>
				<BasicPopup>
					<div></div>
					<div className='order-btn'>Event Details</div>
				</BasicPopup>
				<BasicPopup>
					<div>{JSON.stringify(props.payment.snapshot)}</div>
					<div className='order-btn'>Order Details</div>
				</BasicPopup>

			</div>
		</div>
    </div>
}

function OrderHistoryInner(props){
	let {allPayments, ...otherProps} = props
    const orders = props.allPayments.nodes.map((payment) => { return <Order key={payment.nodeId} payment={payment} {...otherProps}/>})
	if(orders.length > 0){
		return <React.Fragment>{orders}</React.Fragment>
	}else{
		return <div>No orders found.</div>
	}
}

function OrderHistory(props){
    return <ReactQuery query={USER_DATA(props.userId)}>
        <OrderHistoryInner {...props}/>
    </ReactQuery>
}
export default OrderHistory
