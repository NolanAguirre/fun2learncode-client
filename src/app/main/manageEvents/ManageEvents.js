import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './ManageEvents.css';
import DragAndDropMutation from '../calendar/Calendar';
import EventForm from './EventForm';
import DateGroupForm from './DateGroupForm';
import {SecureRoute, CustomProvider} from '../common/Common'
import {Event, DateGroup, EventsPreview, DateGroupInfo} from './EventsPreview';

function ManageEvents(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
            <div className="manage-events-container">
                    <EventsPreview>
                        <Event>
                            <DateGroup/>
                            <DateGroupForm>
                                <div className='event-register-btn center-text margin-top-10'>New Group</div>
                            </DateGroupForm>
                        </Event>
                    </EventsPreview>
                    <div className="container column section">
                        <div className="manage-events-event-form">
                            <EventForm/>
                            <CustomProvider propName='dateGroup'>
                                <DateGroupInfo/>
                            </CustomProvider>
                        </div>
                        <CustomProvider propName='dateGroup'>
                            <DragAndDropMutation/>
                        </CustomProvider>
                    </div>
                </div>
        </SecureRoute>
}
export default ManageEvents;
