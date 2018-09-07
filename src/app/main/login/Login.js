import React, {Component} from 'react';
import './Login.css';
import axios from 'axios';
class Login extends Component{
    render(){
        return (<div className="login">
    <div className="login-container">
        <div className="login-widget">
            <div className="login-headers">
                <a><img className="nav-logo" src="https://raw.githubusercontent.com/Fun2LearnCode/company-logo-assets/master/resources/exported%20pictures/f2lc-logo.png?token=AJvhOqDp9aWM4gIruJw3aa4_8PxjHUQSks5bmGk8wA%3D%3D"></img></a>
            </div>
            <form  className="login-form">
                <input placeholder="email"></input>
                <input placeholder="password"></input>
                <button>Sign In</button>
            </form>
        </div>
    </div>
</div>)
    }
}
export default Login;
