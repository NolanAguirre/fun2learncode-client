import React from 'react'
import './Activity.css'
import { Link } from 'react-router-dom'
function Activity (props) {
  return (<div className='styled-container column'>
    <div className='container'>
      <img className='activity-image' src='https://via.placeholder.com/350x150' />
      <div className='activity-header-text'>
        <h2 className='activity-title'>
          {props.name}
        </h2>
        <div>
            <h4 className='no-margin'>Prerequisites</h4>
            <div>{props.prerequisites}</div>
        </div>
      </div>
      <div className='activity-view-events'>
        <Link to={`/Events/${props.name}/${props.id}`}><button className='activity-view-events-btn'>View Event Dates</button></Link>
      </div>
    </div>

    <div className='activity-body'>
      <div>{props.description}</div>
    </div>
  </div>)
}

export default Activity
