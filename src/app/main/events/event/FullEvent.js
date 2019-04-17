import React from 'react'
import './Event.css'
import {DatesTable} from '../../common/Common'

function FullEvent(props){
    return <div className='container column section'>
        <h3>Event Information</h3>
        <div className="section container">
            <table className="section">
                <tbody>
                    <tr>
                        <td>Activity:</td>
                        <td>{props.activity.name}</td>
                    </tr>
                    <tr>
                        <td>Event:</td>
                        <td>{props.event.name}</td>
                    </tr>
                    <tr>
                        <td>Location: </td>
                        <td>{props.address.alias}</td>
                    </tr>
                    <tr>
                        <td>Price:</td>
                        <td>{props.event.price}$</td>
                    </tr>
                    <tr>
                        <td>{props.prerequisites.length > 0?'Prerequisites:':''}</td>
                        <td>{props.prerequisites.map((prereq=>prereq.name))}</td>
                    </tr>
                </tbody>
            </table>
            <div className='section'>
            Dates:
            <DatesTable className="section" dates={props.dates}/>
            </div>
        </div>
    </div>
}

export default FullEvent
