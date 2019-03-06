import React, { Component } from 'react'
import './StudentPreview.css'

function StudentPreview (props) {
  return  <div onClick={props.onClick} className={props.className}>
        {props.item.firstName + ' ' + props.item.lastName}
    </div>
}
export default StudentPreview
