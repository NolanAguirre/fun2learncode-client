import React, { Component } from 'react'
import './ManageStudents.css'
import StudentSelect from '../studentSelect/StudentSelect'
import { ReactQuery } from '../../../delv/delv-react'
import {SecureRoute, Location, GridView, DatesTable} from '../common/Common'
import moment from 'moment';
import Popup from "reactjs-popup"

// user by id is included to ensure transition from loading state, even if the date intervals are the same
const GET_DATES_WITH_STUDENT = (studentId) =>{
    return `{
  allStudents(condition: {id: "${studentId}"}) {
    nodes {
      nodeId
      id
      eventRegistrationsByStudent {
        nodes {
          nodeId
          dateGroupByDateGroup {
            nodeId
            eventByEvent {
              nodeId
              id
              activityByEventType {
                nodeId
                name
                id
              }
            }
            datesJoinsByDateGroup {
              nodes {
                nodeId
                dateIntervalByDateInterval {
                  nodeId
                  id
                  start
                  end
                  eventLogsByDateInterval(condition: {student: "${studentId}"}, filter:{instructor:{notEqualTo:null}}) {
                    nodes {
                      student
                      nodeId
                      id
                      comment
                      instructor
                      userByInstructor {
                        nodeId
                        id
                        firstName
                        lastName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`}

function EventLog(props) {
    return <div>
        <h3>{props.firstName} Said...</h3>
        <div>{props.comment}</div>
    </div>
}

function EventLogs(props){
    if (props.logs.length > 0){
        return<div>
            {props.logs.map(log=><EventLog key={log.id} firstName={log.userByInstructor.firstName} comment={log.comment} />)}
            <div>
                View All Event notes
            </div>
        </div>
    }
    return <div>No Logs found</div>
}

class EventMonthDate extends Component {
    constructor(props) {
        super(props);
        this.state = {showPopup: false}
    }

    showPopup = () => {
        this.setState({showPopup: true});

    }

    clearPopupState = () => {
        this.setState({showPopup: false});
    }

    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local()
    }
    render = () => {
        return <div className='event-month-date-container'>
            <Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <EventLogs logs={this.props.date.eventLogsByDateInterval.nodes} />
            </Popup>
            <h3 className='margin-bottom-10'>{this.props.date.activityName}</h3>
            <div className='event-mont-date-body'>
                <span>{this.localizeUTCTimestamp(this.props.date.start).format('dddd Do')}</span>
                <span onClick={this.showPopup}>View Notes</span>
            </div>
        </div>
    }
}

class EventMonth extends Component{
    constructor (props) {
      super(props)
      this.state = {};
    }
    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local()
    }
    render = () => {
        let dates = this.props.month.slice().sort((a,b)=>{
            return moment(b.start).unix() - moment(a.start).unix()}).map((date)=>{return<EventMonthDate key={moment(date.start).unix()} date={date}/>
        })
        return <React.Fragment>
            <h2>{this.props.monthName}</h2>
                <GridView itemsPerRow={5} className='event-month'>
                    {dates}
                </GridView>
        </React.Fragment>
    }
}

class EventMonths extends Component{
    constructor (props) {
      super(props)
      this.state = {};
      this.filterToMonth();
    }

    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local().format('MMMM YYYY')
    }

    filterToMonth = () => {
        console.log(this.props)
        const dates = this.props.allStudents.nodes[0].eventRegistrationsByStudent.nodes.map((registration)=>{
            let activityName = registration.dateGroupByDateGroup.eventByEvent.activityByEventType.name
            let dates = registration.dateGroupByDateGroup.datesJoinsByDateGroup.nodes.map((date)=>{
                return {...date.dateIntervalByDateInterval, activityName }
            })
            return dates;
        }).reduce((acc, val) => acc.concat(val), []);
        let data = {};
        dates.forEach((date)=>{
            if(data[this.localizeUTCTimestamp(date.start)]){
                data[this.localizeUTCTimestamp(date.start)].push(date);
            }else{
                data[this.localizeUTCTimestamp(date.start)] = [date]
            }
        })
        let temp = [];
        for(var key in data){
            temp.push(<EventMonth month={data[key]} monthName={key} key={key} />)
        }
        return temp
    }

    render = () => {
        return <div className="event-months-container">
            {this.filterToMonth()}
        </div>
    }
}

class ManageStudentsInner extends Component {
  constructor (props) {
    super(props)
    this.state = {};
  }

  setSelectedStudents = (student) =>{
      this.setState({selectedStudent:student});
  }

  render () {
      return <div className='manage-students-container'>
          <StudentSelect setSelected={this.setSelectedStudents} user={this.props.getUserData} />
          {this.state.selectedStudent?<ReactQuery query={GET_DATES_WITH_STUDENT(this.state.selectedStudent.id)}>
            <EventMonths />
            </ReactQuery>:""}
      </div>
  }
}



function ManageStudents(props){
    return <SecureRoute roles={['FTLC_USER']}>
        <ManageStudentsInner {...props} />
    </SecureRoute>
}
export default ManageStudents
