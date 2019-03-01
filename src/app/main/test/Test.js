import React, { Component } from 'react'
import StudentSelect from '../studentSelect/StudentSelect'
import { ReactQuery } from '../../../delv/delv-react'
import {SecureRoute, Location, GridView, DatesTable} from '../common/Common'
import moment from 'moment';
import Popup from "reactjs-popup"
import axios from 'axios'

class Test extends Component{
    constructor(props){
        super(props);
        this.state = {query:""}
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }
    submit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3005/graphql', {query:this.state.query}).then((res)=>{
            console.log(res)
        }).catch((error)=>{
            console.log(error)
        })
    }

    render = () => {
        return <div>
            <textarea className='test-input' value={this.state.query} name='query' onChange={this.handleInputChange}></textarea>
            <button onClick={this.submit}>
                submit
            </button>
        </div>
    }
}

export default Test
