import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './DateGroupForm.css';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import Colors from '../calendar/Colors'
import EventsPreview from './EventsPreview';
import moment from 'moment';
import MutationHandler from '../queryHandler/MutationHandler';
//TODO move mutation into mutations, make update feature, update cache
const CREATE_DATE_GROUP = gql`mutation($dateGroup:DateGroupInput!){
  createDateGroup(input:{dateGroup:$dateGroup}){
    dateGroup{
		nodeId
        id
        name
        openRegistration
        closeRegistration
        datesJoinsByDateGroup {
          nodes {
            nodeId
            id
            dateInterval
            dateIntervalByDateInterval {
              id
              nodeId
              start
              end
            }
          }
        }
        eventByEvent {
          addressByAddress {
            alias
            nodeId
            id
          }
          openRegistration
          closeRegistration
          nodeId
          id
          activityByEventType {
            name
            id
            nodeId
          }
        }
    }
  }
}`;

function CreateDates(props) {
    return <div className="date-form">
			<MutationHandler refetchQueries={["adminEvents"]} handleMutation={props.handleSubmit} mutation={CREATE_DATE_GROUP}>
				<table>
					<tbody>
						<tr>
							<td>Set Name:</td>
							<td><input className="full-date-input" name={"name"} value={props.name} onChange={props.handleChange}/></td>
						</tr>
						<tr>
							<td>Set Start:</td>
							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={props.open} onChange={(time) => {props.handleTimeChange("open", time)}}/></td>
						</tr>
						<tr>
							<td>Set End:</td>
							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={props.close}  onChange={(time) => {props.handleTimeChange("close", time)}}/></td>
						</tr>
						<tr>
							<td><button type="submit">Set</button></td>
						</tr>
					</tbody>
				</table>
			</MutationHandler>
		</div>
}

class DateGroupForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
			name:"",
            open: new Date() || this.props.open,
            close: new Date(+ new Date() + 86400000) || this.props.close,
            displayForm: false
        }
    }
	handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }
	handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    handleSubmit = (event, mutation) => {
        event.preventDefault();
        let dateGroup={
            event: this.props.eventId,
            openRegistration: this.state.open.toISOString(),
            closeRegistration: this.state.close.toISOString(),
			name: this.state.name
        }
        mutation({
            variables: {"dateGroup":dateGroup}
        });
		this.setState({displayForm:false});
    }
    displayForm = () =>{
        this.setState({displayForm:true});
    }
    render() {
        return (
        <div className="manage-events-event-preview">
            {
                (this.state.displayForm)?
                    <CreateDates
                    open={this.state.open}
                    close={this.state.close}
					name={this.state.name}
                    handleTimeChange={this.handleTimeChange}
					handleChange={this.handleChange}
                    createDateGroup={this.createDateGroup}
                    handleSubmit={this.handleSubmit}/>:
                    <div className="event-preview-event-button" onClick={this.displayForm}>New Date Group</div>
            }
        </div>)
    }
}

export default DateGroupForm;


// delete from ftlc.date_group;
//
// delete from ftlc.events;
//
// delete from ftlc.activities;
