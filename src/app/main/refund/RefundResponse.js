import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {BasicPopup} from '../common/Common'
import axios from 'axios'
import './Refund.css'
import Popup from "reactjs-popup"
import xicon from '../../logos/x-icon.svg'
class RefundResponse extends Component{
	constructor(props){
		super(props);
		this.state = {grantedReason:'', grant:false, amountRefunded:this.props.total, remove:true}
	}

    componentDidMount = () => {
        this.isMounted = true
    }

    componentWillUnmount = () => {
        this.isMounted = false
    }

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
			axios.post('http://localhost:3005/payment/refund', {
				grantReason:this.state.grantedReason,
				paymentId:this.props.paymentId,
				amount: (this.state.grant)?this.state.amountRefunded:0,
				unregister: this.state.remove,
                grant:this.state.grant
			})
		}
	}

	render = () => {
        if(this.state.complete){
            return <div className='refund-complete'>
                Refund request has been send.
            </div>
        }else{
            return <div className='payment-container'>
                    <div>Refund Status: {this.props.status}</div>
                    <div>Reason for refund:</div>
                    <div>{this.props.reason}</div>
                    <div className='error center-text'>{this.state.error}</div>
                    Reason for grant:
                    <textarea className='refund-textarea' value={this.state.grantReason} name='grantReason' onChange={this.handleChange}></textarea>
                    <form onSubmit={this.handleSubmit}>
                        <div style={{height:'40px'}}>

                            Grant:<input checked={this.state.grant} name='grant' type='checkbox'  onChange={this.handleChange}/>
                            {this.state.grant?
                                <React.Fragment>Amount:<input style={{width:'80px'}} type='number' name='amountRefunded' value={this.state.amountRefunded} onChange={this.handleChange}/> of {this.props.total}
                            </React.Fragment>:''}
                            {this.state.grant?<div>
                                Remove registration:<input checked={this.state.remove} name='remove' type='checkbox'  onChange={this.handleChange}/>
                            </div>:''}
                        </div>
                        <div className='styled-button center-text margin-top-10' onClick={this.handleSubmit}>Submit response</div>
                        <button className='hacky-submit-button' type='submit'/>
                    </form>
                </div>
        }

	}
}

export default RefundResponse
