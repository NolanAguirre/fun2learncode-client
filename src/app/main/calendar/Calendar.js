import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Colors from './Colors';
import './Calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Popup from "reactjs-popup";
import DateTime from 'react-datetime';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import Delv from '../../../delv/delv'
import { CustomProvider } from '../common/Common'

const localizer = BigCalendar.momentLocalizer(moment)

const GET_EVENTS = `{
  allEvents(condition: {showCalendar: true}) {
    nodes {
      id
      name
      showCalendar
      dateJoinsByEvent {
        nodes {
          id
          dateIntervalByDateInterval {
            id
            start
            end
          }
        }
      }
    }
  }
}`


function DragAndDropCalendar(props){
    const events = props.events.map((event)=>{
        const eventId = event.resources.eventId
        if(event.id === props.selected.id){
            event.buttonStyle.backgroundColor = Colors.get(eventId).hover
            event.buttonStyle.color = 'black'
        }else{
            event.buttonStyle.backgroundColor = Colors.get(eventId).regular
            event.buttonStyle.color = 'rgb(80, 80, 80)'
        }
        return event;
    })
    return (
      <BigCalendar
        selectable
        popup
        className={props.className}
        tooltipAccessor={props.tooltipAccessor}
        localizer={localizer}
        events={events}
        onSelectSlot={props.newEvent}
        onSelectEvent={props.selectEvent}
        onDoubleClickEvent={props.removeEvent}
        eventPropGetter={(event,start,end,isSelected: boolean) => {return{style:event.buttonStyle}}}
        selected={props.selected}
        resizable
        views={['month']}
        defaultDate={new Date()}
      />
    )
}

class DragAndDropMutationInner extends Component{
    constructor(props){
        super(props);
        this.state = {
            selected:{id:null},
            showPopup: false,
            startTime: moment(),
            endTime : moment().add(1, 'hour')
        };
    }

    genRandomId = () =>{
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local().toString()
    }

    // used for constructing queries
    makeTemplate = (name, dateInterval) => {
        return `${name}:makeDateInterval(input: {arg0: "${dateInterval.start}", arg1: "${dateInterval.end}", arg2: "${this.props.activeEventProvider.id}"}) {
    dateJoin{
      nodeId
      id
      eventByEvent{
        nodeId
      }
      dateIntervalByDateInterval{
        nodeId
        start
        end
        id
      }
    }
  }`
    }

    deleteTemplate = (name, dateInterval) =>{
        return `${name}:removeDateInterval(input: {arg0: "${dateInterval.start}", arg1: "${dateInterval.end}", arg2: "${this.props.activeEventProvider.id}"}) {
            dateJoin{
              nodeId
              id
              dateInterval
              eventByEvent{
                nodeId
              }
              dateIntervalByDateInterval{
                nodeId
              }
            }
        }`
    }

    handleTimeChange = (key, value)=> {
        this.setState({[key]:value})
    }

    setTime = (day, time) =>{
        let temp = moment(day).local()
        temp = moment(temp.hour(moment(time).hour()))
        temp = moment(temp.minute(moment(time).minute()))
        return temp
    }

    makeBatch = (eventObject, template) =>{
        let rangeStart = moment(eventObject.start);
        let rangeEnd = moment(eventObject.end);
        let dates = [];
        let mutation = "";
        while(rangeStart.unix() < rangeEnd.unix()){
            dates.push({
                start: rangeStart.toISOString(),
                end: this.setTime(rangeStart,rangeEnd).toISOString()
            })
            rangeStart = moment(rangeStart.add(1, "days"))
        }
        dates.map((date,index) => template(this.genRandomId(), date))
             .forEach((date) => {mutation += date + '\n'})
        return mutation;
    }

    post = (mutation, isDelete) => { //jank way to refetch queries
        if(isDelete){
            new Mutation({
                mutation:`mutation foo{
                        ${mutation}
                    }`,
                onSubmit:()=>{return {}},
                customCache: (cache, data) => {cache.remove(data)}
            }).onSubmit()
        }else{
            new Mutation({
                mutation:`mutation foo{
                        ${mutation}
                    }`,
                onSubmit:()=>{return {}}
            }).onSubmit()
        }
    }


    newEvent = (event) => { //event that files on slot select
        const eventId = this.props.activeEventProvider.id;
        if (eventId && event.action === 'doubleClick') {
            this.popupEvent = {
                id: this.genRandomId(),
                title: this.props.activeEventProvider.name,
                start: event.start,
                end: event.start,
                buttonStyle: {
                    backgroundColor: Colors.get(eventId).regular
                },
                resources: {
                    eventId: eventId
                }
            }
            this.setState({showPopup: true});
        }else if (event.action === 'select') {
            if (this.state.selected.id != null) {
                let newEvent = Object.assign({}, this.state.selected);
                newEvent.start = this.setTime(moment(event.start).toString(), newEvent.start)
                newEvent.end = this.setTime(moment(event.start).add(event.slots.length - 1, 'days').toString(), newEvent.end)
                this.post(this.makeBatch(this.state.selected, this.deleteTemplate) + "\n" + this.makeBatch(newEvent, this.makeTemplate), true)
            }
        }
        this.resetSelectedEvent();
    }

    removeEvent = (event) => {
        this.post(this.makeBatch(event, this.deleteTemplate), true)
        this.resetSelectedEvent();
    }

    selectEvent = (event) =>{
        this.props.emitActiveEventProvider({id:event.resources.eventId, name:event.title});
        this.setState({selected: event})
    }

    resetSelectedEvent = () => {
        this.setState({selected: {id: null}});
    }

    closePopup = () => {
        this.popupEvent.start = this.setTime(this.popupEvent.start, this.state.startTime)
        this.popupEvent.end = this.setTime(this.popupEvent.end, this.state.endTime)
        this.post(this.makeBatch(this.popupEvent, this.makeTemplate), false);
        this.setState({showPopup:false})
        this.popupEvent = null;
    }

    clearPopupState = () => {
        this.popupEvent = null;
        if(this.state.showPopup){
            this.setState({showPopup:false});
        }
    }

    tooltipAccessor = (event) => {
        return `${event.title}
${moment(event.start).format('h:mm a')} to ${moment(event.end).format('h:mm a')}`
    }

    render = () => {
        //TODO make this popup pretty, and check to make sure that end is greater than start
        return <React.Fragment>
            <Popup
          className="calendar-popup"
          open={this.state.showPopup}
          closeOnDocumentClick
          onClose={this.clearPopupState}>
                <div>
                    <h3 className='center-text'>Set time of day</h3>
                    <div className='error'>{(this.state.startTime > this.state.endTime)?'Start time must be before end time':''}</div>
                      <table className='calendar-time-table'>
                          <tbody>
                              <tr>
                                  <td>Event Start Time:</td>
                                  <td><DateTime className="time-input" timeFormat='H:mm' dateFormat={false} value={this.state.startTime} onChange={(time) => {this.handleTimeChange("startTime", time)}}/></td>
                                  <td>{moment(this.state.startTime).format('h:mm a')}</td>
                              </tr>
                              <tr>
                                  <td>Event End Time:</td>
                                  <td><DateTime className="time-input" timeFormat='H:mm' dateFormat={false} value={this.state.endTime}  onChange={(time) => {this.handleTimeChange("endTime", time)}}/></td>
                                  <td>{moment(this.state.endTime).format('h:mm a')}</td>
                              </tr>
                          </tbody>
                      </table>
                      <div className='event-register-btn center-text margin-top-10' onClick={this.closePopup}>Set</div>
                      <button className='hacky-submit-button' type='submit'/>
  		          </div>
            </Popup>
            <DragAndDropCalendar
            selected={this.state.selected}
            removeEvent={this.removeEvent}
            selectEvent={this.selectEvent}
            newEvent={this.newEvent}
            events={this.props.events}
            tooltipAccessor={this.tooltipAccessor}
            className="manage-events-calander"/>
    </React.Fragment>
    }
}


function DragAndDropMutation(props){
    function formatQueryResults({allEvents}) {
        function isDayApart(dateOne, dateTwo) {
            let startTimeMatch = moment(dateOne.start).hour() == moment(dateTwo.start).hour() && moment(dateOne.start).minutes() == moment(dateTwo.start).minutes()
            let endTimeMatch = moment(dateOne.end).add(1, 'days').unix() == moment(dateTwo.end).unix();
            return startTimeMatch && endTimeMatch;
        }

        function localizeUTCTimestamp (timestamp) {
            return moment(moment.utc(timestamp)).local().toString()
        }

        let events = allEvents.nodes.map((event) => {
            let calendarEvents = event.dateJoinsByEvent.nodes.map((dateJoin) => {
                let dateInterval = dateJoin.dateIntervalByDateInterval;
                return {
                    id: `${event.id}${dateInterval.id}`,
                    start: localizeUTCTimestamp(dateInterval.start),
                    end: localizeUTCTimestamp(dateInterval.end),
                    title: event.name,
                    buttonStyle: {
                        backgroundColor: Colors.get(event.id).regular
                    },
                    resources: {
                        eventId: event.id
                    }
                }
            });
            calendarEvents.sort((a, b) => moment(a.start).unix() - moment(b.start).unix())
            for(var x = 0; x < calendarEvents.length; x++){
                for(var y = x+1; y < calendarEvents.length; y++){
                    if (isDayApart(calendarEvents[x], calendarEvents[y])) {
                        calendarEvents[x].end = calendarEvents[y].end
                        calendarEvents.splice(y,1)
                        y--
                    }
                }
            }
            return calendarEvents;
        }).reduce((acc, val) => acc.concat(val), []);
        return {events};
    }

    return <ReactQuery query={GET_EVENTS} formatResult={formatQueryResults}>
        <CustomProvider propName='activeEvent'>
            <DragAndDropMutationInner {...props}/>
        </CustomProvider>
    </ReactQuery>
}

export default DragAndDropMutation
