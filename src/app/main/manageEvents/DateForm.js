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

function CreateDate(props) {
    return (
        <div className="date-form">
			<form onSubmit={(e) => {props.handleSubmit(e)}}>
                <table>
                    <tbody>
                        <tr>
                            <td>Event Start Time:</td>
                            <td><DateTime className="time-input" dateFormat={false} value={props.start} onChange={(time) => {props.handleTimeChange(time, "start")}}/></td>
                        </tr>
                        <tr>
                            <td>Event End Time:</td>
                            <td><DateTime className="time-input" value={props.end} dateFormat={false} onChange={(time) => {props.handleTimeChange(time, "end")}}/></td>
                        </tr>
						<tr>
							<td><button type="submit">Set</button></td>
						</tr>
                    </tbody>
                </table>
            </form>
		</div>
	);
}

class DateForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            start: new Date(moment().hour(23).minute(59).toString()),
            end: new Date(moment().add(1, "days").hour(23).minute(59).toString()),
            displayForm: false
        }
    }
    handleTimeChange = (movement, name)=> {
        this.setState({[name]: movement})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        let dateGroup={
            start: this.state.start,
            end: this.state.end
        }
		this.props.setDateGroupStart(this.props.groupId, this.state.start, this.state.end);
		this.setState({displayForm:false});
    }
    render() {
        return (
        <div className="manage-events-event-preview">
            {
                (this.state.displayForm)?
                    <CreateDate
                    start={this.state.start}
                    end={this.state.end}
                    handleTimeChange={this.handleTimeChange}
                    handleSubmit={this.handleSubmit}/>:
                    <div className="event-preview-event-button" onClick={this.displayForm}>Set Start and End time</div>
            }
        </div>)
    }
}
export default DateForm;
