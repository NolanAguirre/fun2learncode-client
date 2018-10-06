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

const CREATE_DATE = gql`
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
function CreateDate(props) {
    return (
        <div className="date-form">
        <Mutation onCompleted={props.createDateGroup} mutation={CREATE_DATE}>
            {
                (createDate, {loading, error, data}) => {
                    if (loading) {
                        return 'Loading...';
                    }
                    if (error) {
                        return `Error! ${error.message}`;
                    }
                    return(<form onSubmit={(e) => {props.handleSubmit(e, createDate)}}>
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
                        </tbody>
                    </table>

                    </form>)
                }
            }
        </Mutation>
</div>
);
}

class DateForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            start: new Date().setHours(12,0,0),
            end: new Date().setHours(13,0,0),
            displayForm: false
        }
    }
    handleTimeChange = (movement, name)=> {
        this.setState({[name]: movement})
    }
    handleSubmit = (date, mutation) => {
        event.preventDefault();
        let dateGroup={
            start: this.state.start,
            end: this.state.end
        }
        mutation({
            variables: {"dateGroup":dateGroup}
        });
    }
    createDate= (data) => {
        this.props.createDate(data, this.props.groupId);
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
                    <CreateDate
                    start={this.state.start}
                    end={this.state.end}
                    handleTimeChange={this.handleTimeChange}
                    createDateGroup={this.createDateGroup}
                    handleSubmit={this.handleSubmit}/>:
                    <div className="event-preview-event-button" onClick={this.displayForm}>New Date Group</div>
            }
        </div>)
    }
}
export default DateForm;
