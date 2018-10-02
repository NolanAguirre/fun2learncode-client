import React, {Component} from 'react';
import './Home.css';
import Section from './section/Section';
import QueryHandler from '../queryHandler/QueryHandler';
import gql from 'graphql-tag';
const GET_ACTIVITIES = gql `
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
}`;
function Home(props) {
    return <QueryHandler query={GET_ACTIVITIES} child={(data) => {
            return(
            <div className="home">
                <h2>Home</h2>
                {data.allActivityCatagories.edges.map((element) => {
                    return <Section name={element.node.name} description={element.node.description} key={element.node.id} />
                })}
            </div>);
        }}></QueryHandler>
}

export default Home;
