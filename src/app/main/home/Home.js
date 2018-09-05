import React, {Component} from 'react';
import './Home.css';
import Section from './section/Section';
import axios from 'axios';
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {activities:null}
    }
    componentDidMount() {
        axios.post('http://localhost:3005/graphql',{query:`{
            allActivityCatagories{
                edges{
                    node{
                        name
                        description
                        id
                    }
                }
            }
        }`}).then((res)=>{
            let sections = res.data.data.allActivityCatagories.edges.map((element)=>{
                return <Section name={element.node.name} description={element.node.description} key={element.node.id}></Section>
            })
            this.setState({
                activities: sections
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    componentWillUnmount() {
        
    }
    render() {
        return (<div className="home">
            <h2>Home</h2>
            {this.state.activities}
        </div>);
    }
}

export default Home;
