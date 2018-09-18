import React, {Component} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

class QueryHandler extends Component{
    render(){
        return(
            <Query query={this.props.query}>
            {({loading,error,data}) => {
                if (loading) {
                    if(this.props.loading){
                        return this.props.loading;
                    }
                    return 'Loading...';
                }
                if (error) {
                    if(this.props.error){
                        return this.props.error;
                    }
                    return `Error! ${error.message}`;
                }
                if(this.props.formatData){
                    data = this.props.formatData(data);
                }
                return(
                    <div>{
                        Object.values(data)[0].edges.map((element) => {
                            return this.props.inner(element);
                        })
                    }
                    </div>
                );
            }}
            </Query>
        )
    }
}

export default QueryHandler;
