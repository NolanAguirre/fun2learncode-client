import React, {Component} from 'react'
import ManageCards from './views/ManageCards'
import CardDropdown from './CardDropdown'
import AddCard from './views/AddCard'
import { ReactQuery } from '../../../delv/delv-react'
import Mutation from '../../../delv/Mutation'

const GET_CARDS = `
{
    allCreditCards{
        last4,
        exp_month,
        exp_year,
        brand,
        id
    }
}`

const CREATE_CARD = `mutation($card:CreditCardInput!, $token:String!){
  addCreditCard(input:$card, token:$token){
    last4
    brand
    exp_year
    exp_month
    id
  }
}`

const DELETE_CARD = `mutation($card:CreditCardInput!){
  deleteCreditCard(input:$card){
    last4
    brand
    exp_year
    exp_month
    id
  }
}`

class CreditCardFormInner extends Component{ //this uses rest api logic, has to sync state with server manually
    constructor(props){
        super(props)
        this.state = {UI:'manageCards'}
    }

    addCard = (info) => {
        this.mutation = new Mutation({
            mutation:CREATE_CARD,
            onSubmit:()=> info,
            onResolve: (data, error) => {
                if(data){
                    this.setState({UI:'manageCards'})
                }
            }
        }).onSubmit()
    }
    deleteCard = (info, cb) => {
        const {
            id,
            ...card
        } = info
        this.mutation = new Mutation({
            mutation:DELETE_CARD,
            onSubmit:()=> {return {card:card}},
            customCache: (cache, data) => {cache.remove(data)},
            onResolve: ()=>{
                cb()
            }
        }).onSubmit()
    }

    showAddCard = () => {
        if(this.props.showAddCard){
            this.props.showAddCard()
        }
        this.setState({UI:'addCard'})
    }

    render = () => {
        let back = ()=>{this.setState({UI:'manageCards'})}
        if(this.props.back){
            back = () => {this.props.back(); this.setState({UI:'manageCards'})}
        }
        if(this.props.dropdown){
            if(this.state.UI === 'addCard'){
                return <AddCard resolve={this.addCard} back={back} />
            }else if(this.state.UI === 'manageCards'){
                return <CardDropdown cards={this.props.allCreditCards} addCard={this.showAddCard} setActiveCard={this.props.setActiveCard}/>
            }
        }else{
            if(this.state.UI === 'addCard'){
                return <AddCard resolve={this.addCard} back={back} />
            }else if(this.state.UI === 'manageCards'){
                return <ManageCards cards={this.props.allCreditCards} addCard={this.showAddCard} deleteCard={this.deleteCard}/>
            }
        }
    }
}

function CreditCardForm(props){
    return <ReactQuery query={GET_CARDS}>
        <CreditCardFormInner {...props}/>
    </ReactQuery>
}
export default CreditCardForm
