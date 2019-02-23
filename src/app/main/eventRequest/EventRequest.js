import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {BasicPopup} from '../common/Common'
import axios from 'axios'
import './EventRequest.css'
import Popup from "reactjs-popup"

const CREATE_EVENT_REQUEST = `mutation($information:String!){
	createEventRequest(input:{eventRequest:{information:$information}}){
    clientMutationId
  }
}`

class EventRequest extends Component{
	constructor(props){
		super(props);
		this.state = {infomation:'', showPopup:false, error:''}
		this.mutation = new Mutation({
			mutation:CREATE_EVENT_REQUEST,
			onSubmit:this.handleSubmit,
			onResolve:this.clearPopupState
		})
	}
	componentWillUnmount = () => this.mutation.removeListeners()
	showPopup = () => this.setState({showPopup:true})
	clearPopupState = () => this.setState({showPopup:false})

	handleInformationChange = (event) => {
        event.persist();
        this.setState({information:event.target.textContent, error:''})
    }

	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.information){
			return {information:this.state.infomation}
		}
		this.setState({error:'Please provide a information for the event.'})
		return false;
	}

	render = () => {
		return <React.Fragment>
			<Popup className='payment-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
				<form className='login-container' onSubmit={this.mutation.onSubmit}>
					<h2 className='center-text'>Event Request</h2>
					<div className='error'>{this.state.error}</div>
					<div>Event details:</div>
					<div id='refund-request-reason' onInput={this.handleInformationChange} className='styled-textarea' suppressContentEditableWarning={true} contentEditable></div>
					<span className='refund-footer'>Include desired price (paid in full by requestee), location, time and general description.</span>
					<div className='event-register-btn center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit for review</div>
					<button className='hacky-submit-button' type='submit'/>
				</form>
			</Popup>
            <div onClick={this.showPopup} className='center-text styled-button'>Request Event</div>
		</React.Fragment>
	}
}

export default EventRequest
