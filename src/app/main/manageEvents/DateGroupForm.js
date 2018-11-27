import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './DateGroupForm.css';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import memoize from "memoize-one";
import Colors from '../calendar/Colors'
import EventsPreview from './EventsPreview';
import moment from 'moment';
import MutationHandler from '../queryHandler/MutationHandler';
const CREATE_DATE_GROUP = gql`
mutation($dateGroup:DateGroupInput!){
	createDateGroup(input:{dateGroup:$dateGroup}){
    dateGroup{
      id
      openRegistration
      closeRegistration
      event
	  name
    }
  }
}`;
function CreateDates(props) {
	const form = <table>
					<tbody>
						<tr>
							<td>Set Name:</td>
							<td><input className="full-date-input" name={"name"} value={props.name} onChange={props.handleChange}/></td>
						</tr>
						<tr>
							<td>Set Start:</td>
							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={props.open} onChange={(time) => {props.handleTimeChange(time, "open")}}/></td>
						</tr>
						<tr>
							<td>Set End:</td>
							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={props.close}  onChange={(time) => {props.handleTimeChange(time, "close")}}/></td>
						</tr>
						<tr>
							<td><button type="submit">Set</button></td>
						</tr>
					</tbody>
				</table>
    return (
        <div className="date-form">
			<MutationHandler refetchQueries={["eventsQuery"]} handleMutation={props.handleSubmit} mutation={CREATE_DATE_GROUP} form={form}/>
		</div>
	);
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
    handleTimeChange = (movement, name)=> {
        this.setState({[name]: movement})
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
