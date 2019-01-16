import React from 'react'
import './Activity.css'
import { Link } from 'react-router-dom'
function Activity (props) {
    const image = props.imageComponent ||  <img className='activity-image' src={props.url || 'https://via.placeholder.com/350x150'} />
    const name = props.nameComponent || props.name
    const prerequisites = props.prerequesiteComponent || <div>{props.prerequisites}</div>
    const button = props.buttonComponent || <Link to={`/Events/${props.name}/${props.id}`}><button className='activity-view-events-btn'>View Event Dates</button></Link>
    const description = props.descriptionComponent ||  <div>{props.description}</div>
  return (<div className='styled-container column'>
    <div className='container'>
        {image}
      <div className='activity-header-text'>
        <h2 className='activity-title'>
            {name}
        </h2>
        <div>
            <h4 className='no-margin'>Prerequisites</h4>
            {prerequisites}
        </div>
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
