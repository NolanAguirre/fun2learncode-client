import React from 'react';
import './NavBar.css';
import Item from './item/Item';
import Logo from '../logos/drawing.svg';

function NavBar(props) {
    const routeNames = [
        {
            name: 'Home',
            route: 'Home',
            test: () => {
                return !props.user
            }
        }, {
            name: 'About Us',
            route: 'About Us',
            test: () => {
                return !props.user
            }
        }, {
            name: 'Manage Students',
            route: 'User/Manage Students',
            test: () => {
                return props.user && props.user.role === "FTLC_USER"
            }
        }, {
            name: 'Account',
            route: 'User/Account',
            test: () => {
                return props.user && props.user.role === "FTLC_USER"
            }
        }, {
            name: 'Summer Camps',
            route: 'Activity/Summer Camps',
            test: () => {
                return !props.user || props.user.role === "FTLC_USER"
            }
        }, {
            name: 'Classes',
            route: 'Activity/Classes',
            test: () => {
                return !props.user || props.user.role === "FTLC_USER"
            }
        }, {
            name: 'Labs',
            route: 'Activity/Labs',
            test: () => {
                return !props.user || props.user.role === "FTLC_USER"
            }
        }, {
            name: 'Workshops',
            route: 'Activity/Workshops',
            test: () => {
                return !props.user || props.user.role === "FTLC_USER"
            }
        }, {
            name: 'Login',
            route: 'Login',
            test: () => {
                return !props.user
            }
        }, {
            name: 'Manage Events',
            route: 'Admin/Manage Events',
            test: () =>{
                return props.user && props.user.role === "FTLC_INSTRUCTOR"
            }
        }, {
            name: 'Manage Addresses',
            route: 'Admin/Manage Addresses',
            test: () =>{
                return props.user && props.user.role === "FTLC_INSTRUCTOR"
            }
        }, {
            name: 'Manage Users',
            route: 'Admin/Manage Users',
            test: () =>{
                return props.user && props.user.role === "FTLC_INSTRUCTOR"
            }
        }, {
            name: 'Logout',
            route: 'Logout',
            test: () => {
                return props.user
            }
        }
    ];
    const routesNameList = routeNames.filter((routeObj) => {
        return routeObj.test()
    }).map((routeObj) => {
        return <Item key={routeObj.route} route={routeObj.route} name={routeObj.name}></Item>;
    })
    return (<header className="navbar">
        <img alt="Fun 2 Learn Code logo" src={Logo}></img>
        <div className="nav-item-container">
            {routesNameList}
        </div>
    </header>);
}

export default NavBar;
