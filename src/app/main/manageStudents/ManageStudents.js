import React, {
    Component
} from 'react';
import './ManageStudents.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
const GET_STUDENTS = gql`

`
class ManageStudents extends Component {
    render() {
        return (this.props.user && this.props.user.role === 'FTLC_USER') ?
        ( < div > ManageStudents < /div>):
        (<div>please login</div > )
    }
}

export default ManageStudents;
