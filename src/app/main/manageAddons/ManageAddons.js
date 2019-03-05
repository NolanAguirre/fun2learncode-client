import React, {Component} from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView} from '../common/Common'
import './ManageAddons.css'

const GET_ADDONS = `{
  allAddOns{
    nodes{
      id
      name
      description
      price
    }
  }
}`

const CREATE_ADDON = `mutation($addon:CreateAddOnInput!){
  createAddOn(input:$addon){
    addOn{
      description
      id
      name
      price
      addOnJoinsByAddOn{
        nodes{
          id
        }
      }
    }
  }
}`

const UPDATE_ADDON = `mutation($id:UUID!, $addon:AddOnPatch!){
  updateAddOnById(input:{id:$id, addOnPatch:$addon}){
    addOn{
      description
      id
      name
      price
      addOnJoinsByAddOn{
        nodes{
            id
        }
      }
    }
  }
}`

class ManageAddonForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            description: props.description || '',
            name: props.name || 'new Add-on',
            price: props.price || 10
        }
        this.mutation = new Mutation({
            mutation: this.props.mutation,
            onSubmit: this.handleSubmit
        })
    }

    toggleEdit = () => {
        this.setState({edit: !this.state.edit})
    }

    handleInputChange = event => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({[name]: value})
    }

    hasRequiredValues = () => {
        let haveValues =
            this.state.name &&
            this.state.name !== 'new Add-on' &&
            this.state.description &&
            this.state.price >= 0
        let changedValues =
            this.state.name !== this.props.name ||
            this.state.description !== this.props.description ||
            this.state.price !== this.props.price
        return haveValues && changedValues
    }

    handleSubmit = (event, mutation) => {
        event.preventDefault()
        if (this.hasRequiredValues()) {
            console.log('submitting')
            let addOn = Object.assign({}, this.state)
            delete addOn.edit
            this.setState({edit: false})
            if (this.props.id) {
                return {id: this.props.id, addon: addOn}
            } else {
                return {addon: {addOn}}
            }
        }
        this.setState({edit: false})
        return false
    }
    render = () => {
        if (this.state.edit) {
            return (
                <div className='manage-addon-container'>
                    <h2 className='manage-address-form-header'>{this.props.name}</h2>
                    <form onSubmit={this.mutation.onSubmit}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Name: </td>
                                    <td>
                                        <input
                                            name='name'
                                            value={this.state.name}
                                            onChange={this.handleInputChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Price: </td>
                                    <td>
                                        <input
                                            name='price'
                                            type='number'
                                            value={this.state.price}
                                            onChange={this.handleInputChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <textarea
                            name='description'
                            placeholder='Brief Description'
                            value={this.state.description}
                            onChange={this.handleInputChange}
                            className='manage-addons-textarea'
                        />
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
            <div className='manage-addon-container'>
                <h2 className='manage-address-form-header'>{this.props.name}</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Name: </td>
                            <td>{this.props.name}</td>
                        </tr>
                        <tr>
                            <td>Price: </td>
                            <td>{this.props.price}</td>
                        </tr>
                    </tbody>
                </table>
                <div>{this.props.description}</div>
                <div className='styled-button margin-top-10' onClick={this.toggleEdit}>
                    Edit
                </div>
            </div>
        )
    }
}

function ManageAddonsInner(props) {
    const addons = props.allAddOns.nodes.map(addon => (
        <ManageAddonForm
            mutation={UPDATE_ADDON}
            key={addon.id}
            price={addon.price}
            id={addon.id}
            name={addon.name}
            description={addon.description}
        />
    ))
    return (
        <div className='main-contents container column'>
            <GridView
                className='manage-addresses-body'
                fillerStyle='manage-addon-container'
                itemsPerRow={3}>
                {[
                    <ManageAddonForm key='new' name='new Add-on' mutation={CREATE_ADDON} />,
                    ...addons
                ]}
            </GridView>
        </div>
    )
}

function ManageAddons(props) {
    return (
        <SecureRoute ignoreResult roles={['FTLC_OWNER', 'FTLC_ADMIN']}>
            <ReactQuery query={GET_ADDONS}>
                <ManageAddonsInner />
            </ReactQuery>
        </SecureRoute>
    )
}

export default ManageAddons
