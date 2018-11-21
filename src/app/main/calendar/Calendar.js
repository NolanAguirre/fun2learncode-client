import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
import Colors from './Colors';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';
import DateStore from '../../DateStore';
import QueryHandler from '../queryHandler/QueryHandler';
import Popup from "reactjs-popup";
import DateTime from 'react-datetime';
import { GET_EVENTS } from '../../Queries'

const localizer = BigCalendar.momentLocalizer(moment);
function Calendar(props){
    let colors = ['blue', 'red', 'green', 'purple']
    function flattenDeep(arr1) {
        return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
    }
    let events = flattenDeep(props.calanderEvents.map((element)=>{
        let address = element.node.addressByAddress.alias;
        let name = element.node.activityByEventType.name;
        let dateGroups = element.node.eventDatesByEvent.edges.map((el)=>{
            let date = el.node.dateGroupByDateGroup.datesJoinsByDateGroup.edges.map((foo)=>{
                let color = colors.pop();
                return {
                    title:name + " @ " + address,
                    start: new Date(foo.node.dateIntervalByDateInterval.start),
                    end: new Date(foo.node.dateIntervalByDateInterval.end),
                    resource: {buttonStyle:{backgroundColor:color}},

                };
            })
            return date;
        })
        return dateGroups.filter((el)=>{
            return el.length > 0;
        })
    }).filter((el)=>{
        return el.length > 0;
    }))
    return(
    <div className={props.className}>
    <BigCalendar
      popup
      showMultiDayTimes={true}
      localizer={localizer}
      events={events}
      eventPropGetter={(event,start,end,isSelected: boolean ) => {return{style:event.buttonStyle}}}
      tooltipAccessor={(event)=>{return moment(event.start).format("HH:MM") + " - " + moment(event.end).format("HH:MM")}}
    />
  </div>);
}
function DragAndDropCalendar(props){
    return (
      <BigCalendar
        selectable
        popup
        className={props.className}
        tooltipAccessor={props.tooltipAccessor}
        localizer={localizer}
        events={props.events}
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
            events:[],
            hiddenEvents:[],
            selected:{id:null},
            showPopup: false,
            startTime: new Date(),
            endTime : new Date()
        };
        this.makeTemplate = (name, hour) => {
            return `${name}:makeDateInterval(input: {arg0: "${hour.start.toISOString()}", arg1: "${hour.end.toISOString()}", arg2: "${this.props.activeDateGroup.id}"}) {
                clientMutationId
            }`
        }
    }
    componentDidMount = () =>{
        DateStore.on("toggleDateDisplay",(id)=>{this.toggleDisplay(id)});
    }
    componentWillUnmount = () =>{
        DateStore.removeAllListeners("toggleDateDisplay");
    }
    post = (requestData) => {
        return axios({
            method:"post",
            url:"http://localhost:3005/graphql",
            headers:{'Authorization': "bearer " + localStorage.getItem("authToken")},
            data: requestData
        })
    }
    makeBatch = (eventObject) =>{
        let rangeStart= eventObject.start;
        let rangeEnd = eventObject.end;
        let startTime = moment(eventObject.resources.start);
        let endTime = moment(eventObject.resources.end);
        let dates = [];
        while(rangeStart < rangeEnd){
            dates.push({
                start: moment(rangeStart).set({'hour':startTime.get('hour'),'minute':startTime.get('minute')}),
                end: moment(rangeStart).set({'hour':endTime.get('hour'),'minute':endTime.get('minute')})
            })
            rangeStart = moment(rangeStart).add(1, "days");
        }
        console.log(dates.map((date,index)=>{return this.makeTemplate('a' + index, date)}))
        return dates;
    }
    newEvent = (event) => { //slot select
        if(!this.props.activeDateGroup){
            return;
        }
        if (event.action === 'doubleClick') {
            this.tempEvent = {
                id: '_' + Math.random().toString(36).substr(2, 9),
                title: this.props.activeDateGroup.name,
                start: event.start,
                end:  new Date(+event.start + 86400000),
                buttonStyle: {
                    backgroundColor: Colors.get(this.props.activeDateGroup.id).regular
                },
                resources: {
                    groupId: this.props.activeDateGroup.id
                }
            }
            this.setState({showPopup:true});
            return;
            }
          if(event.action === 'select'){
              let selectedId = this.state.selected.id;
              if(selectedId != null){
                const newEvents = this.state.events.filter((element)=>{return element.id != selectedId});
                let newEvent = Object.assign({}, this.state.selected);
                newEvent.start = event.start;
                newEvent.end = new Date(+event.start + 86400000 * event.slots.length);
                this.makeBatch(newEvent)
                this.setState({
                    events: [...newEvents, newEvent],
                });
            }
        }
        this.resetSelectedEvent();
    }
    removeEvent = (event) => {
        const newEvents = this.state.events.filter((element) => {
            return element.id != event.id;
        });
        const newHiddenEvents = this.state.hiddenEvents.filter((element) => {
            return element.id != event.id;
        });
        this.setState({
            events: newEvents,
            hiddenEvents: newHiddenEvents,
        })
    }
    selectEvent = (event) => {
        this.resetSelectedEvent();
        event.buttonStyle = {
            backgroundColor: Colors.get(event.resources.groupId).hover
        }
        this.setState({selected: event})
    }
    resetSelectedEvent = () => {
        let newEvents = this.state.events.map((element) => {
            element.buttonStyle = {
                backgroundColor: Colors.get(element.resources.groupId).regular
            }
            return element;
        });
        this.setState({
            selected: {
                id: null
            },
            events: newEvents
        });
    }
    tooltipAccessor = (event) => {
        return "Tool Tip";
//         let group = this.dateGroups.data[event.resources.eventId];
//         return `From: ${moment(event.resources.start).format("h:mm a")}
// To: ${moment(event.resources.end).format("h:mm a")}
// Price: ${group.price}
// Location: ${group.addressName}
// Capacity: ${group.capacity}
// Registartion
//     Event
//         Open: ${moment(group.open).format("MMMM Do YYYY")} Close: ${moment(group.close).format("MMMM Do YYYY")}
//     Group:
//         Open: ${moment(event.resources.open).format("MMMM Do YYYY")} Close: ${moment(event.resources.close).format("MMMM Do YYYY")}
// Event Id:${event.resources.eventId}
// `;
    }
    toggleDisplay = (id) =>{
        const newEvents = this.state.events.filter((event)=>{return event.resources.groupId != id});
        const removed = this.state.events.filter((event)=>{return event.resources.groupId == id});
        const newHiddenEvents = this.state.hiddenEvents.filter((event)=>{return event.resources.groupId != id});
        const add = this.state.hiddenEvents.filter((event)=>{return event.resources.groupId == id});
        this.setState({
            events:[...newEvents, ...add],
            hiddenEvents: [...newHiddenEvents, ...removed],
        })
    }
    handleTimeChange = (movement, name)=> {
        this.setState({[name]: movement})
    }
    closePopup = () => {
        this.tempEvent.resources.start = this.state.startTime
        this.tempEvent.resources.end = this.state.endTime
        this.makeBatch(this.tempEvent);
        let data = {
            query:`mutation{

                    }`
        }
        this.setState({
            showPopup:false,
            events: [
                ...this.state.events,
                this.tempEvent
            ]
        })
        this.tempEvent = null;
    }
    render(){
        return(
            <React.Fragment>
            <Popup
          open={this.state.showPopup}>
          <div className="date-form">
                  <table>
                      <tbody>
                          <tr>
                              <td>Event Start Time:</td>
                              <td><DateTime className="time-input" dateFormat={false} value={this.state.startTime} onChange={(time) => {this.handleTimeChange(time, "startTime")}}/></td>
                          </tr>
                          <tr>
                              <td>Event End Time:</td>
                              <td><DateTime className="time-input" value={this.state.endTime} dateFormat={false} onChange={(time) => {this.handleTimeChange(time, "endTime")}}/></td>
                          </tr>
  						<tr>
  							<td><button onClick={this.closePopup} type="submit">Set</button></td>
  						</tr>
                      </tbody>
                  </table>
  		</div>
        </Popup>
            <DragAndDropCalendar
        tooltipAccessor={this.tooltipAccessor}
        removeEvent={this.removeEvent}
        selectEvent={this.selectEvent}
        newEvent={this.newEvent}
        events={this.state.events}
        className="manage-events-calander"/>
    </React.Fragment>)
    }
}
function DragAndDropMutation(props){
    return <QueryHandler query={GET_EVENTS} child={(data)=><DragAndDropMutationInner {...props} queryResult={data} />}/>
}
export {DragAndDropMutation};

export {DragAndDropCalendar};

export {Calendar};
