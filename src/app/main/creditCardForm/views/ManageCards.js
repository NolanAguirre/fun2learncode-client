import React, {Component} from 'react'
import {MultiSelect, Selectable} from '../../common/Common'
import AddCard from './AddCard'
import Card from '../Card'
import './views.css'


class ManageCards extends Component{
    constructor(props){
        super(props)
        this.state = {} //selected:true, isDeleting:true
    }
    setSelected = (selected) => {
        this.setState({selected})
    }
    deleteCard = () => {

        if(this.state.selected){
            this.setState({isDeleting:true})
            this.props.deleteCard(this.state.selected).then((res)=>{
                this.setState({isDeleting:false, selected:null})
            })
        }
    }
    render = () => {
        const cards = this.props.cards
        let button
        if(this.state.selected){
            if(this.state.isDeleting){
                //button = <div className='delete-card-loading'><img src={temp}/></div>
            }else{
                button = <div className="styled-button" onClick={this.deleteCard}>Delete card</div>
            }
        }else{
            button = <AddCard addCard={this.props.addCard} />
        }
        return <div>
            <div className='card-container'>
                <MultiSelect items={cards} setSelected={this.setSelected}>
                    <Selectable className={{selected:'selected-payment-card', base: 'payment-card'}}>
                        <Card />
                    </Selectable>
                </MultiSelect>
            </div>
            <div>
                {button}
            </div>
        </div>
    }
}

export default ManageCards
