import React, { Component } from 'react'
import './Event.css'
import {DatesTable} from '../../common/Common'

function FullEvent(props){
    return <div>
        <h3>Event Information</h3>
        <div className="registration-info-tables-container">
            <table>
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
            Dates:
            <DatesTable className="registration-dates-table" dates={props.dates}/>
        </div>
    </div>
}

export default FullEvent
