import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import './Main.css';
import Home from './home/Home';
import Activities from './activities/Activities';
import Events from './events/Events';
import Login from './login/Login';
import Registration from './registration/Registration'
import ManageStudents from './manageStudents/ManageStudents'
class Main extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className='main'>
                <div className="main-contents">
                    <Switch>
                        <Route exact path='/Home' component={Home}/>
                        <Route exact path='/Activity/:type' component={Activities}/>
                        <Route exact path='/Login' component={Login}/>
                        <Route path="/Events/:name/:id" component={Events}/>
                        <Route path="/Registration/:id" render={(props)=><Registration {...this.props}{...props}></Registration>}/>
                        <Route path="/User/Manage Students" render={(props)=><ManageStudents {...this.props}{...props}></ManageStudents>}/>
                </Switch>
            </div>
        </div>);
    }
}

export default Main;
