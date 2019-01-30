import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './DateGroupForm.css';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import Colors from '../calendar/Colors'
import EventsPreview from './EventsPreview';
import moment from 'moment';
import Popup from "reactjs-popup"
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import Logo from '../../logos/x-icon.svg'
import DateStore from '../../DateStore';
const GET_ADDRESSES = `{
    allAddresses {
        nodes {
            nodeId
            id
            alias
        }
    }
    allAddOns{
    nodes{
      id
      nodeId
      name
      description
    }
  }
}`

const CREATE_DATE_GROUP = `mutation ($dateGroup: DateGroupInput!) {
  createDateGroup(input: {dateGroup: $dateGroup}) {
      dateGroup {
          event
          archive
          eventByEvent{
              nodeId
          }
          address
          addressByAddress {
            nodeId
            alias
            id
          }
          price
          seatsLeft
          capacity
          nodeId
          id
          name
          openRegistration
          closeRegistration
          datesJoinsByDateGroup {
            nodes {
              nodeId
          }
        }
      }
  }
 }`

const UPDATE_DATE_GROUP = `mutation ($id: UUID!, $dateGroup: DateGroupPatch!) {
  updateDateGroupById(input: {id: $id, dateGroupPatch: $dateGroup}) {
      dateGroup {
          event
          archive
          eventByEvent{
              nodeId
          }
          address
          addressByAddress {
            nodeId
            alias
            id
          }
          price
          seatsLeft
          capacity
          nodeId
          id
          name
          openRegistration
          closeRegistration
          datesJoinsByDateGroup {
            nodes {
              nodeId
          }
        }
      }
  }
}`

const REMOVE_ADDON = `mutation ($id: UUID!) {
  deleteAddOnJoinById(input: {id: $id}) {
    addOnJoin {
      nodeId
      addOnByAddOn {
        nodeId
      }
      dateGroupByDateGroup {
        nodeId
      }
    }
  }
}`

const CREATE_ADDON = `mutation($addon:CreateAddOnJoinInput!){
  createAddOnJoin(input:$addon){
    addOnJoin{
      nodeId
      id
      addOnByAddOn{
        nodeId
      }
      dateGroupByDateGroup{
        nodeId
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

    handleInputChange = (event) => {
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
                dateGroup: this.props.dateGroup
            }
            this.setState({edit: false, addon: undefined});
            return {addon: {
                    addOnJoin
                }}
        }
        this.setState({edit: false, addon: undefined});
        return false;
    }

    render = () => {
        if (this.state.edit) { // this can use caching
            return <div>
                <form onSubmit={this.mutation.onSubmit}>
                    <DropDown options={this.props.addons} name="addon" value={this.state.addon} onChange={this.handleInputChange}/>
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

class DateGroupFormInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name || "",
            price: props.price || 100,
            capacity: props.capacity || 8,
            address: props.address,
            openRegistration: this.localizeUTCTimestamp(props.openRegistration) || new Date(moment().hour(23).minute(59).toString()),
            closeRegistration: this.localizeUTCTimestamp(props.closeRegistration) || new Date(moment().add(1, "days").hour(23).minute(59).toString()),
            archive: false || this.props.archive
        }
        this.mutation = new Mutation({mutation: this.props.mutation, onSubmit: this.handleSubmit})

    }
    toggleCalendarHide = () => {
        // date store has a list of hidden date groups, this will remove or add this date group.
        const id = this.props.id
        if(DateStore.get('hidden') == undefined){
            DateStore.set('hidden', [])
        }
        if(DateStore.get('hidden').includes(id)){
        }else{
            DateStore.set('hidden',[...DateStore.get('hidden'), id])
        }
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
            if(this.state.archive){
                this.toggleCalendarHide()
            }
            let dateGroup = {
                event: this.props.event,
                openRegistration: this.state.openRegistration.toISOString(),
                closeRegistration: this.state.closeRegistration.toISOString(),
                price: this.state.price,
                capacity: this.state.capacity,
                seatsLeft: this.state.capacity - (this.props.capacity - this.props.seatsLeft) || this.state.capacity,
                address: this.state.address,
                name: this.state.name,
                archive:this.state.archive
            }

            return {"id": this.props.id, "dateGroup": dateGroup}
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
        const addons = this.props.addOnJoinsByDateGroup && this.props.addOnJoinsByDateGroup.nodes.map(addon => addon)
        return <div className="styled-container column no-margin">
            <h2 className='center-text no-margin'>{(this.props.id)?'Edit':'Create'} Date Group</h2>
            <span className='error'>{this.state.error}</span>
            <div className='date-form-inner'>
                <div>
                    <form onSubmit={this.mutation.onSubmit}>
                        <table>
                            <tbody>
                                <tr className='no-wrap-row'>
                                    <td>Set Name: </td>
                                    <td><input className="full-date-input" name={"name"} value={this.state.name} onChange={this.handleChange}/></td>
                                </tr>
                                <tr>
                                    <td>Set Start: </td>
                                    <td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={this.state.openRegistration} onChange={(time) => {this.handleTimeChange("openRegistration", time)}}/></td>
                                </tr>
                                <tr>
                                    <td>Set End: </td>
                                    <td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={this.state.closeRegistration} onChange={(time) => {this.handleTimeChange("closeRegistration", time)}}/></td>
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
                        <AddonJoins dateGroup={this.props.id} addons={addons}/>
                        <AddonJoinForm dateGroup={this.props.id} addons={addonOptions}/></div>:""}

            </div>
            <div className='event-register-btn center-text margin-top-10' onClick={this.mutation.onSubmit}>{(this.props.id)?'Update':'Create'}</div>
        </div>
    }
}

class DateGroupForm extends Component {
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
                <ReactQuery query={GET_ADDRESSES}>
                    <DateGroupFormInner {...this.props} handleSubmit={this.clearPopupState} mutation={(
                            this.props.id)
                            ? UPDATE_DATE_GROUP
                            : CREATE_DATE_GROUP}/>
                </ReactQuery>
            </Popup>
            <div onClick={this.showPopup}>
                {this.props.children}
            </div>

        </div>
    }
}

export default DateGroupForm;

// delete from ftlc.date_group;
//
// delete from ftlc.events;
//
// delete from ftlc.activities;
