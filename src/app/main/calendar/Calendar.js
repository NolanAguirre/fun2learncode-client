import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Colors from './Colors';
import './Calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import DateStore from '../../DateStore';
import Popup from "reactjs-popup";
import DateTime from 'react-datetime';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import Delv from '../../../delv/delv'


const GET_EVENTS = `{
  allEvents {
    nodes {
      nodeId
      id
      dateGroupsByEvent {
        nodes {
          nodeId
          id
          name
          datesJoinsByDateGroup {
            nodes {
              nodeId
              id
              dateIntervalByDateInterval {
                id
                nodeId
                start
                end
              }
            }
          }
        }
      }
    }
  }
}
`

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
            events:this.formatReactQueryResults(),
            hiddenEvents:[],
            selected:{id:null},
            showPopup: false,
            startTime: moment(),
            endTime : moment().add(1, 'hour')
        };
    }

    componentDidMount = () => {
        DateStore.on('hidden',(id)=>{this.toggleDisplay(id)});
    }

    componentWillUnmount = () => {
        DateStore.removeAllListeners('hidden');
    }

    genRandomId = () =>{
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local().toString()
    }

    // used for constructing queries
    makeTemplate = (name, dateInterval) => {
        return `${name}:makeDateInterval(input: {arg0: "${dateInterval.start}", arg1: "${dateInterval.end}", arg2: "${this.props.dateGroupProvider.id}"}) {
    datesJoin{
      nodeId
      id
      dateGroupByDateGroup{
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
        return `${name}:removeDateInterval(input: {arg0: "${dateInterval.start}", arg1: "${dateInterval.end}", arg2: "${this.props.dateGroupProvider.id}"}) {
            datesJoin{
              nodeId
              id
              dateGroupByDateGroup{
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

    formatReactQueryResults = () => {
        function isDayApart(dateOne, dateTwo) {
            let startTimeMatch = moment(dateOne.start).hour() == moment(dateTwo.start).hour() && moment(dateOne.start).minutes() == moment(dateTwo.start).minutes()
            let endTimeMatch = moment(dateOne.end).add(1, 'days').unix() == moment(dateTwo.end).unix();
            return startTimeMatch && endTimeMatch;
        }

        let dateGroups = this.props.allEvents.nodes.map((event) => {
            return event.dateGroupsByEvent.nodes.map((dateGroup) => dateGroup)
        }).reduce((acc, val) => acc.concat(val), []) //reduce flattens array
        .map((dateGroup) => {
            let calendarEvents = dateGroup.datesJoinsByDateGroup.nodes.map((dateJoin) => {
                let dateInterval = dateJoin.dateIntervalByDateInterval
                return {
                    id: this.genRandomId(),
                    start: this.localizeUTCTimestamp(dateInterval.start),
                    end: this.localizeUTCTimestamp(dateInterval.end),
                    title: dateGroup.name,
                    buttonStyle: {
                        backgroundColor: Colors.get(dateGroup.id).regular
                    },
                    resources: {
                        groupId: dateGroup.id
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
        return dateGroups;
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
        const dateGroupId = this.props.dateGroupProvider.id;
        if (dateGroupId && event.action === 'doubleClick' && (!DateStore.get('hidden') || !DateStore.get('hidden').includes(dateGroupId))) {
            this.popupEvent = {
                id: this.genRandomId(),
                title: this.props.dateGroupProvider.name,
                start: event.start,
                end: event.start,
                buttonStyle: {
                    backgroundColor: Colors.get(dateGroupId).regular
                },
                resources: {
                    groupId: dateGroupId
                }
            }
            this.setState({showPopup: true});
        }else if (event.action === 'select') {
            let selectedId = this.state.selected.id;
            if (selectedId != null) {
                const newEvents = this.state.events.filter((element) => element.id != selectedId)
                const removedEvent = this.state.events.find((element) =>element.id == selectedId);
                let newEvent = Object.assign({}, this.state.selected);
                newEvent.start = this.setTime(moment(event.start).toString(), removedEvent.start)
                newEvent.end = this.setTime(moment(event.start).add(event.slots.length - 1, 'days').toString(), removedEvent.end)
                this.post(this.makeBatch(removedEvent, this.deleteTemplate) + "\n" + this.makeBatch(newEvent, this.makeTemplate), true)
                this.setState({
                    events: [
                        ...newEvents,
                        newEvent
                    ]
                });
            }
        }
        this.resetSelectedEvent();
    }

    removeEvent = (event) => {
        const removedEvent = this.state.events.find((element) => element.id == event.id)
        this.post(this.makeBatch(removedEvent, this.deleteTemplate), true)
        const newEvents = this.state.events.filter((element) => element.id != event.id)
        const newHiddenEvents = this.state.hiddenEvents.filter((element) => element.id != event.id)
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
        this.props.emitDateGroupProvider({id:event.resources.groupId, name:event.title});
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
            selected: {id: null},
            events: newEvents
        });
    }

    toggleDisplay = (ids) =>{
        const newEvents = this.state.events.filter((event) => !ids.includes(event.resources.groupId)); // if hidden includes something on events
        const removed = this.state.events.filter((event) => ids.includes(event.resources.groupId));
        const newHiddenEvents = this.state.hiddenEvents.filter((event) => ids.includes(event.resources.groupId));
        const add = this.state.hiddenEvents.filter((event) => !ids.includes(event.resources.groupId));
        this.setState({
            events:[...newEvents, ...add],
            hiddenEvents: [...newHiddenEvents, ...removed],
        })
    }

    closePopup = () => {
        this.popupEvent.start = this.setTime(this.popupEvent.start, this.state.startTime)
        this.popupEvent.end = this.setTime(this.popupEvent.end, this.state.endTime)
        this.post(this.makeBatch(this.popupEvent, this.makeTemplate), false);
        this.setState({
            showPopup:false,
            events: [
                ...this.state.events,
                this.popupEvent
            ]
        })
        this.popupEvent = null;
    }

    clearPopupState = () => {
        this.popupEvent = null;
        if(this.state.showPopup){
            this.setState({showPopup:false});
        }
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
                    <span className='error'>{(this.state.startTime > this.state.endTime)?'The start time must be before the end time':''}</span>
                      <table className='calendar-time-table'>
                          <tbody>
                              <tr>
                                  <td>Event Start Time:</td>
                                  <td><DateTime className="time-input" timeFormat='HH:mm' dateFormat={false} value={this.state.startTime} onChange={(time) => {this.handleTimeChange("startTime", time)}}/></td>
                                  <td>{moment(this.state.startTime).format('hh:mm a')}</td>
                              </tr>
                              <tr>
                                  <td>Event End Time:</td>
                                  <td><DateTime className="time-input" timeFormat='HH:mm' dateFormat={false} value={this.state.endTime}  onChange={(time) => {this.handleTimeChange("endTime", time)}}/></td>
                                  <td>{moment(this.state.endTime).format('hh:mm a')}</td>
                              </tr>
                          </tbody>
                      </table>
                      <div className='event-register-btn center-text margin-top-10' onClick={this.closePopup}>Set</div>
                      <button className='hacky-submit-button' type='submit'/>
  		          </div>
            </Popup>
            <DragAndDropCalendar
        removeEvent={this.removeEvent}
        selectEvent={this.selectEvent}
        newEvent={this.newEvent}
        events={this.state.events}
        className="manage-events-calander"/>
    </React.Fragment>
    }
}

function DragAndDropMutation(props){
    return <ReactQuery query={GET_EVENTS}>
        <DragAndDropMutationInner {...props}/>
    </ReactQuery>
}

export default DragAndDropMutation
