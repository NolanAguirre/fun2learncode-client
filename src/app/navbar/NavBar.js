import React, {Component} from 'react'
import './NavBar.css'
import {Link} from 'react-router-dom'
import Logo from '../logos/drawing.svg'
import SmallLogo from '../logos/small-logo.svg'
import Menu from '../logos/menu.svg'
import gql from 'graphql-tag'
import {ReactQuery} from '../../delv/delv-react'

const GET_USER_DATA = `{
    getUserData{
        nodeId
        id
        firstName
        lastName
        role
    }
}`
const admins = ['FTLC_OWNER', 'FTLC_LEAD_INSTRUCTOR', 'FTLC_ADMIN']
const routeNames = [
    {
        name: 'Home',
        route: 'Home',
        test:(user) => {
            return !user
        }
    }, {
        name: 'Manage Students',
        route: 'User/Manage Students',
        test:(user) => {
            return user && user.role === 'FTLC_USER'
        }
    }, {
        name: 'Account',
        route: 'User/Account',
        test:(user) => {
            return user && user.role === 'FTLC_USER'
        }
    }, {
        name: 'Summer Camps',
        route: 'Activity/Summer Camps',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Classes',
        route: 'Activity/Classes',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Labs',
        route: 'Activity/Labs',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Workshops',
        route: 'Activity/Workshops',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Login',
        route: 'Login',
        test:(user) => {
            return !user
        }
    },{
        name: 'Announcements',
        route: 'Admin/Announcements',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Activities',
        route: 'Admin/Manage Activities',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Events',
        route: 'Admin/Manage Events',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Addresses',
        route: 'Admin/Manage Addresses',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Users',
        route: 'Admin/Manage Users',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Write Student Logs',
        route: 'Instructor/Instructor Logs',
        test:(user) => {
            return user && user.role === 'FTLC_INSTRUCTOR'
        }
    }, {
        name: 'Check In',
        route: 'Attendant/Check In',
        test:(user) => {
            return user && user.role === 'FTLC_ATTENDANT'
        }
    }, {
        name: 'Addons',
        route: 'Admin/Manage Addons',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Promo Codes',
        route: 'Admin/Manage Promo Codes',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Logout',
        route: 'Logout',
        test:(user) => {
            return user
        }
    }
]

class NavBarInner extends Component {
    getRoutes = () => {
        return routeNames.filter((routeObj) => {
            return routeObj.test(this.props.getUserData)
        }).map((routeObj) => {
            return <Link key={routeObj.route} to={`/${routeObj.route}`}>
                <div className='nav-bar-item'>{routeObj.name}</div>
            </Link>
        })
    }
    showMenu = () => {
        const nav = document.getElementById('mobileNavbar')
        nav.classList.remove('close')
        nav.classList.add('open')
    }
    hideMenu = () => {
        const nav = document.getElementById('mobileNavbar')
        nav.classList.remove('open')
        nav.classList.add('close')
    }
    render = () => {
        const routes = this.getRoutes();
        return (<header className='navbar'>
        <div className='navbar-desktop'>
            <img className='nav-logo' alt='Fun 2 Learn Code logo' src={Logo}/>
            <div className='nav-item-container'>
                {routes}
            </div>
        </div>
        <div className='navbar-mobile'>
            <img onClick={this.showMenu} className='menu-logo'src={Menu} />
            <div id='mobileNavbar' className='nav-item-container'>
                <div className='nav-bar-item'>
                    <button onClick={this.hideMenu}>X</button>
                </div>
                {routes}
            </div>
            <img className='nav-logo' alt='Fun 2 Learn Code logo' src={SmallLogo}/>
        </div>
        </header>)
    }
}

function NavBar(props) {
    return <ReactQuery query={GET_USER_DATA}>
        <NavBarInner/>
    </ReactQuery>
}

export default NavBar
