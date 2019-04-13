import React, { Component } from 'react'
import {ReactQuery} from '../../../delv/delv-react'
import moment from 'moment'
import './OrderHistory.css'
import RefundRequest from '../refund/RefundRequest'
import RefundResponse from '../refund/RefundResponse'
import ViewRefund from '../refund/ViewRefund'
import QueryFullEvent from '../events/event/QueryFullEvent'
const USER_DATA = id => `{
  allPayments(condition: {userId: "${id}"}) {
    nodes {
      id
      snapshot
      status
      createOn
      userId
      refundRequestsByPayment {
        nodes {
          id
          reason
          amountRefunded
          grantedReason
          status
          createdOn
        }
      }
    }
  }
}`

function OrderRow(props){
    return<tr>
        <td>{props.name}</td>
        <td>{props.item}</td>
        <td className='order-row-price'>{props.cost.toFixed(2)}</td>
    </tr>
}

function Order(props){
	const snapshot = props.payment.snapshot
    const userId = props.payment.userId
    const paymentId = props.payment.id
    const event = snapshot._event
    const pc = snapshot._promoCode
	let refundRequest = props.payment.refundRequestsByPayment.nodes[0]
	let requestForm
    let refundAmount = 0;
	if(props.adminForm){
		if(refundRequest && refundRequest.status !== 'PENDING'){
            requestForm = <div onClick={()=>{props.popup.open(<ViewRefund {...refundRequest}/>)}} className='styled-button'>View Refund</div>
            refundAmount = refundRequest.amountRefunded
		}else{
            let refundPopup = ()=>{props.popup.open(
                <RefundResponse {...refundRequest} userId={userId} paymentId={paymentId} total={parseFloat(snapshot.total)}/>
            )}
            if(refundRequest && refundRequest.status === 'PENDING'){
                requestForm = <div onClick={refundPopup} className='styled-button'>Respond to request</div>
            }else{
                requestForm = <div onClick={refundPopup} className='styled-button'>Issue refund</div>
            }
        }
	}else{
        if(!refundRequest){
            requestForm = <div onClick={()=>{props.popup.open(<RefundRequest total={snapshot.total} userId={userId} paymentId={paymentId}/>)}} className='styled-button'>Request Refund</div>
        }else if(refundRequest.state === 'PENDING'){
            requestForm = <span>Refund {refundRequest.status.toLowerCase()}.</span>
        }else{
            requestForm = <div onClick={()=>{props.popup.open(<ViewRefund {...refundRequest}/>)}} className='styled-button'>View Refund</div>
            refundAmount = refundRequest.amountRefunded
        }
	}
    let orderTable = []
    let x = 0;
    snapshot._students.forEach((s)=>{
        let price = event.price
        orderTable.push(<OrderRow key={x++} name={s.first_name} item={snapshot._activity.name} cost={price}/>)
        if(s.price){
            orderTable.push(<OrderRow key={x++} name={s.firstName} item={'Override'} cost={-(price - s.price)}/>)
        }
        if(pc){ //TODO verify this works
            if(pc.percent){
                price = (pc.effect/100) * s.price || price
            }else{
                price = -pc.effect
            }
            orderTable.push(<OrderRow key={x++} name={''} item={'Promo Code'} cost={price}/>)
        }
        snapshot._addons.forEach((a)=>{
            orderTable.push(<OrderRow key={x++} name={s.first_name} item={a.name} cost={a.price}/>)
        })
    })
    if(refundAmount){
        orderTable.push(<OrderRow key={x++} name={''} item={'refund'} cost={-1 * refundAmount.toFixed(2)}/>)
    }
    const fullEventPopup = ()=>{props.popup.open(<QueryFullEvent eventId={event.id} />)}
        return <div className='order-container'>
		<div className='order-header'>
			<h3 className='no-margin'>{moment(props.payment.createOn).format('MMMM, Do YYYY')}</h3>
			<span>Order # {paymentId}</span>
		</div>
    		<div className='order-body'>
            <div>
                <table className='order-table'>
                    <tbody>
                        <tr>
                            <th>Student</th>
                            <th>Item</th>
                            <th>Price</th>
                        </tr>
                        {orderTable}
                        <tr>
                            <td></td>
                            <td>Total:</td>
                            <td className='order-row-price'>${snapshot.total - refundAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
			<div className='float-down'>
				{requestForm}
			</div>
			<div className='float-down'>
                <div onClick={fullEventPopup} className='styled-button'>View event details</div>
			</div>
		</div>
    </div>
}

function OrderHistoryInner(props){
	let {allPayments, ...otherProps} = props
    const orders = allPayments.nodes
            .sort((a,b)=> moment(b.createOn).unix() - moment(a.createOn).unix())
            .map((payment) => { return <Order key={payment.id} payment={payment} {...otherProps}/>})

	if(orders.length > 0){
		return <React.Fragment>{orders}</React.Fragment>
	}else{
		return <div>No orders found.</div>
	}
}

function StatelessOrderHistory(props){
    return <ReactQuery query={USER_DATA(props.userId)}>
        <OrderHistoryInner {...props}/>
    </ReactQuery>
}

export {StatelessOrderHistory}

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
			<div className='styled-button center-text' onClick={this.showHistory}>View order history</div>
		</div>

	}
}
export {OrderHistory}
