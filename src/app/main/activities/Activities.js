import React, {Component} from 'react'
import './Activities.css'
import Activity from './activity/Activity'
import {ReactQuery} from '../../../delv/delv-react'

const GET_ACTIVITIES_IN_CATAGORY = (name) => {
    return `{
   allActivityCatagories(condition: {name: "${name}", publicDisplay:true}) {
    nodes {
      nodeId
      id
      name
      publicDisplay
      activitiesByType {
        nodes {
            nodeId
            name
            description
            id
          activityPrerequisitesByActivity{
            nodes{
              nodeId
              id
        	  activityByPrerequisite{
                nodeId
                id
                name
              }
            }
          }
        }
      }
    }
  }
}`}

function ActivitiesInner(props) {
    const activities = props.queryResult.allActivityCatagories.nodes[0].activitiesByType.nodes;
    if (activities.length == 0) {
        return <div>We currently aren't offering any {props.queryResult.allActivityCatagories.nodes[0].name.toLowerCase()}.</div>
    }
    return activities.map((element) => {
        let prerequisites = element.activityPrerequisitesByActivity.nodes.map((prerequisite) => prerequisite.activityByPrerequisite.name)
        return <Activity name={element.name} prerequisites={prerequisites} description={element.description} id={element.id} key={element.id}/>
    })
}

function Activities(props) {
    return <div className='activities-container'>
        <h1 className='activities-header'>{props.match.params.type}</h1>
        <ReactQuery query={GET_ACTIVITIES_IN_CATAGORY(props.match.params.type)}>
            <ActivitiesInner/>
        </ReactQuery>
    </div>

}
export default Activities
