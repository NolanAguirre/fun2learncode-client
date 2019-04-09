import React, {Component} from 'react'
import ManageCards from './views/ManageCards'
import CardDropdown from './CardDropdown'
import axios from 'axios'
import Popup from "reactjs-popup"
import AddCard from './views/AddCard'
import xicon from '../../logos/x-icon.svg'

class CreditCardForm extends Component{ //this uses rest api logic, has to sync state with server manually
    constructor(props){
        super(props)
        this.state = {UI:'loading'}
    }

    componentDidMount = () => {
        axios.post('http://localhost:3005/stripe/user-info', {user:this.props.user}).then((res)=>{
            if(res.data.error){
                if(res.data.error === 'No stripe customer account on record.'){
                    this.setState({UI:'createAccount'})
                }
            } else {
                console.log(res)
                this.setState({UI:'manageCards', cards:res.data})
            }
        })
    }

    createStripeAccount = () => {
        axios.post('http://localhost:3005/stripe/create-customer', {user:this.props.user}).then((res)=>{
            console.log(res)
            if(res.data.message){
                if(res.data.message === 'Stripe customer account created and stored.'){
                    this.setState({UI:'manageCards'})
                }
            } else {

            }
        })
    }

    addCard = (cardInfo) => {
        return axios.post('http://localhost:3005/stripe/add-card', {user:this.props.user, token:cardInfo}).then((res)=>{
            console.log('adding card')
            console.log(res.data)
            if(res.data.message){
                if(res.data.message === 'Card successfully added.'){
                    this.setState({UI:'manageCards', cards:[...this.state.cards, res.data.newCard]})
                }
            } else {

            }
            return res
        })
    }

    deleteCard = (cardInfo) => {
        return axios.post('http://localhost:3005/stripe/delete-card', {user:this.props.user, cardInfo}).then((res)=>{
            console.log(res.data)
            if(res.data.message){
                if(res.data.message === 'Card successfully deleted.'){
                    this.setState({UI:'manageCards', cards:this.state.cards.filter(card=>card.id!==res.data.oldCard)})
                }
            } else {

            }
            return res
        })
    }

    showAddCard = () => {this.setState({UI:'addCard'})}

    render = () => {
        if(this.props.dropdown){

        }else{
            if(this.state.UI === 'loading'){
                return <div>Getting payment info</div>
            }else if(this.state.UI === 'addCard'){
                return <AddCard callback={this.addCard} back={()=>{this.setState({UI:'manageCards'})}} />
            }else if(this.state.UI === 'manageCards'){
                return <ManageCards cards={this.state.cards} addCard={this.showAddCard} deleteCard={this.deleteCard}/>
            }
        }
    }
}

export default CreditCardForm
