import React from 'react';
import './NavBar.css';
import Item from './item/Item';
import Logo from '../drawing.svg';
const routeNames = [
    {
        name: 'Home',
        route: 'Home',
        test: (prop) => {
            return !prop.user
        }
    }, {
        name: 'About Us',
        route: 'About Us',
        test: (prop) => {
            return !prop.user
        }
    }, {
        name: 'Summer Camps',
        route: 'Activity/Summer Camps',
        test: (prop) => {
            return !prop.user || prop.user.role == "FTLC_USER"
        }
    }, {
        name: 'Classes',
        route: 'Activity/Classes',
        test: (prop) => {
            return !prop.user || prop.user.role == "FTLC_USER"
        }
    }, {
        name: 'Labs',
        route: 'Activity/Labs',
        test: (prop) => {
            return !prop.user || prop.user.role == "FTLC_USER"
        }
    }, {
        name: 'Workshops',
        route: 'Activity/Workshops',
        test: (prop) => {
            return !prop.user || prop.user.role == "FTLC_USER"
        }
    }, {
        name: 'Login',
        route: 'Login',
        test: (prop) => {
            return !prop.user
        }
    }, {
        name: 'Manage Students',
        route: 'User/Manage Students',
        test: (prop) => {
            return prop.user && prop.user.role == "FTLC_USER"
        }
    },{
        name: 'Account',
        route: 'User/Account',
        test: (prop) => {
            return prop.user && prop.user.role == "FTLC_USER"
        }
    }, {
        name: 'Logout',
        route: 'Logout',
        test: (prop) => {
            return prop.user
        }
    }

];
function NavBar(props) {
    const routesNameList = routeNames.filter((routeObj) => {
        return routeObj.test(props)
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
