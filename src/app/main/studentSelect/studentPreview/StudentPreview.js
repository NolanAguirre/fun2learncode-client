import React, { Component } from 'react'
import './StudentPreview.css'

function StudentPreview (props) {
  return (
    <div onClick={() => props.onClick(props.student.id)} className='student-preview-container'>
        {(props.selected)?<div>Selected</div>:""}
      <div className='student-preview-info'>
        {props.student.firstName + ' ' + props.student.lastName}
      </div>
    </div>)
}
export default StudentPreview
