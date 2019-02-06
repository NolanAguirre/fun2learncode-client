import React, { Component } from 'react'
import './ManageAnnouncements.css'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'
import DateTime from 'react-datetime';
import Mutation from '../../../delv/Mutation'
import moment from 'moment'

const CREATE_ANNOUNCEMENT = `mutation($announcement:AnnouncementInput!){
  createAnnouncement(input:{announcement:$announcement}){
    clientMutationId
  }
}`

class ManageAnnouncementsInner extends Component{
    constructor(props){
        super(props)
        this.state = {
            title: '',
            message: '',
            startDisplay: moment(),

        }
        this.mutation = new Mutation({
            mutation:CREATE_ANNOUNCEMENT,
            onSubmit:this.handleSubmit
        })
    }

    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }

    handleContentEditableChange = (event) => {
        event.persist();
        this.setState({message:event.target.textContent})
    }

    handleChange = (event) => {
      const target = event.target
      const value = target.type === 'checkbox'
        ? target.checked
        : target.value
      const name = target.name
      this.setState({[name]:value})
    }

    hasRequiredValues = () =>{
        return this.state.title != "" &&
               this.state.message != "" &&
               this.state.startDisplay
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            if(window.confirm('Please proof read the announcement message, it cannot be changed later')){
                return {announcement:this.state}
            }
        }
        return false
    }

    render = () => {
        return <form className="styled-container main-contents column" onSubmit={this.mutation.onSubmit}>
                <div className='center-x'>
                    <input className='announcement-title-input' name="title" onChange={this.handleChange} value={this.state.title} placeholder='Title' />
                </div>
                <div className='container'>
                    Make public on:
                    <DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={this.state.startDisplay} onChange={(time) => {this.handleTimeChange("startDisplay", time)}}/>
                </div>
                <h3 className='no-margin'>Announcement message:</h3>
                <div id='message' onInput={this.handleContentEditableChange} className="styled-textarea" suppressContentEditableWarning={true} contentEditable></div>
                <div className='event-register-btn center-text margin-top-40' onClick={this.mutation.onSubmit}>Create</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>

    }
}

function ManageAnnouncements(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <ManageAnnouncementsInner />
    </SecureRoute>
}

export default ManageAnnouncements
