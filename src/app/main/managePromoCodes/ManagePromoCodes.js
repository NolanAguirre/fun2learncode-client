import React, {Component} from 'react';
import {SecureRoute, DropDown} from '../common/Common'

class CreatePromoCode extends Component{
    constructor(props){
        super(props)
        this.state={
            forCatagory:false,
            forEvent:false,
            forUser:false,
            isPercent:false,
            uses:1,
            effect:10,
            isRandom: false,
            code:"NOCODE"
        }
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        if(name === 'isRandom' && value === true){
            this.setState({code: Math.random().toString(36).substr(2, 9)})
        }else{
            this.setState({[name]: value});
        }
    }
    render = () => {
        return <table>
            <tbody>
                <tr>
                    <td>For specific catagory</td>
                    <td><input value={this.state.forCatagory} name='forCatagory' onChange={this.handleChange} type='checkbox'></input></td>
                    {this.state.forCatagory?<td>Catagory: <input></input></td>:<td></td>}
                </tr>
                <tr>
                    <td>For specific event</td>
                    <td><input value={this.state.forEvent} name='forEvent' onChange={this.handleChange} type='checkbox'></input></td>
                    {this.state.forEvent?<td>Event: <input></input></td>:<td></td>}
                </tr>
                <tr>
                    <td>For speccific user</td>
                    <td><input value={this.state.forUser} name='forUser' onChange={this.handleChange} type='checkbox'></input></td>
                    {this.state.forUser?<td>User: <input></input></td>:<td></td>}
                </tr>
                <tr>
                    <td>Percent Reduction</td>
                    <td><input value={this.state.isPercent} name='isPercent' onChange={this.handleChange} type='checkbox'></input></td>
                    <td>Amount: <input type='number'></input> {this.state.isPercent?"% off":"$ off"}</td>
                </tr>
                <tr>
                    <td>Uses</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Start Date:</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>End Date:</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Code random</td>
                    <td><input value={this.state.isRandom} name='isRandom' onChange={this.handleChange} type='checkbox'></input></td>
                </tr>
                <tr>
                    <td>Code</td>
                    <td></td>
                    <td><input value={this.state.code} name='code' onChange={this.handleChange}></input></td>
                </tr>
            </tbody>
        </table>
    }
}


class ManagePromoCodesInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeEvent: null,
            activeDateGroup: {id:null}
        }
    }

    render() {
        return <CreatePromoCode />
    }
}

function ManagePromoCodes(props){
    return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_OWNER", "FTLC_ADMIN"]}>
            <ManagePromoCodesInner />
        </SecureRoute>
}
export default ManagePromoCodes;
