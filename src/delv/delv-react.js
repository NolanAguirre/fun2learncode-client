import React, {Component} from 'react'
import graphql from 'graphql-anywhere'
import gql from 'graphql-tag'
import TypeMap from './TypeMap'
import Delv from './delv'
import CacheEmitter from './CacheEmitter'
var _ = require('lodash');

class DelvReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        }
        Delv.registerMount(this);
    }

    isReady = () => {
        this.setState({isReady: true})
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

class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryResult: '',
            listenToCacheUpdates: true,
            renderCount: 0
        }
        this.networkPolicy = props.networkPolicy || 'network-once'
        this.id = '_' + Math.random().toString(36).substr(2, 9)
        this.types = [];
        this.mapTypes()
    }

    componentDidMount = () => {
        this.query();
        if (this.networkPolicy != 'network-only') {
            CacheEmitter.on(this.id, this.onCacheUpdate)
        }
    }

    componentWillUnmount = () => {
        CacheEmitter.removeAllListeners(this.id);
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.query != this.props.query) {
            this.query()
        }
    }

    query = () => {
        Delv.query({query: this.props.query, variables: this.props.variables, networkPolicy: this.networkPolicy, onFetch: this.onFetch, onResolve: this.onResolve, onError:this.onError})
    }

    onFetch = () => {
        this.setState({queryResult: '', listenToCacheUpdates: false})
    }

    onResolve = (data) => {
        if (!_.isEqual(data, this.state.queryResult)) {
            this.setState({queryResult: data, listenToCacheUpdates: true});
        }
    }

    onError = (error) => {
        if(this.props.onError){
            this.props.onError(error)
        }else{
            console.log(error)
        }
    }

    mapTypes = () => {
        const resolver = (fieldName, root, args, context, info) => {
            if (!info.isLeaf && fieldName != 'nodes') {
                this.types.push(TypeMap.guessChildType(TypeMap.get(fieldName)))
            }
            return {}
        }
        graphql(resolver, gql `${this.props.query}`, null)

    }

    onCacheUpdate = (types) => {
        if (this.state.listenToCacheUpdates) {
            let includesType = this.types.some(r => types.includes(r))
            if (includesType) {
                this.query();
            }
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
            renderCount: this.state.renderCount
        })
    }
}

export {
    Query
}
