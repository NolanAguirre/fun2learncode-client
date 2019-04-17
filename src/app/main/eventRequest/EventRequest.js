import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import './EventRequest.css'


const CREATE_EVENT_REQUEST = `mutation($information:String!){
	createEventRequest(input:{eventRequest:{information:$information}}){
    clientMutationId
  }
}`

class EventRequest extends Component{
	constructor(props){
		super(props);
		this.state = {infomation:'', showPopup:false, error:'', complete:false}
		this.mutation = new Mutation({
			mutation:CREATE_EVENT_REQUEST,
			onSubmit:this.handleSubmit,
			onResolve:this.handleResolve
		})
	}
	componentWillUnmount = () => this.mutation.removeListeners()
	showPopup = () => this.setState({showPopup:true})
	clearPopupState = () => this.setState({showPopup:false, complete:false})

    handleResolve = (data) => {
        this.setState({complete:true})
    }

    handleInputChange = event => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({[name]: value})
    }
	handleSubmit = (event) => {
		event.preventDefault();
		if(this.state.information){
			return {information:this.state.information}
		}
		this.setState({error:'Please provide a information for the event.'})
		return false;
	}

	render = () => {
        let child
        if(this.state.complete){
            return  <div className='popup-inner-complete'>Event request has been made. Response will be sent via email.</div>
        }else{
            return <div className='payment-container'>
                <form className='login-form' onSubmit={this.mutation.onSubmit}>
                    <h2 className='event-request-header'>Event Request</h2>
                    <div className='error'>{this.state.error}</div>
                    <div>Event details:</div>
                    <textarea name='information' value={this.state.information} onChange={this.handleInputChange} className='activity-description-textarea'/>
                    <span className='refund-footer'>Include desired price (paid in full by requestee), location, time and general description.</span>
                    <div className='styled-button center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit for review</div>
                    <button className='hacky-submit-button' type='submit'/>
                </form>
            </div>
        }
	}
}

export default EventRequest
