import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import './Main.css';
import Home from './home/Home';
import Activities from './activities/Activities'
class Main extends Component {
    render() {
        return (
            <div className='main'>
                <Switch>
                    <Route exact path='/Home' component={Home}/>
                    <Route exact path='/Summer Camps' render={(props)=><Activities type="Summer Camps"/>}/>
                    <Route exact path='/Classes' render={(props)=><Activities type="Classes"/>}/>
                    <Route exact path='/Labs' render={(props)=><Activities type="Labs"/>}/>
                    <Route exact path='/Workshops' render={(props)=><Activities type="Workshops"/>}/>
                </Switch>
        </div>);
    }
}

export default Main;
