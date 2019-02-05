import React, {Component} from 'react'
import './Activities.css'
import Activity from './activity/Activity'
import {ReactQuery} from '../../../delv/delv-react'
import SadFace from '../../logos/sadface.svg'
const GET_ACTIVITIES_IN_CATAGORY = (name) => {
    return `{
  allCategories(condition: {name: "${name}"}) {
    nodes {
      nodeId
      id
      name
      activitiesByCategory {
        nodes {
          nodeId
          id
          name
          description
          url
          activityPrerequisitesByActivity {
            nodes {
              nodeId
              id
              activityByPrerequisite {
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
}
`}

function ActivitiesInner(props) {
    const activities = props.allCategories.nodes[0].activitiesByCategory.nodes;
    if (activities.length == 0) {
        return <div style={{background:'white'}}className='center-y section fit-parent'>
            <img src={SadFace} title='Icon made by Freepik from www.flaticon.com' />
            <h2 style={{color:'rgb(164, 164, 164)'}} className='center-text'>Sorry! We currently aren't offering any {props.catagory.toLowerCase()} at this time.</h2>
        </div>
    }
    return <div className='container column section'>
        <h1 className='center-text'>{props.catagory}</h1>
        {activities.map((element) => {
        let prerequisites = element.activityPrerequisitesByActivity.nodes.map(prerequisite => prerequisite.activityByPrerequisite.name)
        return <Activity name={element.name} prerequisites={prerequisites} description={element.description} id={element.id} key={element.id} url={element.url}/>
    })}
</div>
}

function Activities(props) {
    return  <ReactQuery query={GET_ACTIVITIES_IN_CATAGORY(props.match.params.type)}>
            <ActivitiesInner catagory={props.match.params.type}/>
        </ReactQuery>
}
export default Activities
