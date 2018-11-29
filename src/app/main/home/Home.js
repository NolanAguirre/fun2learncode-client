import React from 'react'
import './Home.css'
import Section from './section/Section'
import QueryHandler from '../queryHandler/QueryHandler'
import {GET_ACTIVITIES} from '../../Queries'
function HomeInner(props){
    return props.queryResult.allActivityCatagories.nodes.map((element) => {
      return <Section name={element.name} description={element.description} key={element.id} />
    })
}
function Home (props) {
  return <div className='home'>
    <h2>Home</h2>
    <QueryHandler query={GET_ACTIVITIES}>
        <HomeInner />
    </QueryHandler>
  </div>
}

export default Home
