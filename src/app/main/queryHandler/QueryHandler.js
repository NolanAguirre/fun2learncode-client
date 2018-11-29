import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

function QueryHandler (props) {
  return (
    <Query  query={props.query}>
      {({ loading, error, data }) => {
        if (loading) {
          if (props.loading) {
            return React.cloneElement(props.loading,{loading})
          }
          return 'Loading...'
        }
        if (error) {
          if (props.error) {
            return React.cloneElement(props.error,{error})
          }
          return `Error! ${error.message}`
        }
        return React.cloneElement(props.children ,{queryResult:data})
      }}
    </Query>
  )
}

export default QueryHandler
