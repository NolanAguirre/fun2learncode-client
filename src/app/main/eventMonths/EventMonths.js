import React, { Component } from 'react'
import './EventMonths.css'
import EventMonth from './eventMonth/EventMonth'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'
const GET_EVENTS = (studentId) => {
  return gql`
    {
  allEventRegistrations(condition: {student: "${studentId}"}) {
    edges {
      node {
        eventByEvent{
          price
          addressByAddress{
            alias
          }
          capacity
          activityByEventType{
            name
          }
        }
        dateGroupByEventDates {
          datesJoinsByDateGroup {
            edges {
              node {
                dateIntervalByDateInterval {
                  start
                  end
                  eventLogsByDateInterval(condition: {student: "${studentId}"}){
                    edges{
                      node{
                        userByInstructor{
                          firstName
                          lastName
                        }
                      	comment
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
}
`
}
class EventMonths extends Component {
  formatData (data) {

  }
  render () {
    return (
      <div className='student-events-container'>
        <QueryHandler
          formatData={(data) => { return this.formatData(data) }}
          inner={(element) => { return (<EventMonth key={element.month} studentId={this.props.studentId} month={element.month} events={element.events} />) }}
          query={GET_EVENTS(this.props.studentId)} />
      </div>
    )
  }
}

export default EventMonths
