import React from 'react'
import './Home.css'
import Section from './section/Section'
import { Query } from '../../../delv/delv-react'

const GET_ACTIVITIES = `{
  allActivityCatagories {
    nodes {
      nodeId
      name
      description
      id
    }
  }
}`

function HomeInner(props){
    return props.queryResult.allActivityCatagories.nodes.map((element) => {
      return <Section name={element.name} description={element.description} key={element.id} />
    })
}
function Home (props) {
  return <div className='home'>
    <h2>Home</h2>
    <Query query={GET_ACTIVITIES}>
        <HomeInner />
    </Query>
  </div>
}

export default Home
