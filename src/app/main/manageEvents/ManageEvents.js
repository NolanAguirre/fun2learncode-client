import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import {Query} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css';
import DragAndDropMutation from '../calendar/Calendar';
import QueryHandler from '../queryHandler/QueryHandler';
import memoize from "memoize-one";
import Colors from '../calendar/Colors';
import moment from 'moment';
import EventForm from './EventForm';
import DateGroupForm from './DateGroupForm';
import DateForm from './DateForm';
import {Event, DateGroup, EventsPreview, DateGroupInfo} from './EventsPreview';

class ManageEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeEvent: null,
            activeDateGroup: {id:null}
        }
    }
    reset = () =>{
        this.setState({currentEvent:null, currentDateGroup:null});
    }
    setActiveDateGroup = (dateGroup) =>{
        if(dateGroup.id != this.state.activeDateGroup.id){
            this.setState({
                activeDateGroup:dateGroup
            });
        }
    }
    setActiveEvent = (event) => {
        this.setState({
            activeEvent: event
        });
    }

    render() {
        const dateGroup = <DateGroup setActiveDateGroup={this.setActiveDateGroup}/>
        const event = <Event form={<DateGroupForm />} children={dateGroup}/>
        return (
            <div className="manage-events-container">
                <EventsPreview children={event}/>
                <div className="manage-events-main">
                    <div className="manage-events-event-form">
                        <EventForm/>
                        <DateGroupInfo activeDateGroup={this.state.activeDateGroup} />
                    </div>
                        <DragAndDropMutation
                            setActiveDateGroup={this.setActiveDateGroup}
                            createDate={this.state.createDate}
                            activeDateGroup={this.state.activeDateGroup}/>
                </div>
            </div>
    );}
}
export default ManageEvents;
