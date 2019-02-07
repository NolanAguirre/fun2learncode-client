import React, { Component } from 'react'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'
import moment from 'moment'
import './OrderHistory.css'
import RefundRequest from '../refund/RefundRequest'
import RefundResponse from '../refund/RefundResponse'
import ViewRefund from '../refund/ViewRefund'

const USER_DATA = id => `{
	allPayments{
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
		  grantedReason
          status
          createdOn
        }
      }
    }
  }
}`

function Order(props){
	const students = props.payment.snapshot._students.map((student)=>{
		return <div key={student.id}>
			{student.first_name} {student.last_name}
			<div className='margin-left-30'>
			{props.payment.snapshot._addons.map(addon=><div key={addon.id}>{addon.name}</div>)}
			</div>
		</div>
	})
	let refundRequest = props.payment.refundRequestsByPayment.nodes[0]
	let requestForm;
	if(props.adminForm){
		if(refundRequest){
			if(refundRequest.status === 'PENDING'){
				requestForm = <RefundResponse{...refundRequest} userId={props.payment.userId} paymentId={props.payment.id} total={parseFloat(props.payment.snapshot.total)}/>
			}else{
				requestForm = <div>{JSON.stringify(refundRequest)}</div>
			}
		}
	}else{
		requestForm = <React.Fragment>{refundRequest?<span>Refund {refundRequest.status.toLowerCase()}.</span>:
		<RefundRequest total={props.payment.snapshot.total} userId={props.payment.userId} paymentId={props.payment.id}/>}</React.Fragment>
	}
    return <div className='order-container'>
		<div className='order-header'>
			<h3 className='no-margin'>{moment(props.payment.createOn).format('MMMM, Do YYYY')}</h3>
			<span>Order # {props.payment.id}</span>
		</div>
		<div className='order-body'>
			<div>
				{requestForm}
			</div>
			<div>

			</div>
			<div>
				<div>Placed at: {moment(props.payment.createOn).format('h:mm a')}</div>
				<div>Total: {props.payment.snapshot.total}</div>
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

class OrderHistory extends Component{
	constructor(props){
		super(props);
		this.state = {show:false}
	}
	showHistory = () => {
		this.setState({show:true})
	}
	render = () => {
		if(this.state.show){
			return <ReactQuery query={USER_DATA(this.props.userId)}>
				<OrderHistoryInner {...this.props}/>
			</ReactQuery>
		}
		return <div className='show-order-history-btn-container'>
			<div className='event-register-btn center-text' onClick={this.showHistory}>View order history</div>
		</div>

	}
}
export default OrderHistory
