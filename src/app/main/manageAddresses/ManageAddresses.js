import React, {Component} from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView, ArchiveOptions} from '../common/Common'
import './ManageAddresses.css'

const GET_ADDRESSES = archive => `{
    allAddresses(condition:{${archive}}){
        nodes{
      id
      street
      city
      state
      alias
      country
      zipcode
      archive
    }
  }
}`

const CREATE_ADDRESS = `mutation($address:CreateAddressInput!){
  createAddress(input:$address){
    address{
      alias
      state
      street
      city
      county
      zipcode
      archive
    }
  }
}`

const UPDATE_ADDRESS = `mutation($id:UUID!, $address:AddressPatch!){
  updateAddressById(input:{addressPatch:$address, id:$id}){
    address{
      id
      street
      city
      state
      alias
      country
      zipcode
      archive
    }
  }
}`

class ManageAddressForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            street: props.street || '',
            city: props.city || '',
            state: props.state || '',
            alias: props.alias || '',
            zipcode: props.zipcode || 78664,
            archive: props.archive || false
        }
        this.mutation = new Mutation({
            mutation: props.mutation,
            onSubmit: this.handleSubmit
        })
    }

    toggleEdit = () => {
        this.setState({edit: !this.state.edit})
    }

    handleChange = event => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({[name]: value})
    }

    hasRequiredValues = () => {
        let haveValues =
            this.state.street &&
            this.state.city &&
            this.state.state &&
            this.state.alias &&
            this.state.zipcode
        let changedValues =
            this.state.street !== this.props.street ||
            this.state.city !== this.props.city ||
            this.state.state !== this.props.state ||
            this.state.alias !== this.props.alias ||
            this.state.zipcode !== this.props.zipcode ||
            this.state.archive !== this.props.archive
        return haveValues && changedValues
    }

    handleSubmit = event => {
        event.preventDefault()
        if (this.hasRequiredValues()) {
            let address = Object.assign({}, this.state)
            delete address.edit
            this.setState({edit: false})
            if (this.props.id) {
                return {id: this.props.id, address}
            } else {
                return {address: {address}}
            }
        }
        this.setState({edit: false})
        return false
    }

    render = () => {
        if (this.state.edit) {
            return (
                <div className='manage-address-card'>
                    <h2 className='manage-address-form-header'>{this.props.alias}</h2>
                    <form onSubmit={this.mutation.onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Street: </td>
                                    <td>
                                        <input
                                            name='street'
                                            value={this.state.street}
                                            onChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>City: </td>
                                    <td>
                                        <input
                                            name='city'
                                            value={this.state.city}
                                            onChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>State: </td>
                                    <td>
                                        <input
                                            name='state'
                                            value={this.state.state}
                                            onChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alias: </td>
                                    <td>
                                        <input
                                            name='alias'
                                            value={this.state.alias}
                                            onChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Zipcode: </td>
                                    <td>
                                        <input
                                            name='zipcode'
                                            value={this.state.zipcode}
                                            onChange={this.handleChange}
                                            type='number'
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Archive: </td>
                                    <td>
                                        <input
                                            name='archive'
                                            checked={this.state.archive}
                                            onChange={this.handleChange}
                                            type='checkbox'
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div
                            className='styled-button margin-top-10'
                            onClick={this.mutation.onSubmit}>
                            Finish
                        </div>
                        <button className='hacky-submit-button' type='submit' />
                    </form>
                </div>
            )
        }
        return (
            <div className='manage-address-card'>
                <h2 className='manage-address-form-header'>{this.props.alias}</h2>
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
                        <tr>
                            <td>Archive: </td>
                            <td>{this.props.archive ? 'True' : 'False'}</td>
                        </tr>
                    </tbody>
                </table>
                <div className='styled-button margin-top-10' onClick={this.toggleEdit}>
                    Edit
                </div>
            </div>
        )
    }
}

function ManageAddressesInner(props) {
    const addresses = props.allAddresses.nodes.map(address => (
        <ManageAddressForm mutation={UPDATE_ADDRESS} key={address.id} {...address} />
    ))
    return (
        <GridView className='container column' fillerStyle={'manage-address-card'} itemsPerRow={3}>
            {[<ManageAddressForm mutation={CREATE_ADDRESS} alias={'New Address'} />, ...addresses]}
        </GridView>
    )
}

function ManageAddresses(props) {
    return (
        <SecureRoute ignoreResult roles={['FTLC_OWNER', 'FTLC_ADMIN']}>
            <div className='main-contents column container'>
                <ArchiveOptions query={GET_ADDRESSES}>
                    <ReactQuery>
                        <ManageAddressesInner />
                    </ReactQuery>
                </ArchiveOptions>
            </div>
        </SecureRoute>
    )
}

export default ManageAddresses
