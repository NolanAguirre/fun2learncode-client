import React from 'react'
import './Activity.css'
import { Link } from 'react-router-dom'
function Activity (props) {
    const image = props.imageComponent ||  <img className='activity-image mobile-center-x' src={props.url || 'https://via.placeholder.com/350x150'} />
    const name = props.nameComponent || props.name
    const prerequisites = props.prerequesiteComponent?props.prerequesiteComponent:(props.prerequisites.length !== 0?<div><h4 className='no-margin'>Prerequisites</h4>{props.prerequisites}</div>:'')
    const button = props.buttonComponent || <Link to={`/Events/${props.name}/${props.id}`}><div className='event-register-btn '>View Event Dates</div></Link>
    const description = props.descriptionComponent ||  <div className='activity-body'>{props.description}</div>
return (<div className='activity-card'>
          {image}
      <h2>
          {name}
      </h2>
      {prerequisites}
      {description}
      <div className='activity-view-events'>
          {button}
      </div>
  </div>)
}

export default Activity
