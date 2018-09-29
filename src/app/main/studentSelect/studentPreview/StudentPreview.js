import React, {Component} from 'react';
import './StudentPreview.css';

function StudentPreview(props){
    return (
        <div onClick={()=>{if(props.click){props.click(props.student)}}} className="student-preview-container">
            <div className="student-preview-info">

                {props.student.firstName + " " +  props.student.lastName}
            </div>
        </div>);
}
export default StudentPreview;
