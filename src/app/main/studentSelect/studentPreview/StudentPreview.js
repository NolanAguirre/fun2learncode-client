import React, { Component } from 'react'
import './StudentPreview.css'

function StudentPreview (props) {
    let className;
    if(props.selected){
        className = 'selected-student-preview-container'
    }else{
        className = 'student-preview-container'
    }
  return  <div onClick={() => props.onClick(props.student.id)} className={className}>
        {props.student.firstName + ' ' + props.student.lastName}
    </div>
}
export default StudentPreview
