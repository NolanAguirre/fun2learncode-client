import React from 'react'
import './Activity.css'
function Activity (props) {
    return <div className='activity-card card' onClick={()=>{props.history.push(`/events/${props.name}/${props.id}`)}}>
        <img className='activity-image' alt='Activity' src={props.url || 'https://via.placeholder.com/350x150'} />
        <h2 className='activity-header'>{props.name}</h2>
        {props.prerequisites.length?<div>
            <h4 className='activity-prereq'>Prerequisites</h4>
            <p className='activity-prereqs'>{props.prerequisites}</p>
        </div>:<div></div>}
        <div className='activity-body'>{props.description}</div>
    </div>
}

export default Activity
