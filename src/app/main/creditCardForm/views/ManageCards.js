import React, {Component} from 'react'
import {MultiSelect, Selectable} from '../../common/Common'
import Card from '../Card'
import './views.css'
import loadingDots from '../../../logos/loading-dots.svg'

function ManageCardsButton(props){
    if(props.isDeleting){
        return <img src={loadingDots}/>
    } else if(props.selected) {
        return <div className="styled-button" onClick={props.deleteCard}>Delete card</div>
    } else {
        return <div className='styled-button' onClick={props.addCard}>Add card</div>
    }
}


class ManageCards extends Component{
    constructor(props){
        super(props)
        this.state = {showPopup:false, UI:'default'} //selected:true, isDeleting:true
    }

    setSelected = (selected) => this.setState({selected})

    deleteCard = () => {
        if(this.state.selected){
            this.setState({isDeleting:true})
            this.props.deleteCard(this.state.selected, () => {this.setState({isDeleting:false, selected:null})})
        }
    }
    render = () => {
        const cards = this.props.cards
        return <div className='payment-container'>
            <div className='card-container'>
                <MultiSelect items={cards} setSelected={this.setSelected}>
                    <Selectable className={{selected:'selected-payment-card', base: 'payment-card'}}>
                        <Card />
                    </Selectable>
                </MultiSelect>
            </div>
            <ManageCardsButton isDeleting={this.state.isDeleting} selected={this.state.selected} deleteCard={this.deleteCard} addCard={this.props.addCard}/>
        </div>
    }
}

export default ManageCards
