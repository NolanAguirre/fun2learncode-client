import React, {Component} from 'react';
import './StudentSelect.css';
import StudentPreview from './studentPreview/StudentPreview';
import QueryHandler from '../queryHandler/QueryHandler';
import gql from 'graphql-tag';
const GET_STUDENTS = (parentId) =>{
    return gql`
    {
      allStudents(condition: {parent: "${parentId}"}) {
        edges {
          node {
            id
            userByStudent {
              id
              firstName
              lastName
            }
          }
        }
      }
    }
`}
class StudentSelect extends Component{
    render(){
        if(this.props.user){
            return (
                <div className="student-select-container">
                    Select A Student
                    <QueryHandler query={GET_STUDENTS(this.props.user.id)} inner={(element)=>{return<StudentPreview click={this.props.click}id={element.node.id} key={element.node.id} student={element.node.userByStudent}></StudentPreview>}}></QueryHandler>
                </div>);
        }else{
            console.log(this.props);
            return (<div>Please Log In</div>)
        }
    }
}

export default StudentSelect;
