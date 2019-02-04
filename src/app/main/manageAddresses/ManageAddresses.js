import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute, Location, GridView, ArchiveOptions} from '../common/Common'
import './ManageAddresses.css'

const GET_ADDRESSES = (archive) => `{
    allAddresses(condition:{${archive}}){
        nodes{
      id
      nodeId
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
      nodeId
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

function CreateAddressFrom(props){
    if(props.edit){
        return <form className='create-address-form' onSubmit={props.onSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>Street: </td>
                            <td><input name="street" value={props.street} onChange={props.handleChange}></input></td>
                            <td>Alias: </td>
                            <td><input name="alias" value={props.alias} onChange={props.handleChange}></input></td>
                        </tr>
                        <tr>
                            <td>City: </td>
                            <td><input name="city" value={props.city} onChange={props.handleChange}></input></td>
                            <td>Zipcode: </td>
                            <td><input name="zipcode" value={props.zipcode} onChange={props.handleChange} type="number"></input></td>
                        </tr>
                        <tr>
                            <td>State: </td>
                            <td><input name="state" value={props.state} onChange={props.handleChange}></input></td>
                            <td>Archive: </td>
                            <td><input name="archive" checked={props.archive} onChange={props.handleChange} type="checkbox"></input></td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit">finish</button>
            </form>
        }
        return <React.Fragment>
            <table className='create-address-form'>
                <tbody>
                    <tr>
                        <td>Street: </td>
                        <td>{props.street}</td>
                        <td>Alias: </td>
                        <td>{props.alias}</td>
                    </tr>
                    <tr>
                        <td>City: </td>
                        <td>{props.city}</td>
                        <td>Zipcode: </td>
                        <td>{props.zipcode}</td>
                    </tr>
                    <tr>
                        <td>State: </td>
                        <td>{props.state}</td>
                        <td>Archive: </td>
                        <td>{props.archive?'True':'False'}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={props.toggleEdit}>edit</button>
        </React.Fragment>

}

function UpdateAddressForm(props){
    if(props.edit){
        return <form onSubmit={props.onSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>Street: </td>
                            <td><input name="street" value={props.street} onChange={props.handleChange}></input></td>
                        </tr>
                        <tr>
                            <td>City: </td>
                            <td><input name="city" value={props.city} onChange={props.handleChange}></input></td>
                        </tr>
                        <tr>
                            <td>State: </td>
                            <td><input name="state" value={props.state} onChange={props.handleChange}></input></td>
                        </tr>
                        <tr>
                            <td>Alias: </td>
                            <td><input name="alias" value={props.alias} onChange={props.handleChange}></input></td>
                        </tr>
                        <tr>
                            <td>Zipcode: </td>
                            <td><input name="zipcode" value={props.zipcode} onChange={props.handleChange} type="number"></input></td>
                        </tr>
                        <tr>
                            <td>Archive: </td>
                            <td><input name="archive" checked={props.archive} onChange={props.handleChange} type="checkbox"></input></td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit">finish</button>
            </form>
    }
    return <React.Fragment>
        <table>
            <tbody>
                <tr>
                    <td>Street: </td>
                    <td>{props.street}</td>
                </tr>
                <tr>
                    <td>City: </td>
                    <td>{props.city}</td>
                </tr>
                <tr>
                    <td>State: </td>
                    <td>{props.state}</td>
                </tr>
                <tr>
                    <td>Alias: </td>
                    <td>{props.alias}</td>
                </tr>
                <tr>
                    <td>Zipcode: </td>
                    <td>{props.zipcode}</td>
                </tr>
                <tr>
                    <td>Archive: </td>
                    <td>{props.archive?'True':'False'}</td>
                </tr>
            </tbody>
        </table>
        <button onClick={props.toggleEdit}>edit</button>
    </React.Fragment>
}

class ManageAddressForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            edit:false,
            street: props.street || "",
            city: props.city || "",
            state: props.state || "",
            alias: props.alias || "",
            zipcode: props.zipcode || 78664,
            archive: props.archive || false
        }
        this.mutation = new Mutation({
            mutation:props.mutation,
            onSubmit:this.handleSubmit
        })
    }

    toggleEdit = () => {
        this.setState({edit:!this.state.edit})
    }

    handleChange = (event) => {
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
               this.state.zipcode != this.props.zipcode ||
               this.state.archive != this.props.archive
         return haveValues && changedValues
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasRequiredValues()){
            let address = Object.assign({}, this.state)
            delete address.edit
            this.setState({edit:false})
            if (this.props.id) {
                return {id:this.props.id, address}
            }else{
                return {address:{address}}
            }
        }
        this.setState({edit:false})
        return false
    }

    render = () => {
        return <div className="manage-address-form-container">
            <h2 className="manage-address-form-header">{this.props.alias}</h2>
            {this.props.id?<UpdateAddressForm {...this.state} handleChange={this.handleChange} onSubmit={this.mutation.onSubmit} toggleEdit={this.toggleEdit}/>:
            <CreateAddressFrom {...this.state} handleChange={this.handleChange} onSubmit={this.mutation.onSubmit} toggleEdit={this.toggleEdit}/>}
            </div>
    }
}

function ManageAddressesInner(props){
    const addresses = props.allAddresses.nodes.map((address) => <ManageAddressForm mutation={UPDATE_ADDRESS} key={address.id} {...address} />)
    return <GridView className="manage-addresses-body" fillerStyle={'manage-address-form-container'} itemsPerRow={3}>{addresses}</GridView>
}


function ManageAddresses(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
        <div className="manage-addresses-container">
            <div className="manage-addresses-header">
                <ManageAddressForm mutation={CREATE_ADDRESS} alias={"New Address"} />
            </div>
            <ArchiveOptions query={GET_ADDRESSES}>
                <ReactQuery>
                    <ManageAddressesInner />
                </ReactQuery>
            </ArchiveOptions>
        </div>
    </SecureRoute>
}

export default ManageAddresses
