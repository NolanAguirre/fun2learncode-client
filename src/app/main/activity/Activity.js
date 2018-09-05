import React, {Component} from 'react';
import './Activity.css';
import Section from '../home/section/Section';
import axios from 'axios';
class Activity extends Component {
    constructor(props){
        super(props);
        this.state = {activities:null}
    }
    componentDidUpdate(prevProps) {
        if (this.props.type !== prevProps.type) {
        console.log(this.props.type)
        axios.post('http://localhost:3005/graphql',{query:`{
        	allActivityCatagories(condition:{name:"${this.props.type}"}){
            edges{
              node{
                activitiesByType{
                  edges{
                    node{
                      name,
                      description
                      id
                    }
                  }
                }
              }
            }
          }
        }`}).then((res)=>{
            console.log(res);
            let sections = res.data.data.allActivityCatagories.edges[0].node.activitiesByType.edges.map((element)=>{
                return <Section name={element.node.name} description={element.node.description} key={element.node.id}></Section>
            })
            this.setState({
                activities: sections
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <div className="home">
        <h2>{this.props.type}</h2>
            {this.state.activities}
        </div>);
    }
}

export default Activity;
