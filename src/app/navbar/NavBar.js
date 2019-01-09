import React from 'react'
import './NavBar.css'
import {Link} from 'react-router-dom'
import Logo from '../logos/drawing.svg'
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

function NavBarInner(props) {
    const admins = ['FTLC_OWNER', 'FTLC_LEAD_INSTRUCTOR', 'FTLC_ADMIN']
    const user = props.queryResult.getUserData
    const routeNames = [
        {
            name: 'Home',
            route: 'Home',
            test: () => {
                return !user
            }
        }, {
            name: 'About Us',
            route: 'About Us',
            test: () => {
                return !user
            }
        }, {
            name: 'Manage Students',
            route: 'User/Manage Students',
            test: () => {
                return user && user.role === 'FTLC_USER'
            }
        }, {
            name: 'Account',
            route: 'User/Account',
            test: () => {
                return user && user.role === 'FTLC_USER'
            }
        }, {
            name: 'Summer Camps',
            route: 'Activity/Summer Camps',
            test: () => {
                return !user || user.role === 'FTLC_USER'
            }
        }, {
            name: 'Classes',
            route: 'Activity/Classes',
            test: () => {
                return !user || user.role === 'FTLC_USER'
            }
        }, {
            name: 'Labs',
            route: 'Activity/Labs',
            test: () => {
                return !user || user.role === 'FTLC_USER'
            }
        }, {
            name: 'Workshops',
            route: 'Activity/Workshops',
            test: () => {
                return !user || user.role === 'FTLC_USER'
            }
        }, {
            name: 'Login',
            route: 'Login',
            test: () => {
                return !user
            }
        },{
            name: 'Archive',
            route: 'Admin/Archive',
            test: () => {
                return user && admins.includes(user.role)
            }
        }, {
            name: 'Manage Activities',
            route: 'Admin/Manage Activities',
            test: () => {
                return user && admins.includes(user.role)
            }
        }, {
            name: 'Manage Events',
            route: 'Admin/Manage Events',
            test: () => {
                return user && admins.includes(user.role)
            }
        }, {
            name: 'Manage Addresses',
            route: 'Admin/Manage Addresses',
            test: () => {
                return user && admins.includes(user.role)
            }
        }, {
            name: 'Manage Users',
            route: 'Admin/Manage Users',
            test: () => {
                return user && admins.includes(user.role)
            }
        }, {
            name: 'Check In',
            route: 'Attendant/Check In',
            test: () => {
                return user && user.role === 'FTLC_ATTENDANT'
            }
        }, {
            name: 'Manage Addons',
            route: 'Admin/Manage Addons',
            test: () => {
                return user && admins.includes(user.role)
            }
        }, {
            name: 'Logout',
            route: 'Logout',
            test: () => {
                return user
            }
        }
    ]
    const routesNameList = routeNames.filter((routeObj) => {
        return routeObj.test()
    }).map((routeObj) => {
        return <Link key={routeObj.route} to={`/${routeObj.route}`}>
            <div className='nav-bar-item'>{routeObj.name}</div>
        </Link>
    })

    return (<header className='navbar'>
        <img alt='Fun 2 Learn Code logo' src={Logo}/>
        <div className='nav-item-container'>
            {routesNameList}
        </div>
    </header>)
}

function NavBar(props) {
    return <ReactQuery query={GET_USER_DATA}>
        <NavBarInner/>
    </ReactQuery>
}

export default NavBar
