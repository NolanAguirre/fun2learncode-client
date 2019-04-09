import React, {Component} from 'react'
import Popup from "reactjs-popup"
import {MultiSelect, Selectable} from '../common/Common'
import Card from './Card'
import axios from 'axios'
import AddCard from './views/AddCard'

class CardDropdown extends Component{ //this uses rest api logic, has to sync state with server manually
    constructor(props){
        super(props)
        this.state = {UI:'cards', showPopup:false}
    }

    showPopup = () => {
        this.setState({showPopup:true})
    }
    closePopup = () => {
        this.setState({showPopup:false})
    }

    setSelected = (selected) => {
        if(selected.id === 'newCard'){
            this.setState({selected, popup:true, UI:'transition'})
            setTimeout(()=>{this.setState({UI:'addCard'})}, 200)
            //render new card form
        }else{
            const {id,...card} = selected
            this.props.setActiveCard(card)
            this.setState({selected, showPopup:false})
        }
    }

    componentDidMount = () => {
        axios.post('http://localhost:3005/stripe/user-info', {user:this.props.user}).then((res)=>{
            if(res.data.error){
                if(res.data.error === 'No stripe customer account on record.'){
                    this.setState({UI:'createAccount'})
                }
            } else {

                this.setState({UI:'manageCards', cards:res.data, selected:res.data[0]})
            }
        })
    }

    addCard = (cardInfo) => {
        return axios.post('http://localhost:3005/stripe/add-card', {user:this.props.user, token:cardInfo}).then((res)=>{
            console.log(res.data)
            if(res.data.message){
                if(res.data.message === 'Card successfully added.'){
                    this.setState({cards:[ res.data.newCard, ...this.state.cards], UI:'transition', showPopup:false, selected: res.data.newCard})
                    setTimeout(()=>{this.setState({UI:'cards'})}, 200)
                }
            } else {

            }
            return res
        })
    }

    back = () => {
        this.setState({UI:'transition', showPopup:false, selected:this.state.cards[0]})
        setTimeout(()=>{this.setState({UI:'cards'})}, 200)
    }

    render = () => {
        if(this.state.UI === 'addCard'){
            return <Popup className='popup' onClose={this.closePopup} open={this.state.showPopup} modal closeOnDocumentClick={false} closeOnEscape={false}>
                <div className='popup-inner'>
                    <div className='payment-container'>
                        <h2 className='center-text'>Add a card</h2>
                        <AddCard callback={this.addCard} back={this.back}/>
                    </div>
                </div>
            </Popup>
        }else if(this.state.UI === 'transition'){
            return <Card className='dropdown-payment-card' item={this.state.selected}/>
        }else if(this.state.cards){
            const trigger = open => <Card className='dropdown-payment-card' item={this.state.selected}/>
            const newCard = {
                id:'newCard',
                last4: '0000',
                exp_month: 2,
                exp_year: 2020,
                brand:'Add credit or debit card'
            }
            return <Popup
            onOpen={this.showPopup}
            onClose={this.closePopup}
            open={this.state.showPopup}
            trigger={trigger}
            arrow={false}
            contentStyle={{width:'350px', boxShadow:'0 4px 40px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', padding:'0px!important'}}
            position="bottom center"
            closeOnDocumentClick>
                <MultiSelect items={[...this.state.cards, newCard]} setSelected={this.setSelected} alwaysSelect default={this.props.selected}>
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
