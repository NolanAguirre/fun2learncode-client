import React from 'react'
import './Activity.css'
import { Link } from 'react-router-dom'
function Activity (props) {
    const image = props.imageComponent ||  <img className='activity-image mobile-center-x' src={props.url || 'https://via.placeholder.com/350x150'} />
    const name = props.nameComponent || props.name
    const prerequisites = props.prerequesiteComponent?props.prerequesiteComponent:(props.prerequisites.length !== 0?<div className='mobile-center-text'><h4 className='no-margin'>Prerequisites</h4>{props.prerequisites}</div>:'')
    const button = props.buttonComponent || <Link to={`/Events/${props.name}/${props.id}`}><div className='event-register-btn '>View Event Dates</div></Link>
    const description = props.descriptionComponent ||  <div>{props.description}</div>
  return (<div className='styled-container column'>
    <div className='container mobile-column'>
        {image}
      <div className='activity-header-text section'>
        <h2 className='activity-title mobile-center-text'>
            {name}
        </h2>
            {prerequisites}
      </div>
      <div className='activity-view-events'>
         {button}
      </div>
    </div>

    <div className='activity-body'>
        {description}
    </div>
  </div>)
}

export default Activity
