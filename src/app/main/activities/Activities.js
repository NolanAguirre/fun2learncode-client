import React, { Component } from 'react'
import './Activities.css'
import Activity from './activity/Activity'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'
import {GET_ACTIVITIES_IN_CATAGORY} from '../../Queries.js'

function Activities (props) {
  return (<QueryHandler query={GET_ACTIVITIES_IN_CATAGORY(props.match.params.type)} child={(data) => {
    return (<div className='home'>
      <h1 className='activities-header'>{props.type}</h1>
      {
        data.allActivityCatagories.nodes[0].activitiesByType.nodes.map((element) => {
          return <Activity name={element.name} description={element.description} id={element.id} key={element.id} />
        })
      }
    </div>)
  }} />)
}
export default Activities
