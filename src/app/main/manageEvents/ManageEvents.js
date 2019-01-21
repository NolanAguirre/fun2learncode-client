import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import DragAndDropMutation from '../calendar/Calendar';
import EventForm from './EventForm';
import DateGroupForm from './DateGroupForm';
import {SecureRoute} from '../common/Common'
import {Event, DateGroup, EventsPreview, DateGroupInfo} from './EventsPreview';

class ManageEventsInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeEvent: null,
            activeDateGroup: {id:null}
        }
    }
    setActiveDateGroup = (dateGroup) =>{
        if(dateGroup.id != this.state.activeDateGroup.id){
            this.setState({
                activeDateGroup:{...dateGroup}
            });

        }
    }

    setActiveEvent = (event) => {
        this.setState({
            activeEvent: event
        });
    }

    render() {
        return <div className="manage-events-container">
                    <EventsPreview>
                        <Event>
                            <DateGroup setActiveDateGroup={this.setActiveDateGroup} activeDateGroup={this.state.activeDateGroup}/>
                            <DateGroupForm>
                                <button className='create-date-group-btn'>New Group</button>
                            </DateGroupForm>
                        </Event>
                    </EventsPreview>
                    <div className="container column section">
                        <div className="manage-events-event-form">
                            <EventForm/>
                            <DateGroupInfo activeDateGroup={this.state.activeDateGroup} />
                        </div>
                        <DragAndDropMutation setActiveDateGroup={this.setActiveDateGroup} activeDateGroup={this.state.activeDateGroup}/>
                    </div>
                </div>;
    }
}

function ManageEvents(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
            <ManageEventsInner />
        </SecureRoute>
}
export default ManageEvents;
