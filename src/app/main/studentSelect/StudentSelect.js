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
                    <div>
                        Select A Student
                    {(this.props.student)?
                        <div className="selected-student">
                            Current Student is:
                            <StudentPreview student={this.props.student} />
                        </div>
                        :<div></div>}
                    </div>
                    <div className="students-container">
                        <QueryHandler query={GET_STUDENTS(this.props.user.id)} inner={(element)=>{return<StudentPreview click={this.props.click} key={element.node.userByStudent.id} student={element.node.userByStudent}></StudentPreview>}}></QueryHandler>
                    </div>
                </div>);
        }else{
            console.log(this.props);
            return (<div>Please Log In</div>)
        }
    }
}

export default StudentSelect;
