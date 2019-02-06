import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import DragAndDropMutation from '../calendar/Calendar';
import EventForm from './EventForm';
import {SecureRoute, CustomProvider} from '../common/Common'
import {EventsPreview, EventInfo} from './EventsPreview';

function ManageEvents(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
            <div className="manage-events-container main-contents">
                    <EventsPreview />
                    <div className="container column section">
                        <div className="manage-events-event-form">
                            <EventForm/>
                        </div>
                        <DragAndDropMutation/>
                    </div>
                </div>
        </SecureRoute>
}
export default ManageEvents;
