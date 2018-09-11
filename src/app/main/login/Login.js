import React, {Component} from 'react';
import './Login.css';
import axios from 'axios';
class Login extends Component{
    constructor(props){
        super(props);
        this.state = {email:"", password:""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSubmit(event){
        axios.post('http://localhost:3005/graphql',{query:`mutation{
          authenticate(input:{arg0:"${this.state.email}"password:"${this.state.password}"}){
        		jwtToken
          }
        }`}).then((res)=>{
            console.log(res);
            this.props.history.push(this.props.redirectUrl || '/');
        })
        event.preventDefault();
    }
    render(){
        return (<div className="login">
    <div className="login-container">
        <div className="login-widget">
            <div className="login-headers">
                <a><img className="nav-logo" src="https://raw.githubusercontent.com/Fun2LearnCode/company-logo-assets/master/resources/exported%20pictures/f2lc-logo.png?token=AJvhOqDp9aWM4gIruJw3aa4_8PxjHUQSks5bmGk8wA%3D%3D"></img></a>
            </div>
            <form onSubmit={this.handleSubmit} className="login-form">
                <input name="email" type="email" onChange={this.handleChange}placeholder="email"></input>
                <input name="password" type="password" onChange={this.handleChange}placeholder="password"></input>
                <button onClick={this.handleSubmit}>Sign In</button>
            </form>
        </div>
    </div>
</div>)
    }
}
export default Login;
