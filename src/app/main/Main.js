import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import './Main.css';
import Home from './home/Home';
import Activity from './activity/Activity'
class Main extends Component {
    render() {
        return (
            <div className='main'>
                <Switch>
                    <Route exact path='/Home' component={Home}/>
                    <Route exact path='/Summer Camps' render={(props)=><Activity type="Summer Camps"/>}/>
                    <Route exact path='/Classes' render={(props)=><Activity type="Classes"/>}/>
                    <Route exact path='/Labs' render={(props)=><Activity type="Labs"/>}/>
                    <Route exact path='/Workshops' render={(props)=><Activity type="Workshops"/>}/>
                </Switch>
        </div>);
    }
}

export default Main;
