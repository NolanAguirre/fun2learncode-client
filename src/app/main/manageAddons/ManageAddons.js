import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, GridView} from '../common/Common'
import './ManageAddons.css'

const GET_ADDONS =`{
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

class ManageAddonForm  extends Component{
    constructor(props){
        super(props)
        this.state = {
            edit:false,
            description:props.description || '',
            name:props.name || '',
            price: props.price || ''
        }
        this.mutation = new Mutation({
            mutation:this.props.mutation,
            onSubmit:this.handleSubmit
        })
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
        let haveValues =  this.state.name !== "" &&
               this.state.description !== "" &&
               this.state.price !== ""
        let changedValues = this.state.name !== this.props.name ||
               this.state.description !== this.props.description ||
               this.state.price !== this.props.price
         return haveValues && changedValues
    }

    handleSubmit = (event, mutation) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            console.log('submitting')
            let addOn = Object.assign({}, this.state)
            delete addOn.edit
            this.setState({edit:false})
            if (this.props.id) {
                return {id:this.props.id, addon:addOn}
            }else{
                return {addon:{addOn}}
            }
        }
        this.setState({edit:false})
        return false
    }
    handleDescriptionChange = (event) => {
        event.persist();
        this.setState({description:event.target.textContent})
    }
    render = () => {
        if(this.state.edit){
            return <div className="grid-item-container" >
                <h2 className="manage-address-form-header">{this.props.name}</h2>
                <form onSubmit={this.mutation.onSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Name: </td>
                                <td><input name="name" value={this.state.name} onChange={this.handleInputChange}></input></td>
                            </tr>
                            <tr>
                                <td>Price: </td>
                                <td><input name="price" type='number'value={this.state.price} onChange={this.handleInputChange}></input></td>
                            </tr>
                        </tbody>
                    </table>
                    <div id={this.props.id} onInput={this.handleDescriptionChange} className="styled-textarea" suppressContentEditableWarning={true} contentEditable></div>
                    <button type="submit">finish</button>
                </form>
            </div>
        }
        return <div className="grid-item-container">
            <h2 className="manage-address-form-header">{this.props.name}</h2>
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
            <button onClick={this.toggleEdit}>edit</button>
        </div>
    }
}

function ManageAddonsInner(props) {
    const addons = props.allAddOns.nodes.map((addon) =><ManageAddonForm mutation={UPDATE_ADDON} key={addon.id} price={addon.price} id={addon.id} name={addon.name} description={addon.description} />)
    return <div className="main-contents container column">
        <div>
            <ManageAddonForm mutation={CREATE_ADDON} name={"New Addon"} />
        </div>
        <GridView className="manage-addresses-body" fillerStyle={'grid-item-container'} itemsPerRow={3}>{addons}</GridView>
    </div>
}

function ManageAddons(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <ReactQuery query={GET_ADDONS}>
                <ManageAddonsInner />
        </ReactQuery>
    </SecureRoute>
}

export default ManageAddons
