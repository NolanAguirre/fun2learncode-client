import React, {
    Component
} from 'react';
import './Events.css';
import TimeTableRow from './timeTableRow/TimeTableRow';
import EventComponent from './event/Event'
import axios from 'axios';
class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null
        }
    }

    fetchEvents () {
        axios.post('http://localhost:3005/graphql', {
            query: `{
          activityById(id: "${this.props.match.params.id}") {
            name
            description
            eventsByEventType {
              edges {
                node {
                    capacity
                    id
                    price
                  addressByAddress {
                    city
                    street
                    alias
                    url
                  }
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
        }`
        }).then((res) => {
            console.log(res)
            let name = res.data.data.activityById.name
            let temp = res.data.data.activityById.eventsByEventType.edges.map((element) => {
                let dates = element.node.eventDatesByEvent.edges.map((date, index) => {
                    return <TimeTableRow data = {
                        date.node
                    }
                    key = {
                        index
                    } > < /TimeTableRow>
                })
                return <EventComponent node = {
                    {
                        name: this.props.name,
                        description: this.props.description,
                        location: element.node.addressByAddress,
                        capacity: element.node.capacity,
                        date: dates,
                        id: element.node.id,
                        price:element.node.price
                    }
                }
                key = {
                    element.node.id
                } > < /EventComponent>;
            })
            this.setState({
                events: temp,
                name:name
            })
        }).catch((err) => {
            console.log(err);
        })
    }
    componentDidMount() {
        this.fetchEvents();
    }
    render() {
        return (
            <div className="events">
                <h1 className="events-title">{this.state.name}</h1>
                {this.state.events}
            </div>);
    }
}

export default Events;
