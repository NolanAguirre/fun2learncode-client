import React from 'react'
import './Home.css'
import Section from './section/Section'
import QueryHandler from '../queryHandler/QueryHandler'
import {GET_ACTIVITIES} from '../../Queries'
function Home (props) {
  return (<div className='home'>
    <QueryHandler query={GET_ACTIVITIES} child={(data) => {
      return (
        <React.Fragment>
          <h2>Home</h2>
          {data.allActivityCatagories.nodes.map((element) => {
            return <Section name={element.name} description={element.description} key={element.id} />
          })}
        </React.Fragment>)
    }} />
  </div>)
}

export default Home
