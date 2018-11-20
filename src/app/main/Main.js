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
class Main extends Component {
  // TODO graphql caches everything, so use the queries and dont pass in the props, just requery the data each time it is needed.
  constructor (props) {
    super(props)
    this.state = { registrationEvent: null }
    this.handleRegistrationEvent = this.handleRegistrationEvent.bind(this)
  }
  handleRegistrationEvent (event) {
    this.setState({ registrationEvent: event })
  }
  render () {
    return (
      <div className='main'>
        <div className='main-contents'>
          <Switch>
            <Route exact path='/Home' component={Home} />
            <Route exact path='/Activity/:type' component={Activities} />
            <Route exact path='/Login' component={Login} />
            <Route path='/Events/:name/:id' component={Events} />
            <Route path='/Registration/:id' component={Registration} />
            <Route path='/User/Manage Students' component={ManageStudents} />
            <Route path='/Event Logs/:eventId/:studentId' component={EventLogs} />
            <Route exact path='/Admin/Manage Events' component={ManageEvents} />
            <Route exact path='/Admin/Manage Addresses' component={ManageAddresses} />
            <Route exact path='/Admin/Manage Activities' component={ManageActivities} />
            <Route exact path='/Logout' component={Logout} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default Main
