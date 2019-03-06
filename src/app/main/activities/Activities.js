import React from 'react'
import './Activities.css'
import Activity from './activity/Activity'
import {ReactQuery} from '../../../delv/delv-react'
import SadFace from '../../logos/sadface.svg'
import {GridView} from '../common/Common'
import loadingIcon from '../../logos/loading.svg'
const GET_ACTIVITIES_IN_CATAGORY = name => {
    return `{
  allCategories(condition: {name: "${name}"}) {
    nodes {
      id
      name
      activitiesByCategory(condition: {publicDisplay: true}) {
        nodes {
          id
          name
          description
          url
          publicDisplay
          activityPrerequisitesByActivity {
            nodes {
              id
              activityByPrerequisite {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}`
}

function ActivitiesInner(props) {
    const activities = props.allCategories.nodes[0].activitiesByCategory.nodes
    if (activities.length === 0) {
        return (
            <div className='center-y main-contents'>
                <img src={SadFace} alt='No events sad face' title='Icon made by Freepik from www.flaticon.com' />
                <h2 style={{color: 'rgb(164, 164, 164)'}} className='center-text'>
                    Sorry! We currently aren't offering any {props.catagory.toLowerCase()} at this
                    time.
                </h2>
            </div>
        )
    }
    const child = activities.map(element => {
        let prerequisites = element.activityPrerequisitesByActivity.nodes.map(
            prerequisite => prerequisite.activityByPrerequisite.name
        )
        return (
            <Activity
                history={props.history}
                name={element.name}
                prerequisites={prerequisites}
                description={element.description}
                id={element.id}
                key={element.id}
                url={element.url}
            />
        )
    })
    return (
        <div className='main-contents activities'>
            <h1 className='category-header'>{props.catagory}</h1>
            <GridView
                itemsPerRow={3}
                fillerStyle='activity-card card'>
                {child}
            </GridView>
        </div>
    )
}

function Activities(props) {
    const loading = (
        <div className='page-loading'>
            <img alt='Loading' className='loading-icon center-x' src={loadingIcon} />
        </div>
    )
    return (
        <ReactQuery query={GET_ACTIVITIES_IN_CATAGORY(props.match.params.type)} loading={loading}>
            <ActivitiesInner history={props.history} catagory={props.match.params.type} />
        </ReactQuery>
    )
}
export default Activities
