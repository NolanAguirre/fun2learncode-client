import React from 'react'
import './Event.css'
import { Location, DatesTable } from '../../common/Common'
import { Link } from 'react-router-dom'
function EventComponent (props) {
  return (
    <div className='card event-card'>
        <Location className='section' street={props.location.street}
            city={props.location.city}
            state={props.location.state}
            alias={props.location.alias} />
        <div className='event-body-container'>
            <div className='section container column'>
                <h3 className='date-table-header'>Dates</h3>
                <DatesTable className='center-x' dates={props.dates}/>
            </div>
                <div className='event-btn-container'>
                    <Link className='default-link styled-button' to={`/registration/${props.id}`}>
                        <h2 className='event-register-header'>Register Now</h2>
                        <div>
                            <span className='event-register-price'>${props.price}</span>
                             <span className='event-register-seats'>  Seats Left: {props.seatsLeft}</span>
                         </div>
                    </Link>
                </div>
        </div>
    </div>
  )
}

export default EventComponent
