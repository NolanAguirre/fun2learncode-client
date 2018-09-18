import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import './Main.css';
import Home from './home/Home';
import Activities from './activities/Activities';
import Events from './events/Events';
import Login from './login/Login';
import Registration from './registration/Registration';
import ManageStudents from './manageStudents/ManageStudents';
import Logout from './logout/Logout';
import EventLogs from './eventLogs/EventLogs';
import ManageEvents from './manageEvents/ManageEvents';
class Main extends Component {
    constructor(props){
        super(props);
        this.state = {registrationEvent:null}
        this.handleRegistrationEvent = this.handleRegistrationEvent.bind(this);
    }
    handleRegistrationEvent(event){
        this.setState({registrationEvent:event});
    }
    render() {
        return (
            <div className='main'>
                <div className="main-contents">
                    <Switch>
                        <Route exact path='/Home' component={Home}/>
                        <Route exact path='/Activity/:type' component={Activities}/>
                        <Route exact path='/Login' component={Login}/>
                        <Route path="/Events/:name/:id" render={(props)=><Events click={this.handleRegistrationEvent}{...props}></Events>}/>
                        <Route path="/Registration/:id" render={(props)=><Registration event={this.state.registrationEvent} {...this.props}{...props}></Registration>}/>
                        <Route path="/User/Manage Students" render={(props)=><ManageStudents {...this.props}{...props}></ManageStudents>}/>
                        <Route path="/Event Logs/:eventId/:studentId" render={(props)=><EventLogs {...this.props}{...props}></EventLogs>}/>
                        <Route exact path="/Admin/Manage Events" render={(props)=><ManageEvents {...this.props} {...props}></ManageEvents>}/>
                        <Route exact path="/Logout" component={Logout}/>
                    </Switch>
            </div>
        </div>);
    }
}

export default Main;
