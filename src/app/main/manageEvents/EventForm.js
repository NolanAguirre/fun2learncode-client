import React, {Component} from 'react';
import {DropDown, EventDropDownInner} from '../common/Common';
import './EventForm.css';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import Colors from '../calendar/Colors'
import EventsPreview from './EventsPreview';
import moment from 'moment';
import Popup from "reactjs-popup"
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import Logo from '../../logos/x-icon.svg'

const GET_DROPDOWN = `{
  allAddresses {
    nodes {
      id
      alias
    }
  }
  allActivities {
    nodes {
      id
      name
      categoryByCategory {
        name
        id
      }
    }
  }
  allAddOns {
    nodes {
      id
      name
      description
    }
  }
}`

const CREATE_EVENT= `mutation ($event: EventInput!) {
  createEvent(input: {event: $event}) {
    event {
      id
      archive
      price
      seatsLeft
      capacity
      name
      openRegistration
      closeRegistration
      activity
      address
      showCalendar
      addOnJoinsByEvent {
        nodes {
          id
        }
      }
      activityByActivity {
        id
      }
      addressByAddress {
        alias
        id
      }
      dateJoinsByEvent {
        nodes {
          id
        }
      }
    }
  }
}`

const UPDATE_EVENT= `mutation ($id: UUID!, $event: EventPatch!) {
  updateEventById(input: {id: $id, eventPatch: $event}) {
    event {
      id
      archive
      price
      seatsLeft
      capacity
      name
      openRegistration
      closeRegistration
      activity
      address
      activityByActivity {
        id
      }
      addressByAddress {
        alias
        id
      }
    }
  }
}`

const REMOVE_ADDON = `mutation ($id: UUID!) {
  deleteAddOnJoinById(input: {id: $id}) {
    addOnJoin {
      id
      addOnByAddOn {
        id
      }
      eventByEvent {
        id
      }
    }
  }
}`

const CREATE_ADDON = `mutation ($addon: CreateAddOnJoinInput!) {
  createAddOnJoin(input: $addon) {
    addOnJoin {
      id
      addOnByAddOn {
        id
      }
      eventByEvent {
        id
      }
    }
  }
}`

function AddonJoins(props) {
    if(!props.addons){
        return <div></div>
    }
    return props.addons.map((addon) => {
        const mutation = new Mutation({
            mutation: REMOVE_ADDON,
            onSubmit: (event) => {
                event.preventDefault();
                return {id: addon.id}
            },
            customCache: (cache, data) => {cache.remove(data)}
        })
        return <form onSubmit={mutation.onSubmit} key={addon.id}>
            <div className="prerequisite-container">
                {addon.addOnByAddOn.name}
                <div className="prerequisite-x-container">
                    <button className="no-style-button" type="submit">
                        <img className="x-icon" alt='x-icon' src={Logo}/>
                    </button>
                </div>
            </div>
        </form>
    })
}

class AddonJoinForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addon: undefined,
            edit:false
        }
        this.mutation = new Mutation({mutation: CREATE_ADDON, onSubmit: this.handleSubmit})
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    toggleEdit = () => {
        this.setState({
            edit: !this.state.edit
        })
    }

    handleSubmit = (event) => { // TODO implement hasRequiredValues
        event.preventDefault();
        if (this.state.addon != undefined) {
            let addOnJoin = {
                addOn: this.state.addon,
                event: this.props.event
            }
            this.setState({edit: false, addon: undefined});
            return {addon: {addOnJoin}}
        }
        this.setState({edit: false, addon: undefined});
        return false;
    }

    render = () => {
        if (this.state.edit) { // this can use caching
            return <div>
                <form onSubmit={this.mutation.onSubmit}>
                    <DropDown options={this.props.addons} name="addon" value={this.state.addon} onChange={this.handleChange}/>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        } else {
            return <div>
                <button onClick={this.toggleEdit}>Add addon</button>
            </div>
        }
    }
}

class EventFormInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name || "",
            price: props.price || 100,
            capacity: props.capacity || 8,
            address: props.address,
            openRegistration: this.localizeUTCTimestamp(props.openRegistration) || new Date(moment().hour(23).minute(59).second(59).millisecond(999).toString()),
            closeRegistration: this.localizeUTCTimestamp(props.closeRegistration) || new Date(moment().add(1, "days").hour(23).minute(59).second(59).millisecond(999).toString()),
            archive: false || this.props.archive,
            activity: this.props.activity
        }
        this.mutation = new Mutation({mutation: this.props.mutation, onSubmit: this.handleSubmit})

    }
    localizeUTCTimestamp = (timestamp) => {
        if (!timestamp) {
            return null
        }
        return new Date(moment(moment.utc(timestamp)).local().toString())
    }
    normalizeDate = (date) => {
        return new Date(this.localizeUTCTimestamp(date)).toISOString()
    }
    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }

    hasRequiredValues = () => {
        let haveValues = this.state.name != "" && this.state.address
        let changedValues = this.state.name != this.props.name ||
        this.normalizeDate(this.state.openRegistration) != this.normalizeDate(this.props.openRegistration) ||
        this.normalizeDate(this.state.closeRegistration) != this.normalizeDate(this.props.closeRegistration) ||
        this.state.address != this.props.address ||
        this.state.capacity != this.props.capacity ||
        this.state.archive != this.props.archive
        return haveValues && changedValues
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        if(name === 'capacity' && this.props.capacity){
            if(value - (this.props.capacity - this.props.seatsLeft) < 0){
                this.setState({error:`There are already ${(this.props.capacity - this.props.seatsLeft)} people signed up`})
                return;
            }
            this.setState({error:null})
        }
        this.setState({[name]: value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.handleSubmit();
        if (this.hasRequiredValues()) {
            let event = {
                activity: this.state.activity,
                openRegistration: this.state.openRegistration.toISOString(),
                closeRegistration: this.state.closeRegistration.toISOString(),
                price: this.state.price,
                capacity: this.state.capacity,
                seatsLeft: this.state.capacity - (this.props.capacity - this.props.seatsLeft) || this.state.capacity,
                address: this.state.address,
                name: this.state.name,
                archive:this.state.archive
            }

            return {"id": this.props.id,  event}
        }
        return false
    }

    mapAddresses = (data) => data.nodes.map((element) => {
        return {name: element.alias, value: element.id}
    })

    mapAddons = (data) => data.nodes.map((element) => {
        return {name: element.name, value: element.id}
    })

    render() {
        const addresses = this.mapAddresses(this.props.allAddresses);
        const addonOptions = this.mapAddons(this.props.allAddOns);
        const addons = this.props.addOnJoinsByEvent && this.props.addOnJoinsByEvent.nodes.map(addon => addon)
        return <div className="styled-container column no-margin">
            <h2 className='center-text no-margin'>{(this.props.id)?'Edit':'Create'} Event</h2>
            <div className='error'>{this.state.error}</div>
            <div className='date-form-inner'>
                <div>
                    <form onSubmit={this.mutation.onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Activity</td>
                                    <td><EventDropDownInner name='activity' value={this.state.activity} allActivities={this.props.allActivities} onChange={this.handleChange}/></td>
                                </tr>
                                <tr className='no-wrap-row'>
                                    <td>Set Name: </td>
                                    <td><input className="full-date-input" name={"name"} value={this.state.name} onChange={this.handleChange}/></td>
                                </tr>
                                <tr>
                                    <td>Set Start: </td>
                                    <td><DateTime className="full-date-input" dateFormat="MMM Do YYYY" timeFormat="H:mm"  value={this.state.openRegistration} onChange={(time) => {this.handleTimeChange("openRegistration", time)}}/></td>
                                </tr>
                                <tr>
                                    <td>Set End: </td>
                                    <td><DateTime className="full-date-input" dateFormat="MMM Do YYYY" timeFormat="H:mm" value={this.state.closeRegistration} onChange={(time) => {this.handleTimeChange("closeRegistration", time)}}/></td>
                                </tr>
                                <tr>
                                    <td>Location: </td>
                                    <td>
                                        <DropDown name="address" options={addresses} value={this.state.address} onChange={this.handleChange}></DropDown>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Price: </td>
                                    <td>
                                        <input name="price" value={this.state.price} onChange={this.handleChange} type="number"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Capacity: </td>
                                    <td>
                                        <input name="capacity" value={this.state.capacity} onChange={this.handleChange} type="number"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Archive: </td>
                                    <td>
                                        <input checked={this.state.archive} name='archive' type='checkbox'  onChange={this.handleChange}></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>

                {(this.props.id)?<div>
                        <AddonJoins event={this.props.id} addons={addons}/>
                        <AddonJoinForm event={this.props.id} addons={addonOptions}/></div>:""}

            </div>
            <div className='event-register-btn center-text margin-top-10' onClick={this.mutation.onSubmit}>{(this.props.id)?'Update':'Create'}</div>
        </div>
    }
}

class EventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        }
    }
    showPopup = () => {
        this.setState({showPopup: true});
    }
    clearPopupState = () => {
        this.setState({showPopup: false});
    }

    render = () => {
        return <div>
            <Popup className='payment-overview-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <ReactQuery query={GET_DROPDOWN}>
                    <EventFormInner {...this.props} handleSubmit={this.clearPopupState} mutation={(
                            this.props.id)
                            ? UPDATE_EVENT
                            : CREATE_EVENT}/>
                </ReactQuery>
            </Popup>
            <div onClick={this.showPopup}>
                {this.props.buttonText || <div className='styled-button'>Create new event</div>}
            </div>
        </div>
    }
}

export default EventForm;
