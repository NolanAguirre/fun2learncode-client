import React, {Component} from 'react';
import './Activity.css';
import FormattedTime from '../formattedTime/FormattedTime';
import EventComponent from './event/Event'
import axios from 'axios';
class Activity extends Component{
    constructor(props){
        super(props);
        this.state = {events:null}
    }
    fetchEvents(){
        axios.post('http://localhost:3005/graphql',{query:`{
          activityById(id: "${this.props.id}") {
            eventsByEventType {
              edges {
                node {
                id
                  addressByAddress {
                    city
                    street
                    alias
                    url
                  }
                  price
                  eventDatesByEvent(orderBy:START_TIME_ASC) {
                    edges {
                      node {
                        id
                        startTime
                        endTime
                      }
                    }
                  }
                }
              }
            }
          }
        }`}).then((res)=>{
            let temp = res.data.data.activityById.eventsByEventType.edges.map((element)=>{
                let dates = element.node.eventDatesByEvent.edges.map((date, index)=>{
                    return <FormattedTime data={date.node} key={index}></FormattedTime>
                })
                return <EventComponent node={{name: this.props.name, description:this.props.description, location:element.node.addressByAddress, date:dates}} key={element.node.id}></EventComponent>;
            })
            this.setState({
                events:temp
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
    componentDidMount(){
        this.fetchEvents();
    }
    render(){
        return(<div>{this.props.name}{this.props.description}</div>
        );
    }
}

export default Activity;
