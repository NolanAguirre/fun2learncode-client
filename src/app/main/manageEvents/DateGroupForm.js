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
    }
  }
}`;
function CreateDates(props) {
	const form = <table>
					<tbody>
						<tr>
							<td>Open Group On:</td>
							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={props.open} onChange={(time) => {props.handleTimeChange(time, "open")}}/></td>
						</tr>
						<tr>
							<td>Close Group On:</td>
							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={props.close}  onChange={(time) => {props.handleTimeChange(time, "close")}}/></td>
						</tr>
						<tr>
							<td><button type="submit">Create</button></td>
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
            open: new Date(),
            close: new Date(+ new Date() + 86400000),
            displayForm: false
        }
    }
    handleTimeChange = (movement, name)=> {
        this.setState({[name]: movement})
    }
    handleSubmit = (event, mutation) => {
        event.preventDefault();
        let dateGroup={
            event: this.props.eventId,
            openRegistration: this.state.open,
            closeRegistration: this.state.close
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
                    handleTimeChange={this.handleTimeChange}
                    createDateGroup={this.createDateGroup}
                    handleSubmit={this.handleSubmit}/>:
                    <div className="event-preview-event-button" onClick={this.displayForm}>New Date Group</div>
            }
        </div>)
    }
}
export default DateGroupForm;
