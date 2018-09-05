import React from 'react';
import './NavBar.css'
import Item from './item/Item'
function NavBar(props) {
    const routeNames = props.routeNames;
    const routesNameList = routeNames.map((routeName) => {
        return <Item key={routeName} name={routeName}></Item>;
    })
    return (
    <header className="navbar">
        <div>
            <img className="nav-logo" src="https://raw.githubusercontent.com/Fun2LearnCode/company-logo-assets/master/resources/exported%20pictures/f2lc-logo.png?token=AJvhOqDp9aWM4gIruJw3aa4_8PxjHUQSks5bmGk8wA%3D%3D"></img>
        </div>
        <div className="nav-item-container">
            {routesNameList}
        </div>
    </header>);
}

export default NavBar;
