import React, {Component} from 'react'
import Popup from "reactjs-popup"
import {MultiSelect, Selectable} from '../common/Common'
import Card from './Card'

const newCard = {
    id:'newCard',
    last4: '0000',
    exp_month: 2,
    exp_year: 2020,
    brand:'Add credit or debit card'
}

class CardDropdown extends Component{ //this uses rest api logic, has to sync state with server manually
    constructor(props){
        super(props)
        this.state = {showPopup:false, selected:this.props.cards[0] || newCard}
    }
    
    componentDidMount = () => {
        if(this.props.cards[0]){
            this.setSelected(this.props.cards[0])
        }
    }

    showPopup = () => {
        this.setState({showPopup:true})
    }
    closePopup = () => {
        this.setState({showPopup:false})
    }

    setSelected = (selected) => {
        if(selected.id === 'newCard'){
            this.props.addCard()
        }else{
            this.setState({selected, showPopup:false})
            this.props.setActiveCard(selected)
        }
    }
    render = () => {
        const trigger = open => <Card className='dropdown-payment-card' item={this.state.selected}/>
        return <Popup
        onOpen={this.showPopup}
        onClose={this.closePopup}
        open={this.state.showPopup}
        trigger={trigger}
        arrow={false}
        contentStyle={{width:'350px', boxShadow:'0 4px 40px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', padding:'0px!important'}}
        position="bottom center"
        closeOnDocumentClick>
            <MultiSelect items={[...this.props.cards, newCard]} setSelected={this.setSelected} alwaysSelect default={this.props.selected}>
                <Selectable className={{selected:'selected-payment-card', base: 'dropdown-payment-card'}}>
                    <Card />
                </Selectable>
            </MultiSelect>
        </Popup>
    }
}

export default CardDropdown
