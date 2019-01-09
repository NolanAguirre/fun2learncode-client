import gql from 'graphql-tag'
import util from 'util'
import TypeMap from './TypeMap'
import axios from 'axios'
import cache from './Cache'
import QueryManager from './QueryManager'
axios.defaults.withCredentials = true;

class Delv {
    constructor() {
        this.queries = new QueryManager();
    }
    config = ({url, handleError, onReady}) => {
        this.url = url
        this.handleError = handleError
        this.onReady = onReady
        this.loadIntrospection()
    }

    loadIntrospection = () => {
        axios.post(this.url, {
            query: `{
              __schema {
                types{
                  name
                  fields{
                    name
                    type{
                      name
                      ofType{
                        name
                      }
                    }
                  }
                }
              }
          }`
        }).then((res) => {
            TypeMap.loadIntrospection(res.data.data);
            this.onReady();
        }).catch((error) => {
            throw new Error('Something went wrong while attempting making introspection query ' + error)
        })
    }

    post = (query, variables) => {
        return axios.post(this.url, {
            query: this.queries.addTypename(query),
            variables
        })
    }

    stripTypenames = (obj) => {
        delete obj['__typename']
        Object.values(obj).forEach((value) => {
            if(value instanceof Object){
                if(Array.isArray(value)){
                    value.forEach((item)=>{
                        if(item instanceof Object){
                            this.stripTypenames(item)
                        }
                    })
                }else{
                    this.stripTypenames(value)
                }
            }
        })
    }

    queryHttp = ({query, variables, onFetch, onResolve, onError, customCache}) => {
        this.queries.add(query, variables)
        let promise = this.post(query, variables).then((res) => {
            try{
                if(customCache){
                    customCache(cache, res.data.date)
                }else{
                    cache.processIntoCache(res.data.data)
                }
            } catch(error) {
                console.log(`Error occured trying to cach responce data: ${error.message}`)
            }
            this.stripTypenames(res.data.data)
            onResolve(res.data.data)
            this.queries.setPromise(query, variables, null);
        }).catch((error) => {
            throw new Error(`Error occured while making query ${error.message}`);
            return;
        })
        onFetch(promise);
        this.queries.setPromise(query, variables, promise)
    }

    query = (options) => { // query, variables, networkPolicy, onFetch, onResolve, onError
        switch(options.networkPolicy){
            case 'cache-first':
                this.cacheFirst()
                break
            case 'cache-only':
                options.onResolve(cache.loadQuery(options.query))
                break
            case 'network-only':
                this.queryHttp(options) // query, variables, onFetch, onResolve, onError
                break
            case 'network-once':
                this.networkOnce(options)
                break
        }
    }

    cacheFirst = (options) => {
        let data = cache.loadQuery(options.query)
        if (data.data) {
            options.onResolve(data.data);
        } else {
            this.queryHttp(options) // query, variables, onFetch, onResolve, onError
        }
    }

    networkOnce = ({query, variables, onFetch, onResolve, onError}) => {
        if(this.queries.includes(query, variables)){
            let promise = this.queries.getPromise(query, variables)
            if(promise){
                promise.then((res) => {
                    onResolve(res.data.data)
                })
            }else{
                onResolve(cache.loadQuery(query))
            }
        }else{
            this.queryHttp({query, variables, onFetch, onResolve, onError})
        }
    }

}

export default new Delv();
