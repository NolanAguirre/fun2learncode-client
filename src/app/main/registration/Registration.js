import React, {Component} from 'react';
import './Registration.css';
import Login from '../login/Login';
import StudentSelect from '../studentSelect/StudentSelect';
class Registration extends Component{
    render(){
        if(this.props.user){
            return (
                <div className="registration-container">
                    <StudentSelect user={this.props.user}></StudentSelect>
                </div>);
        }else{
            return (<Login history={this.props.history} redirectUrl={this.props.location.pathname}></Login>)
        }
    }
}

export default Registration;
