import React from 'react'
import './Event.css'
import { Location } from '../../common/Common'
import TimeTableRow from '../timeTableRow/TimeTableRow'
import { Link } from 'react-router-dom'
function EventComponent (props) {
  return (
    <div className='event-contaier'>
      <div className='event-dates'>
        <h3>Dates</h3>
        <table>
          <tbody>
            {props.date.map((date, index) => {
              return <TimeTableRow data={date.dateIntervalByDateInterval} key={index} />
            })}
          </tbody>
        </table>
      </div>
      <Location street={props.location.street}
        city={props.location.city}
        state={props.location.state}
        alias={props.location.alias} />
      <div className='event-register-container'>
        <div className='event-capacity'>Seats Left: {props.capacity}</div>
        <div className='event-register'>
          <div className='event-register-price'>${props.price}</div>
          <Link to={`/Registration/${props.id}`}>
            <div className='event-register-btn'>Register Now</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventComponent
