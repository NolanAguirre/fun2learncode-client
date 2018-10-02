import React, {Component} from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

function QueryHandler(props){
    return(
        <Query query={props.query}>
        {({loading,error,data}) => {
            if (loading) {
                if(props.loading){
                    return props.loading(loading);
                }
                return 'Loading...';
            }
            if (error) {
                if(props.error){
                    return props.error(error);
                }
                return `Error! ${error.message}`;
            }
            return(props.child(data));
        }}
        </Query>
    );
}

export default QueryHandler;
