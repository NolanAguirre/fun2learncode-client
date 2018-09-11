import React, {Component} from 'react';
import './Activities.css';
import Activity from './activity/Activity';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

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
        return (<Query query={GET_ACTIVITIES(this.props.match.params.type)}>
                {
                    ({loading, error, data}) => {
                        if (loading)
                            return 'Loading...';
                        if (error)
                            return `Error! ${error.message}`;

                        return (<div className="home">
                            <h1 className="activities-header">{this.props.type}</h1>
                            <div>{
                                    data.allActivityCatagories.edges[0].node.activitiesByType.edges.map((element) => {
                                        return <Activity name={element.node.name} description={element.node.description} id={element.node.id} key={element.node.id}></Activity>
                                    })
                                }</div>
                        </div>);
                    }
                }
            </Query>)
        }
}
export default Activities;
