import React, { Component } from 'react'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'
import MutationHandler from '../queryHandler/MutationHandler'
import {SecureRoute, Location, GridView} from '../common/Common'
import './ManageAddresses.css'

const GET_ADDRESSES = gql`query manageAddresses{allAddresses{
    nodes{
      id
      nodeId
      street
      city
      state
      alias
      country
      zipcode
      dateGroupsByAddress{
        totalCount
      }
    }
  }
}`

const CREATE_ADDRESS = gql`mutation($address:CreateAddressInput!){
  createAddress(input:$address){
    address{
      alias
      state
      street
      city
      county
      zipcode
    }
  }
}`

const UPDATE_ADDRESS = gql`mutation($id:UUID!, $address:AddressPatch!){
  updateAddressById(input:{addressPatch:$address, id:$id}){
    address{
      id
      nodeId
      street
      city
      state
      alias
      country
      zipcode
    }
  }
}`

class ManageAddressForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            edit:false,
            street: this.props.street || "",
            city: this.props.city || "",
            state: this.props.state || "",
            alias: this.props.alias || "",
            zipcode: this.props.zipcode || 78664
        }
    }

    toggleEdit = () => {
        this.setState({edit:!this.state.edit})
    }

    handleInputChange = (event) => {
      const target = event.target
      const value = target.type === 'checkbox'
        ? target.checked
        : target.value
      const name = target.name
      this.setState({ [name]: value })
    }

    hasRequiredValues = () =>{
        let haveValues =  this.state.street != "" &&
               this.state.city != "" &&
               this.state.state != "" &&
               this.state.alias != "" &&
               this.state.zipcode
        let changedValues = this.state.street != this.props.street ||
               this.state.city != this.props.city ||
               this.state.state != this.props.state ||
               this.state.alias != this.props.alias ||
               this.state.zipcode != this.props.zipcode
         return haveValues && changedValues
    }

    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let address = Object.assign({}, this.state)
            delete address.edit
            if (this.props.id) {
                mutation({
                    variables: {id:this.props.id, address}
                });
            }else{
                mutation({
                    variables: {address:{address}}
                });
            }
        }
        this.setState({edit:false})
    }

    render = () => {
        if(this.state.edit){
            return <div className="manage-address-form-container">
                <h2 className="manage-address-form-header">{this.props.alias}</h2>
                <MutationHandler refetchQueries={['manageAddresses', 'addressDropdown', 'adminEvents']} handleMutation={this.handleSubmit} mutation={this.props.mutation}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Street: </td>
                                <td><input name="street" value={this.state.street} onChange={this.handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>City: </td>
                                <td><input name="city" value={this.state.city} onChange={this.handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>State: </td>
                                <td><input name="state" value={this.state.state} onChange={this.handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>Alias: </td>
                                <td><input name="alias" value={this.state.alias} onChange={this.handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>Zipcode: </td>
                                <td><input name="zipcode" value={this.state.zipcode} onChange={this.handleInputChange} type="number"></input></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="submit">finish</button>
                </MutationHandler>
            </div>
        }
        return <div className="manage-address-form-container">
            <h2 className="manage-address-form-header">{this.props.alias}</h2>
            <table>
                <tbody>
                    <tr>
                        <td>Street: </td>
                        <td>{this.props.street}</td>
                    </tr>
                    <tr>
                        <td>City: </td>
                        <td>{this.props.city}</td>
                    </tr>
                    <tr>
                        <td>State: </td>
                        <td>{this.props.state}</td>
                    </tr>
                    <tr>
                        <td>Alias: </td>
                        <td>{this.props.alias}</td>
                    </tr>
                    <tr>
                        <td>Zipcode: </td>
                        <td>{this.props.zipcode}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={this.toggleEdit}>edit</button>
        </div>
    }
}

class ManageAddressesInner extends Component {
  constructor (props) {
    super(props)
  }
  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value
    const name = target.name
    this.setState({ [name]: value })
  }
  handleSubmit = (event) => {

  }
  render = () => {
    const addresses = this.props.queryResult.allAddresses.nodes.map((address)=><ManageAddressForm mutation={UPDATE_ADDRESS} key={address.id} id={address.id} zipcode={address.zipcode} city={address.city} street={address.street} state={address.state} alias={address.alias} />)
    return <div className="manage-addresses-container">
        <div className="manage-addresses-header">
            <ManageAddressForm mutation={CREATE_ADDRESS} alias={"New Address"} />
        </div>
        <GridView className="manage-addresses-body" itemsPerRow={3}> {addresses}</GridView>
    </div>
  }
}

function ManageAddresses(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <QueryHandler query={GET_ADDRESSES}>
            <ManageAddressesInner />
        </QueryHandler>
    </SecureRoute>
}

export default ManageAddresses
