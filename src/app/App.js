import React, {Component} from 'react';
import './App.css';
import NavBar from './navbar/NavBar';
import Main from './main/Main';
import Footer from './footer/Footer'
import axios from 'axios';
import UserStore from './Store'
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
const GET_USER = gql`
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
        UserStore.addEvent({authToken:(token)=>{this.handleAuthToken(token)}})
    }
    handleAuthToken(obj){
        this.setState(obj)
        if(obj.authToken){
            localStorage.setItem('authToken', obj.authToken);
        }else{
            localStorage.removeItem('authToken');
        }
    }
    render() {
        return (<div className="app-container">
        <Query query={GET_USER}>{
            ({loading, error, data}) => {
                if (loading) {
                    return 'Loading...';
                }
                if (error) {
                    return `Error! ${error.message}`;
                }
                return(
                    <div className="app-inner">
                        <NavBar user={data.getUserData}></NavBar>
                        <Main user={data.getUserData}></Main>
                    </div>
                );
        }
            }</Query>
            <Footer></Footer>
        </div>);
    }
}

export default App;
