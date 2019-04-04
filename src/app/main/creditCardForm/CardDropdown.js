import React, {Component} from 'react'
import Popup from "reactjs-popup"
import {MultiSelect, Selectable} from '../common/Common'
import Card from './Card'
import axios from 'axios'

function dropdownCard(props){
    return <div>
    </div>
}

class CardDropdown extends Component{ //this uses rest api logic, has to sync state with server manually
    constructor(props){
        super(props)
        this.state = {popup:false}
    }

    showPopup = () => {
        this.setState({popup:true})
    }
    closePopup = () => {
        this.setState({popup:false})
    }

    setSelected = (selected) => {
        this.setState({selected, popup:false})
    }

    componentWillMount = () => {
        axios.post('http://localhost:3005/stripe/user-info', {user:this.props.user}).then((res)=>{
            if(res.data.error){
                if(res.data.error === 'No stripe customer account on record.'){
                    this.setState({UI:'createAccount'})
                }
            } else {
                console.log(res)
                this.setState({UI:'manageCards', cards:res.data, selected:res.data[0]})
            }
        })
    }

    render = () => {
        if(this.state.cards){
            const trigger = open => <Card className='dropdown-payment-card' item={this.state.selected}/>
            return <Popup
            onOpen={this.showPopup}
            onClose={this.closePopup}
            open={this.state.popup}
            trigger={trigger}
            arrow={false}
            contentStyle={{width:'350px', boxShadow:'0 4px 40px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', padding:'0px!important'}}
            position="bottom center"
            closeOnDocumentClick>
                <MultiSelect items={this.state.cards} setSelected={this.setSelected} alwaysSelect>
                    <Selectable className={{selected:'selected-payment-card', base: 'dropdown-payment-card'}}>
                        <Card />
                    </Selectable>
                </MultiSelect>
            </Popup>
        }else{
            return <div>Loading payment methods</div>
        }
    }
}

export default CardDropdown
