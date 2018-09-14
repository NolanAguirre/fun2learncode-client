import React, {
    Component
} from 'react';
import './ManageStudents.css';
import StudentSelect from '../studentSelect/StudentSelect';
import StudentClasses from '../studentClasses/StudentClasses';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
class ManageStudents extends Component {
    constructor(props){
        super(props)
        this.state = {currentStudent:null}
        this.handleStudentChange = this.handleStudentChange.bind(this);
    }
    handleStudentChange(studentId){
        this.setState({currentStudent:studentId});
    }
    render() {
        return (this.props.user && this.props.user.role === 'FTLC_USER') ?
        ( <div className="manage-students-container"> ManageStudents
            <StudentSelect click={this.handleStudentChange} user={this.props.user}></StudentSelect>
            {(this.state.currentStudent)?<StudentClasses id={this.state.currentStudent}></StudentClasses>:""}
        </div>):
        (<div>please login</div> )
    }
}

export default ManageStudents;
