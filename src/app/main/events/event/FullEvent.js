import React, { Component } from 'react'
import './Event.css'
import {DatesTable} from '../../common/Common'

function FullEvent(props){
    return <div className='container column'>
        <h3>Event Information</h3>
        <div className="section container">
            <table className="section">
                <tbody>
                    <tr>
                        <td>Event:</td>
                        <td>{props.activity.name}</td>
                    </tr>
                    <tr>
                        <td>Location: </td>
                        <td>{props.address.alias}</td>
                    </tr>
                    <tr>
                        <td>Price:</td>
                        <td>{props.dateGroup.price}</td>
                    </tr>
                    <tr>
                        <td>Prerequisites:</td>
                        <td>{props.prerequisites}</td>
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
