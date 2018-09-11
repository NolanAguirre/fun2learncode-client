import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './app/App';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  link: new HttpLink({uri:'http://localhost:3005/graphql'}),
  cache: new InMemoryCache(),
});

const routeNames = [
    {
        name: 'Home',
        route: 'Home'
    }, {
        name: 'About Us',
        route: 'About Us'
    }, {
        name: 'Summer Camps',
        route: 'Activity/Summer Camps'
    }, {
        name: 'Classes',
        route: 'Activity/Classes'
    }, {
        name: 'Labs',
        route: 'Activity/Labs'
    }, {
        name: 'Workshops',
        route: 'Activity/Workshops'
    }, {
        name: 'Login',
        route: 'Login'
    }
];

ReactDOM.render(<Router>
    <ApolloProvider client={client}>
        <div className="app"><App routeNames={routeNames}/>
        </div>
    </ApolloProvider>
</Router>, document.getElementById('root'));
