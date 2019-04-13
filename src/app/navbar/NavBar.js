import React, {Component} from 'react'
import './NavBar.css'
import {Link} from 'react-router-dom'
import Logo from '../logos/drawing.svg'
import xicon from '../logos/x-icon.svg'
import SmallLogo from '../logos/small-logo.svg'
import Menu from '../logos/menu.svg'
import {ReactQuery} from '../../delv/delv-react'

const GET_USER_DATA = `{
    getUserData{
        id
        firstName
        lastName
        role
    }
}`
const admins = ['FTLC_OWNER', 'FTLC_ADMIN']
const employee = ['FTLC_OWNER', 'FTLC_INSTRUCTOR', 'FTLC_ADMIN']
const routeNames = [
    {
        name: 'Home',
        route: '',
        test:(user) => {
            return !user || !admins.includes(user.role)
        }
    }, {
        name: 'Students',
        route: 'user/manage-students',
        test:(user) => {
            return user && user.role === 'FTLC_USER'
        }
    }, {
        name: 'Account',
        route: 'user/account',
        test:(user) => {
            return user && user.role === 'FTLC_USER'
        }
    }, {
        name: 'Summer Camps',
        route: 'activity/summer-camps',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Classes',
        route: 'activity/classes',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Labs',
        route: 'activity/labs',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'workshops',
        route: 'activity/workshops',
        test:(user) => {
            return !user || user.role === 'FTLC_USER'
        }
    }, {
        name: 'Login',
        route: 'login',
        test:(user) => {
            return !user
        }
    },{
        name: 'Recent Events',
        route: 'recent-events',
        test:(user) => {
            return user && employee.includes(user.role)
        }
    },{
        name: 'News Letter',
        route: 'admin/news-letter',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    },{
        name: 'Announcements',
        route: 'admin/announcements',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Activities',
        route: 'admin/manage-activities',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Events',
        route: 'admin/manage-events',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Addresses',
        route: 'admin/manage-addresses',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Users',
        route: 'admin/manage-users',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Check In',
        route: 'attendant/check-in',
        test:(user) => {
            return user && user.role === 'FTLC_ATTENDANT'
        }
    }, {
        name: 'Addons',
        route: 'admin/manage-addons',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Promo Codes',
        route: 'admin/manage-promo-codes',
        test:(user) => {
            return user && admins.includes(user.role)
        }
    }, {
        name: 'Logout',
        route: 'logout',
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
                <div onClick={this.hideMenu} className='nav-bar-item'>{routeObj.name}</div>
            </Link>
        })
    }
    showMenu = () => {
        const nav = document.getElementById('mobileNavbar')
        if(nav){
            nav.classList.remove('close')
            nav.classList.add('open')
        }
    }
    hideMenu = () => {
        const nav = document.getElementById('mobileNavbar')
        if(nav){
            nav.classList.remove('open')
            nav.classList.add('close')
        }
    }
    render = () => {
        const routes = this.getRoutes();
        return (<header>
        <div className='navbar-desktop'>
            <img className='nav-logo' alt='Fun 2 Learn Code logo' src={Logo}/>
            <div className='nav-item-container'>
                {routes}
            </div>
        </div>
        <div className='navbar-mobile'>
            <img onClick={this.showMenu} className='menu-logo'src={Menu} />
            <div id='mobileNavbar' className='nav-item-container'>
                <div className='close-nav'>
                    <img onClick={this.hideMenu} src={xicon}/>
                </div>
                {routes}
            </div>
            <img className='nav-logo' alt='Fun 2 Learn Code logo' src={SmallLogo}/>
        </div>
        </header>)
    }
}

function NavBar(props) {
    return <ReactQuery query={GET_USER_DATA} skipLoading>
        <NavBarInner/>
    </ReactQuery>
}

export default NavBar
