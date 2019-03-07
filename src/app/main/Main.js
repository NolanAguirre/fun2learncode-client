import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import './Main.css'
import Home from './home/Home'
import Activities from './activities/Activities'
import Events from './events/Events'
import Login from './login/Login'
import Registration from './registration/Registration'
import ManageStudents from './manageStudents/ManageStudents'
import Logout from './logout/Logout'
import EventLogs from './eventLogs/EventLogs'
import ManageEvents from './manageEvents/ManageEvents'
import ManageAddresses from './manageAddresses/ManageAddresses'
import ManageActivities from './manageActivities/ManageActivities'
import ManageAddons from './manageAddons/ManageAddons'
import ManageUsers from  './manageUsers/ManageUsers'
import ManageNewsLetter from './manageNewsLetter/ManageNewsLetter'
import ManageAnnouncements from './manageAnnouncements/ManageAnnouncements'
import {SignUp} from './signUp/SignUp'
import CheckIn from './checkIn/CheckIn'
import Account from './account/Account'
import Test from './test/Test'
import ManagePromoCodes from './managePromoCodes/ManagePromoCodes'
import ResetPassword from './resetPassword/ResetPassword'
import RecoverPassword from './recoverPassword/RecoverPassword'
import RecentEvents from './recentEvents/RecentEvents'

class Main extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className='main'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/Activity/:type' component={Activities} />
            <Route exact path='/Login' component={Login} />
            <Route path='/Events/:name/:id' component={Events} />
            <Route exact path='/Sign up' component={SignUp} />

            <Route path='/Registration/:id' component={Registration} />
            <Route path='/Private/Registration/:id' component={Registration} />
            <Route exact path='/User/Manage Students' component={ManageStudents} />
            <Route path='/Logs/:eventId/:studentId' component={EventLogs} />
            <Route path='/User/Account' component={Account} />
            <Route path='/reset/:token' component={ResetPassword} />
            <Route path='/recover' component={RecoverPassword} />

            <Route exact path='/Admin/Manage Events' component={ManageEvents} />
            <Route exact path='/Admin/Manage Addresses' component={ManageAddresses} />
            <Route exact path='/Admin/Manage Activities' component={ManageActivities} />
            <Route exact path='/Admin/Manage Addons' component={ManageAddons} />
            <Route exact path='/Admin/Manage Users' component={ManageUsers} />
            <Route exact path='/Admin/Manage Promo Codes' component={ManagePromoCodes} />
            <Route exact path='/Admin/Announcements' component={ManageAnnouncements} />
            <Route exact path='/Admin/News Letter' component={ManageNewsLetter} />
            <Route exact path='/Recent Events' component={RecentEvents} />

            <Route exact path='/test' component={Test} />

            <Route exact path='/Attendant/Check In' component={CheckIn} />

            <Route exact path='/Logout' component={Logout} />
          </Switch>
      </div>
    )
  }
}

export default Main
