import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, BasicPopup} from '../common/Common'
import moment from 'moment'
import './OrderHistory.css'

const USER_DATA = id => `{
	allPayments(condition:{userId:"${id}"}, orderBy:CREATE_ON_DESC){
    nodes{
      nodeId
      id
      snapshot
      status
      createOn
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

function Order(props){
	const students = props.payment.snapshot.students.map((student)=>{
		return <div key={student.id}>
			{student.first_name} {student.last_name}
			<div className='margin-left-30'>
			{props.payment.snapshot.addons.map(addon=><div key={addon.id}>{addon.name}</div>)}
			</div>
		</div>
	})
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
				<button className='order-btn'>Request a refund</button>
			</div>
		</div>
    </div>
}

function OrderHistoryInner(props){
    const orders = props.allPayments.nodes.map((payment) => { return <Order key={payment.nodeId} payment={payment}/>})
	if(orders.length > 0){
		return <React.Fragment>{orders}</React.Fragment>
	}else{
		return <div>No orders found.</div>
	}
}

function OrderHistory(props){
    return <ReactQuery networkPolicy='network-only' query={USER_DATA(props.userId)}>
        <OrderHistoryInner />
    </ReactQuery>
}
export default OrderHistory
