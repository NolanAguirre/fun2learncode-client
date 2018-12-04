import React, { Component } from 'react'
import gql from 'graphql-tag'
import QueryHandler from '../queryHandler/QueryHandler'
import {SecureRoute, Location} from '../common/Common'
import './ManageAddresses.css'

const GET_ADDRESSES = gql`{allAddresses{
    nodes{
      id
      street
      city
      state
      alias
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

class ManageAddressForm extends Component{
    constructor(props){
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

    render = () => {
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
                </tbody>
            </table>
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
    let addresses = this.props.queryResult.allAddresses.nodes.map((address)=><ManageAddressForm key={address.id} city={address.city} street={address.street} state={address.state} alias={address.alias} />)
    let formatted = [];
    while(addresses.length){
        formatted.push(<div className="manage-address-forms-container" key={addresses.length}>{addresses.splice(0,3)}</div>)
    }
    return <div className="manage-addresses-container">
        <div className="manage-addresses-header">
            <ManageAddressForm />
        </div>
        <div className="manage-addresses-body">
            {formatted}
        </div>
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
