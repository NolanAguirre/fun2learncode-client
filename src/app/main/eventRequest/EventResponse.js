import React, { Component } from 'react'
import {GridView} from '../common/Common';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import './EventRequest.css'

const GET_REQUESTS = (userId) => `{
  allEventRequests(condition:{userId:"${userId}", status:PENDING}){
    nodes{
      id
      userId
      status
      information
      accessToken
    }
  }
}`

const UPDATE_EVENT_REQUEST = `mutation ($id:UUID!, $event: UUID, $accessToken: String, $status: RequestType!) {
  updateEventRequestById(input: {id:$id, eventRequestPatch: {event: $event, accessToken: $accessToken, status: $status}}) {
    eventRequest {
      id
      userId
      status
      accessToken
    }
  }
}`

class EventResponseInner extends Component{
	constructor(props){
		super(props);
		this.state = {grant:true, accessToken:'', event:'', error:''}
        this.mutation = new Mutation({
             mutation: UPDATE_EVENT_REQUEST,
             onSubmit: this.handleSubmit
         })
	}

	handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
		this.setState({[name]: value, error:undefined});
    }

    hasRequiredValues = () => {
        return (this.state.accessToken.length >= 20 && this.state.event.length === 36 && this.state.grant) || !this.state.grant
    }

	handleSubmit = (event) => {
		event.preventDefault();
		if(window.confirm('Are you sure? this account cannot be undone or edited after submission.') && this.hasRequiredValues()){
            return {
                id:this.props.id,
                accessToken:(this.state.accessToken==="")?null:this.state.accessToken,
                event:(this.state.event==="")?null:this.state.event,
                status: (this.state.grant)?'ACCEPTED':'DECLINED'
            }
		}
        this.setState({error:'Token must be at least 20 chars long, event must be full event id.'})
        return false

	}

	render = () => {
		return <div className='event-response'>
					<div>Event information:</div>
					<div>{this.props.information}</div>
					<div className='error center-text'>{this.state.error}</div>
					<form onSubmit={this.mutation.onSubmit} className='container column'>
                        <input autoComplete='off' className='styled-input' value={this.state.event} onChange={this.handleChange} name='event'placeholder='Event Id'/>
                        <input autoComplete="off" className='styled-input' value={this.state.accessToken} onChange={this.handleChange} name='accessToken'placeholder='Access Token'/>
                        <div>Grant:<input checked={this.state.grant} name='grant' type='checkbox'  onChange={this.handleChange}/></div>
						<div className='styled-button center-text margin-top-10' onClick={this.mutation.onSubmit}>Submit response</div>
						<button className='hacky-submit-button' type='submit'/>
					</form>
				</div>
	}
}

function Inbetween(props){
    return <GridView itemsPerRow={2} fillerStyle='event-response'>{props.allEventRequests.nodes.map((request)=> <EventResponseInner key={request.id} {...request}/>)}</GridView>
}

function EventResponse(props){
    return <ReactQuery query={GET_REQUESTS(props.userId)}>
        <Inbetween />
    </ReactQuery>
}

export default EventResponse
