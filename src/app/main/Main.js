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
            <Route exact path='/activity/:type' component={Activities} />
            <Route exact path='/login' component={Login} />
            <Route path='/events/:name/:id' component={Events} />
            <Route exact path='/sign-up' component={SignUp} />

            <Route path='/registration/:id' component={Registration} />
            <Route path='/private/registration/:id' component={Registration} />
            <Route exact path='/user/manage-students' component={ManageStudents} />
            <Route path='/logs/:eventId/:studentId' component={EventLogs} />
            <Route path='/user/account' component={Account} />
            <Route path='/reset/:token' component={ResetPassword} />
            <Route path='/recover' component={RecoverPassword} />

            <Route exact path='/admin/manage-events' component={ManageEvents} />
            <Route exact path='/admin/manage-addresses' component={ManageAddresses} />
            <Route exact path='/admin/manage-activities' component={ManageActivities} />
            <Route exact path='/admin/manage-addons' component={ManageAddons} />
            <Route exact path='/admin/manage-users' component={ManageUsers} />
            <Route exact path='/admin/manage-promo-codes' component={ManagePromoCodes} />
            <Route exact path='/admin/announcements' component={ManageAnnouncements} />
            <Route exact path='/admin/news-letter' component={ManageNewsLetter} />
            <Route exact path='/recent-events' component={RecentEvents} />

            <Route exact path='/test' component={Test} />

            <Route exact path='/attendant/check-in' component={CheckIn} />

            <Route exact path='/logout' component={Logout} />
          </Switch>
      </div>
    )
  }
}

export default Main
