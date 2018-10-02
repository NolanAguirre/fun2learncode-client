import React, {Component} from 'react';
import './StudentSelect.css';
import StudentPreview from './studentPreview/StudentPreview';
import QueryHandler from '../queryHandler/QueryHandler';
import gql from 'graphql-tag';
const GET_STUDENTS = (parentId) => {
    return gql `
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
`
}
function StudentSelect(props) {
    function formatData(data){
        return data.allStudents.edges.map((element)=>{
                return <StudentPreview click={props.click} key={element.node.userByStudent.id} student={element.node.userByStudent} />
            })
    }
    if (props.user) {
        return (<div className="student-select-container">
            <div>
                Select A Student {
                    (props.student)
                        ? <div className="selected-student">
                                Current Student is:
                                <StudentPreview student={props.student}/>
                            </div>
                        : <div></div>
                }
            </div>
            <div className="students-container">
                <QueryHandler query={GET_STUDENTS(props.user.id)} child={formatData}/>
            </div>
        </div>);
    } else {
        return (<div>Please Log In</div>)
    }
}

export default StudentSelect;
