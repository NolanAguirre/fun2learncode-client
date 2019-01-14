import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'
import moment from 'moment'
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
    return <div>
        <h3 className='no-margin'>{props.payment.snapshot.dateGroup.name}</h3>
        <div>{moment(props.payment.createOn).format('MMMM, Do YYYY h:mm a')} Order number:{props.payment.id}</div>
        {JSON.stringify(props.payment.snapshot)}
    </div>
}

function OrderHistoryInner(props){
    const orders = props.allPayments.nodes.map((payment) => { return <Order key={payment.nodeId} payment={payment}/>})
    return <div>{orders}</div>
}

function OrderHistory(props){
    return <ReactQuery networkPolicy='network-only' query={USER_DATA(props.user)}>
        <OrderHistoryInner />
    </ReactQuery>
}
export default OrderHistory
