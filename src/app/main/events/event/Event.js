import React from 'react'
import './Event.css'
import { Location, DatesTable } from '../../common/Common'

import { Link } from 'react-router-dom'
function EventComponent (props) {
  return (
    <div className='styled-container'>
      <div className='section'>
        <h3 className='center-text'>Dates</h3>
        <DatesTable className='center-x' dates={props.dates}/>
      </div>

      <Location className='section' street={props.location.street}
        city={props.location.city}
        state={props.location.state}
        alias={props.location.alias} />

    <div className='section container'>
        <div className='center-x center-y'>
            <div className='event-register'>
              <div className='event-register-price'>${props.price}</div>
              <Link className='default-link' to={`/Registration/${props.id}`}>
                <div className='event-register-btn'>Register Now</div>
              </Link>
              <div className='center-text'>Seats Left: {props.seatsLeft}</div>
            </div>
        </div>
      </div>

    </div>
  )
}

export default EventComponent
