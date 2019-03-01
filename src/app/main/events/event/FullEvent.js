import React, { Component } from 'react'
import './Event.css'
import {DatesTable} from '../../common/Common'

const GET_EVENT = (id) => `{
  allEvents(condition:{id:"${id}"}){
    nodes{
    	id
      nodeId
      price
      openRegistration
      closeRegistration
      capacity
      name
      activityByActivity{
        nodeId
        name
      }
      addressByAddress{
        nodeId
        alias
        street
        state
        city
        zipcode
      }
      dateJoinsByEvent{
        nodes{
          nodeId
          dateIntervalByDateInterval{
            nodeId
            start
            end
            eventLogsByDateInterval{
              nodes{
                nodeId
                comment
                userByInstructor{
                  nodeId
                  firstName
                  lastName
                }
                studentByStudent{
                  nodeId
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
}`

function FullEvent(props){
    return <div className='container column'>
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
                        <td>{props.name}</td>
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
