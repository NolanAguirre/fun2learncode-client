import React from 'react'
import './Event.css'
import { Location, DatesTable } from '../../common/Common'
import { Link } from 'react-router-dom'
function EventComponent (props) {
  return (
    <div className='styled-container column section edge-margin'>
        <Location className='section' street={props.location.street}
            city={props.location.city}
            state={props.location.state}
            alias={props.location.alias} />
        <div className='section container'>
            <div className='section container column'>
                <h3 className='center-text'>Dates</h3>
                <DatesTable className='center-x' dates={props.dates}/>
            </div>
            <div className='section container column center-y'>
                <div className='event-btn-container center-x'>
                    <Link className='default-link event-register-btn' to={`/Registration/${props.id}`}>
                        <h2 className='event-register-header'>Register Now</h2>
                        <div>
                            <span className='event-register-price'>${props.price}</span>
                             <span className='event-register-seats'>- Seats Left: {props.seatsLeft}</span>
                         </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EventComponent
