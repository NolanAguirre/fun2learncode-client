import React, {Component} from 'react';
import {DropDown} from '../common/Common';
import './DateGroupForm.css';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import DateTime from 'react-datetime';
import '../../../react-datetime.css'
import Colors from '../calendar/Colors'
import EventsPreview from './EventsPreview';
import moment from 'moment';
import Popup from "reactjs-popup"
import QueryHandler from '../queryHandler/QueryHandler';
import memoize from "memoize-one";
import MutationHandler from '../queryHandler/MutationHandler';
//TODO move mutation into mutations, make update feature, update cache

const GET_ADDRESSES = gql`query addressDropdown{
    allAddresses {
        nodes {
            nodeId
            id
            alias
        }
    }
}`

const CREATE_DATE_GROUP = gql`mutation($dateGroup:DateGroupInput!){
  createDateGroup(input:{dateGroup:$dateGroup}){
    dateGroup{
		nodeId
        id
        name
    }
  }
}`

const UPDATE_DATE_GROUP = gql`mutation ($id: UUID!, $dateGroup: DateGroupPatch!) {
  updateDateGroupById(input: {id: $id, dateGroupPatch: $dateGroup}) {
    dateGroup {
      nodeId
      id
      name
    }
  }
}`

class DateGroupFormInner extends Component{
    constructor(props) {
        super(props);
        this.state = {
			name: props.name || "",
            price: props.price || 100,
            capacity: props.capacity || 8,
            address:props.address,
            openRegistration: this.localizeUTCTimestamp(props.openRegistration) || new Date(moment().hour(23).minute(59).toString()),
            closeRegistration: this.localizeUTCTimestamp(props.closeRegistration) || new Date(moment().add(1, "days").hour(23).minute(59).toString()),
        }
    }
    localizeUTCTimestamp = (timestamp) => {
        if(!timestamp){return null}
        return new Date(moment(moment.utc(timestamp)).local().toString())
    }
    normalizeDate = (date) =>{
        return new Date(this.localizeUTCTimestamp(date)).toISOString()
    }
	handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }

    hasRequiredValues = () =>{
        let haveValues =  this.state.name != "" &&
               this.state.address
        let changedValues = this.state.name != this.props.name ||
               this.normalizeDate(this.state.openRegistration) != this.normalizeDate(this.props.openRegistration) ||
               this.normalizeDate(this.state.closeRegistration) != this.normalizeDate(this.props.closeRegistration) ||
               this.state.address != this.props.address ||
               this.state.capacity != this.props.capacity

         return haveValues && changedValues
    }

	handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let dateGroup={
                event: this.props.event,
                openRegistration: this.state.openRegistration.toISOString(),
                closeRegistration: this.state.closeRegistration.toISOString(),
                price:this.state.price,
                capacity:this.state.capacity,
                address:this.state.address,
    			name: this.state.name
            }
            mutation({
                variables: {"id":this.props.id, "dateGroup":dateGroup}
            });
        }
        this.props.handleSubmit()
    }

    mapAddresses = memoize(
        (data) => {
            let mapped = data.nodes.map((element) => {return {name: element.alias, value: element.id}})
            return mapped;
        }
    )

    render() {
        const addresses = this.mapAddresses(this.props.queryResult.allAddresses);
        return <div className="date-form">
                <h4>Create/Edit Date Group</h4>
        			<MutationHandler refetchQueries={["adminEvents"]} handleMutation={this.handleSubmit} mutation={this.props.mutation}>
        				<table>
        					<tbody>
        						<tr>
        							<td>Set Name:</td>
        							<td><input className="full-date-input" name={"name"} value={this.state.name} onChange={this.handleChange}/></td>
        						</tr>
        						<tr>
        							<td>Set Start:</td>
        							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={this.state.openRegistration} onChange={(time) => {this.handleTimeChange("openRegistration", time)}}/></td>
        						</tr>
        						<tr>
        							<td>Set End:</td>
        							<td><DateTime className="full-date-input" dateFormat="MMMM Do YYYY" timeFormat={false} value={this.state.closeRegistration}  onChange={(time) => {this.handleTimeChange("closeRegistration", time)}}/></td>
        						</tr>
                                <tr>
                                    <td>Location:</td>
                                    <td>
                                        <DropDown name="address" options={addresses} value={this.state.address} onChange={this.handleChange}></DropDown>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Price:</td>
                                    <td>
                                        <input name="price" value={this.state.price} onChange={this.handleChange} type="number"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Capacity:</td>
                                    <td>
                                        <input name="capacity" value={this.state.capacity} onChange={this.handleChange} type="number"></input>
                                    </td>
                                </tr>
        					</tbody>
        				</table>
                        <button className='date-form-btn' type="submit">Set</button>
        			</MutationHandler>
        		</div>
    }
}

class DateGroupForm extends Component{
    constructor(props){
        super(props);
        this.state = {showPopup:false}
    }
    showPopup = () =>{
        this.setState({showPopup:true});
    }
    clearPopupState = () =>{
        this.setState({showPopup:false});
    }
    render = () =>{
        return <div>
            <Popup
            open={this.state.showPopup}
            closeOnDocumentClick
            onClose={this.clearPopupState}>
                <QueryHandler query={GET_ADDRESSES}>
                    <DateGroupFormInner {...this.props} handleSubmit={this.clearPopupState}  mutation={(this.props.id)?UPDATE_DATE_GROUP:CREATE_DATE_GROUP}/>
                </QueryHandler>
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
