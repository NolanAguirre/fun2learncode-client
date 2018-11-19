import React from 'react';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';

function MutationHandler(props){
    return(
    <Mutation onCompleted={props.onMutationCompleted} refetchQueries={props.refetchQueries} mutation={props.mutation}>
        {
            (mutation, {loading, error, data}) => {
                if (loading) {
                    return 'Loading...';
                }
                if (error) {
                    if(error.message.includes("permission denied")){
                        return "You're not authorized to make this request, or you need to log out and back in.";
                    }
                    return `Error! ${error.message}`;
                }
                return(
                    <form onSubmit={(e) => {props.handleMutation(e, mutation)}}>
                        {props.form}
                    </form>
                );
            }
        }
    </Mutation>
);
}

export default MutationHandler;
