import React, {Component} from 'react';
import './Registration.css';
import Login from '../login/Login';
import axios from 'axios';
class Registration extends Component{
    render(){
        if(this.props.user){
            return (<div className="registration-container"></div>);
        }else{
            console.log(this.props);
            return (<Login history={this.props.history} redirectUrl={this.props.location.pathname}></Login>)
        }
    }
}

export default Registration;
