import React, {Component} from 'react'
import './card.css'
import visa from '../../logos/visa.svg'
import mastercard from '../../logos/mastercard.svg'
import amex from '../../logos/amex.svg'
import discover from '../../logos/discover.svg'
import jcb from '../../logos/JCB.svg'
import creditCard from '../../logos/credit-card.svg'
function Card(props){
    const {brand, last4, exp_month, exp_year} = props.item
    let brandIcon
    let cardNumber = `${brand} ending in ${last4}`
    let cardExpiry = `Expires ${('0'+exp_month).slice(-2)}/${exp_year.toString().substring(2,4)}`
    if(brand.includes('Visa')){
        brandIcon = visa
    }else if(brand.includes('MasterCard')){
        brandIcon = mastercard
    }else if(brand.includes('American Express')){
        brandIcon = amex
    }else if(brand.includes('Discover')){
        brandIcon = discover
    }else if(brand.includes('JCB')){
        brandIcon = jcb
    }else{
        brandIcon = creditCard
        if(brand === 'Add credit or debit card'){
            cardNumber = brand
            cardExpiry = ''
        }
    }
    return <div onClick={props.onClick} className={props.className}>
        <img className='card-brand' src={brandIcon} />
        <div className='card-info'>
            <div className='card-number'>{cardNumber}</div>
            <div className='card-expiry'>{cardExpiry}</div>
        </div>
    </div>
}

export default Card
