import React from 'react'
import './Home.css'
import Section from './section/Section'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'
const GET_ACTIVITIES = gql`
{
    allActivityCatagories{
        edges{
            node{
                name
                description
                id
            }
        }
    }
}`
function Home (props) {
  return (<div className='home'>
    <QueryHandler query={GET_ACTIVITIES} child={(data) => {
      return (
        <React.Fragment>
          <h2>Home</h2>
          {data.allActivityCatagories.edges.map((element) => {
            return <Section name={element.node.name} description={element.node.description} key={element.node.id} />
          })}
        </React.Fragment>)
    }} />
  </div>)
}

export default Home
