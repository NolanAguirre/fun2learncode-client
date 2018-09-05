import React, {Component} from 'react';
import './App.css';
import NavBar from './navbar/NavBar';
import Main from './main/Main';

class App extends Component {
    render() {
        return (
        <div className="app">
            <NavBar routeNames={this.props.routeNames}></NavBar>
            <Main></Main>
        </div>);
    }
}

export default App;
