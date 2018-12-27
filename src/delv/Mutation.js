import Delv from './delv'
import Cache from './Cache'


class Mutation{
    constructor({mutation, onFetch, onSubmit, onResolve}){
        this.mutation = mutation;
        this.submit = onSubmit;
        this.fetch = onFetch;
        this.resolve = onResolve;
    }

    onSubmit = (event) => {
        this.variables = this.submit(event);
        if(this.variables){
            this.query()
        }
    }

    onFetch = () => {
        if(this.fetch){
            this.fetch()
        }
    }

    onResolve = (data) => {
        if(this.resolve){
            this.resolve(data)
        }
    }

    query = () => {
        Delv.query({
            query: this.mutation,
            variables: this.variables,
            networkPolicy: 'network-only',
            onFetch: this.onFetch,
            onResolve: this.onResolve
        })
    }
}


export default Mutation
