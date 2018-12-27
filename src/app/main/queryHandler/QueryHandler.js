import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from '../../../delv/delv-react'

function QueryHandler (props) {
  return (
    <Query query={props.query}>
      {({ loading, error, data }) => {
        if (loading) {
          if (props.loading) {
            return React.cloneElement(props.loading,{loading})
          }
          return 'Loading...'
        }
        if (error) {
            console.log(error)
          if (props.error) {
            return React.cloneElement(props.error,{error})
          }
          if(error.networkError && error.networkError.result.errors[0].message == 'jwt expired'){
              window.location.href = '/logout';
              return <div>Session Expired</div>;
          }
          return `Error! ${error.message}`
        }
        return React.cloneElement(props.children ,{queryResult:data})
      }}
    </Query>
  )
}

export default QueryHandler
