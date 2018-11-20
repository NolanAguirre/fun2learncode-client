import React, { Component } from 'react'
import './Activities.css'
import Activity from './activity/Activity'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'

const GET_ACTIVITIES = (name) => {
  return gql`{
        allActivityCatagories(condition:{name:"${name}"}){
        edges{
          node{
            activitiesByType{
              edges{
                node{
                  name
                  description
                  id
                }
              }
            }
          }
        }
      }
    }
    `
}
function Activities (props) {
  return (<QueryHandler query={GET_ACTIVITIES(props.match.params.type)} child={(data) => {
    return (<div className='home'>
      <h1 className='activities-header'>{props.type}</h1>
      {
        data.allActivityCatagories.edges[0].node.activitiesByType.edges.map((element) => {
          return <Activity name={element.node.name} description={element.node.description} id={element.node.id} key={element.node.id} />
        })
      }
    </div>)
  }} />)
}
export default Activities
