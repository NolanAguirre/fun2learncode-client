import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import './Main.css';
import Home from './home/Home';
import Activities from './activities/Activities';
import Events from './events/Events';
import Login from './login/Login';
import Registration from './registration/Registration'
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
                    <Route path="/Events/:id" component={Events}/>
                    <Route path="/Registration/:id" component={Registration}/>
                </Switch>
            </div>
        </div>);
    }
}

export default Main;
