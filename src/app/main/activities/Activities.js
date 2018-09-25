import React, {Component} from 'react';
import './Activities.css';
import Activity from './activity/Activity';
import gql from 'graphql-tag';
import QueryHandler from '../queryHandler/QueryHandler';

const GET_ACTIVITIES = (name) => {
    return gql `{
        allActivityCatagories(condition:{name:"${name}"}){
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
    }
    `;
}
class Activities extends Component {
    render() {
        return (<div className="home">
            <h1 className="activities-header">{this.props.type}</h1>
            <QueryHandler query={GET_ACTIVITIES(this.props.match.params.type)} inner={(temp) => {
                    return temp.node.activitiesByType.edges.map((element) => {
                        return <Activity
                                    name={element.node.name}
                                    description={element.node.description}
                                    id={element.node.id}
                                    key={element.node.id}></Activity>
                            });
                }}></QueryHandler>
        </div>)
    }
}
export default Activities;
