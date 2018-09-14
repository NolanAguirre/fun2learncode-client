import React, {Component} from 'react';
import './Home.css';
import Section from './section/Section';
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag';
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
}`;
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {activities:null}
    }
    render() {
        return (<div className="home">
            <h2>Home</h2>
            <QueryHandler query={GET_ACTIVITIES} inner={(element)=>{return <Section name={element.node.name} description={element.node.description} key={element.node.id}></Section>}}></QueryHandler>
        </div>);
    }
}

export default Home;
