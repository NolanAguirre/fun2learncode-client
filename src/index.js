import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './app/App';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('authToken');
    return token
        ? {
            headers: {
                ...headers,
                authorization: `Bearer ${token}`
            }
        }
        : {
            headers: {
                ...headers
            }
        }
});

const client = new ApolloClient({
    link: authLink.concat(new HttpLink({uri: 'http://localhost:3005/graphql'})),
    cache: new InMemoryCache()
});

ReactDOM.render(<Router>
    <ApolloProvider client={client}>
        <div className="app"><App/>
        </div>
    </ApolloProvider>
</Router>, document.getElementById('root'));
