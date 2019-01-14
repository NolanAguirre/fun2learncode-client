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
            onError:this.onError,
            formatResult:props.formatResult
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
            this.query.removeCacheListener();
            this.query = new Query({
                query: this.props.query,
                variables: this.props.variables,
                networkPolicy:this.props.networkPolicy,
                onFetch:this.onFetch,
                onResolve: this.onResolve,
                onError:this.onError,
                formatResult:this.props.formatResult
            })
            if (this.query.networkPolicy != 'network-only') {
                this.query.addCacheListener();
            }
            this.query.query();
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state === nextState && nextProps.query === this.props.query){
            return false
        }
        if(this.state.queryResult === '' && nextState.queryResult === '' && nextProps.loading == this.props.loading){
            return false
        }
        return true
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
            ...this.state.queryResult
        })
    }
}

export {
    ReactQuery
}
