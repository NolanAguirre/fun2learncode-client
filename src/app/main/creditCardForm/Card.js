import React, {Component} from 'react'
import './card.css'
import visa from '../../logos/visa.svg'
import mastercard from '../../logos/mastercard.svg'
import amex from '../../logos/amex.svg'
import discover from '../../logos/discover.svg'
import jcb from '../../logos/JCB.svg'

function Card(props){
    console.log(props)
    const {brand, last4, exp_month, exp_year} = props.item
    let brandIcon
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
    }
    return <div onClick={props.onClick} className={props.className}>
        <img className='card-brand' src={brandIcon} />
        <div className='card-info'>
            <div className='card-number'>{brand} ending in {last4}</div>
            <div className='card-expiry'>Expires { ('0'+exp_month).slice(-2)}/{exp_year.toString().substring(2,4)}</div>
        </div>
    </div>
}

export default Card
