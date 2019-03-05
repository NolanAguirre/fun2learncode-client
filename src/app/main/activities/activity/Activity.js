import React from 'react'
import './Activity.css'
function Activity (props) {
    return <div className='activity-card' onClick={()=>{props.history.push(`/Events/${props.name}/${props.id}`)}}>
        <img className='activity-image' alt='Activity' src={props.url || 'https://via.placeholder.com/350x150'} />
        <h2>{props.name}</h2>
        <div>
            <h4 className='no-margin'>Prerequisites</h4>
            {props.prerequisites}
        </div>
        <div className='activity-body'>{props.description}</div>
    </div>
}

export default Activity
