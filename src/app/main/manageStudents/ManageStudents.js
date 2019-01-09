import React, { Component } from 'react'
import './ManageStudents.css'
import StudentSelect from '../studentSelect/StudentSelect'
import { ReactQuery } from '../../../delv/delv-react'
import {SecureRoute, Location, GridView, DatesTable} from '../common/Common'
import moment from 'moment';

// user by id is included to ensure transition from loading state, even if the date intervals are the same
const GET_DATES_WITH_STUDENT = (studentId) =>{
    return `{
        allStudents(condition:{id:"${studentId}"}){
    nodes{
      nodeId
      id
      eventRegistrationsByStudent{
        nodes{
          nodeId
          dateGroupByDateGroup{
            nodeId
            eventByEvent{
              nodeId
              id
              activityByEventType{
                nodeId
                name
                id
              }
            }
            datesJoinsByDateGroup{
              nodes{
                nodeId
                dateIntervalByDateInterval{
                  nodeId
                  id
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
}`
}

function EventMonthDate(props){
    function localizeUTCTimestamp(timestamp){
        return moment(moment.utc(timestamp)).local()
    }
    return <div className='event-month-date-container'>
        <h3>{props.date.activityName}</h3>
        {localizeUTCTimestamp(props.date.start).format('dddd Do')}
    </div>
}

class EventMonth extends Component{
    constructor (props) {
      super(props)
      this.state = {};
    }
    localizeUTCTimestamp = (timestamp) =>{
        return moment(moment.utc(timestamp)).local().format('MMMM YYYY')
    }
    render = () => {
        let dates = this.props.month.slice().sort((a,b)=>{return moment(b.start).unix() - moment(a.start).unix()}).map((date)=>{return<EventMonthDate key={moment(date.start).unix()} date={date}/>})
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
        const dates = this.props.queryResult.allStudents.nodes[0].eventRegistrationsByStudent.nodes.map((registration)=>{
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
          <StudentSelect setSelected={this.setSelectedStudents} user={this.props.queryResult.getUserData} />
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
