import React, {Component} from 'react';
import './App.css';
import NavBar from './navbar/NavBar';
import Main from './main/Main';
import Footer from './footer/Footer'
import axios from 'axios';
import UserStore from './UserStore'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
const GET_USER = gql `
    {
      getUserData{
        firstName
        lastName
        role
        id
      }
  }`
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authToken: localStorage.getItem('authToken')
        };
        UserStore.on('authToken', (authToken)=>{this.handleAuthToken(authToken)})
    }
    handleAuthToken(authToken) {
        this.setState({authToken})
        if (authToken) {
            localStorage.setItem('authToken', authToken);
        } else {
            localStorage.removeItem('authToken');
        }
    }
    render() {
        return (<div className="app-container">
            {
                (this.state.authToken)
                    ? (<Query query={GET_USER}>{
                            ({loading, error, data}) => {
                                if (loading) {
                                    return 'Loading...';
                                }
                                if (error) {
                                    return `Error! ${error.message}`;
                                }
                                return (<div className="app-inner">
                                    <NavBar user={data.getUserData}></NavBar>
                                    <Main user={data.getUserData}></Main>
                                </div>);
                            }
                        }</Query>)
                    : (<div className="app-inner">
                        <NavBar></NavBar>
                        <Main></Main>
                    </div>)
            }
            <Footer></Footer>
        </div>);
    }
}

export default App;
