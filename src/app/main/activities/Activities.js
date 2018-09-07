import React, {Component} from 'react';
import './Activities.css';
import Activity from './activity/Activity';
import axios from 'axios';
class Activities extends Component {
    constructor(props){
        super(props);
        this.state = {activities:[]}
    }
    fetchActivites(){
        axios.post('http://localhost:3005/graphql',{query:`{
        	allActivityCatagories(condition:{name:"${this.props.type}"}){
            edges{
              node{
                activitiesByType{
                  edges{
                    node{
                      name
                      description
                      id
                    }
                  }
                }
              }
            }
          }
        }`}).then((res)=>{
            let temp = res.data.data.allActivityCatagories.edges[0].node.activitiesByType.edges.map((element)=>{
                return <Activity name={element.node.name} description={element.node.description} id={element.node.id} key={element.node.id}></Activity>
            })
            this.setState({
               activities: temp
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    componentDidMount() {
        this.fetchActivites();
    }
    componentDidUpdate(prevProps) {
        if (this.props.type !== prevProps.type) {
            this.fetchActivites();
        }
    }
    componentWillUnmount() {
    }
    render() {
        return (
        <div className="home">
            <h1 className="activities-header">{this.props.type}</h1>
            <div>{this.state.activities}</div>
        </div>);
    }
}

export default Activities;
