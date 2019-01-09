import React, {Component} from 'react'
import graphql from 'graphql-anywhere'
import gql from 'graphql-tag'
import TypeMap from './TypeMap'
import Delv from './delv'
import Query from './Query'
var _ = require('lodash');

class DelvReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        }

    }
    componentDidMount = () => {
        Delv.config({...this.props.config, onReady:this.isReady})
    }
    isReady = () => {
        this.setState({isReady:true})
    }

    render = () => {
        if (this.state.isReady) {
            return this.props.children
        } else {
            return <div>'loading...'</div>
        }
    }
}

export {
    DelvReact
}

class ReactQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryResult: ''
        }
        this.query = new Query({
            query: this.props.query,
            variables: this.props.variables,
            networkPolicy:this.props.networkPolicy,
            onFetch:this.onFetch,
            onResolve: this.onResolve,
            onError:this.onError
        })
    }

    componentDidMount = () => {
        this.query.query();
        if (this.query.networkPolicy != 'network-only') {
            this.query.addCacheListener();
        }
    }

    componentWillUnmount = () => {
        this.query.removeCacheListener();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.query != this.props.query) {
            this.query = new Query({
                query: this.props.query,
                variables: this.props.variables,
                networkPolicy:this.props.networkPolicy,
                onFetch:this.onFetch,
                onResolve: this.onResolve,
                onError:this.onError
            })
            this.query.query();
        }
    }

    onFetch = (promise) => {
        this.setState({queryResult: ''})
        if(this.props.onFetch){
            this.props.onFetch(promise)
        }
    }

    onResolve = (data) => {
        this.setState({queryResult: data})
        if(this.props.onResolve){
            this.props.onResolve(data)
        }
    }

    onError = (error) => {
        if(this.props.onError){
            this.props.onError(error)
        }
    }

    render = () => {
        if (this.state.queryResult === '') {
            if (this.props.loading) {
                return this.props.loading
            }
            return <div>loading</div>
        }
        return React.cloneElement(this.props.children, {
            queryResult: this.state.queryResult,
            delv:this.props
        })
    }
}

export {
    ReactQuery
}
