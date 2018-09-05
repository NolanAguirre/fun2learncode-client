import React, {Component} from 'react';
import './App.css';
import NavBar from './navbar/NavBar';
import Main from './main/Main';
import Footer from './footer/Footer'

class App extends Component {
    render() {
        return (
        <div className="app">
            <NavBar routeNames={this.props.routeNames}></NavBar>
            <Main></Main>
            <Footer></Footer>
        </div>);
    }
}

export default App;
