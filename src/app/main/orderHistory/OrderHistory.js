import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'
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
				<button className='order-btn'>Event Details</button>
				<button className='order-btn'>Order Details</button>
				<button className='order-btn'>Request a refund</button>
			</div>
		</div>
    </div>
}

function OrderHistoryInner(props){
    const orders = props.allPayments.nodes.map((payment) => { return <Order key={payment.nodeId} payment={payment}/>})
    return <React.Fragment>{orders}</React.Fragment>
}

function OrderHistory(props){
    return <ReactQuery networkPolicy='network-only' query={USER_DATA(props.user)}>
        <OrderHistoryInner />
    </ReactQuery>
}
export default OrderHistory
