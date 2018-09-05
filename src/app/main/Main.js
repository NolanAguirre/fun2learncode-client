import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import './Main.css';
import Home from './home/Home';
class Main extends Component {
    render() {
        return (
            <div className='main'>
                <Switch>
                    <Route exact path='/Home' component={Home}/>
                </Switch>
        </div>);
    }
}

export default Main;
