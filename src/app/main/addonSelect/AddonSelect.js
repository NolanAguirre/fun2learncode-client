import React, { Component } from 'react'
import './AddonSelect.css'
import {MultiSelect, Selectable} from '../common/Common'

function Addon(props) {
  return  <div onClick={props.onClick} className={props.className || 'addon-container'}>
        <h3>{props.item.name}</h3>
        <div className='addon-container-description'>
            {props.item.description}
        </div>
        <div>
            {props.item.price}$
        </div>
      </div>
}

function AddonSelect (props) {
    return <div>
        <h3>Add-ons</h3>
        <div className='registration-addons-container'>
            <MultiSelect multiSelect setSelected={props.setSelected} items={props.addons}>
                <Selectable className={{selected:'addon-container-selected', base:'addon-container'}}>
                    <Addon />
                </Selectable>
            </MultiSelect>
        </div>
    </div>
}

export default AddonSelect
