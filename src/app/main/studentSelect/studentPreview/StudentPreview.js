import React, {Component} from 'react';
import './StudentPreview.css';
class StudentPreview extends Component{
    render(){
        return (
            <div onClick={()=>{this.props.click(this.props.id)}}className="student-preview-container">
                <div className="student-preview-info">
                    {this.props.student.firstName} {this.props.student.lastName}
                </div>
            </div>);
    }
}
export default StudentPreview;