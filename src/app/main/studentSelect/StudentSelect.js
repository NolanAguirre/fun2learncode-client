import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'

const GET_STUDENTS_BY_PARENT = (parentId) => {
    return gql `{
  allStudents(condition: {parent: "${parentId}"}) {
    nodes {
      nodeId
      id
      userByStudent {
        nodeId
        id
        firstName
        lastName
      }
    }
  }
}`}

class StudentSelectInner extends Component {
    constructor(props){
        super(props)
        this.state = {students:props.queryResult.allStudents, selectedStudents:[]}
    }
    toggleStudent = (id) =>{
        if(this.state.selectedStudents.includes(id)){
            const newSelectedStudents = this.state.selectedStudents.filter((student)=>{return student!=id})
            this.setState({selectedStudents:newSelectedStudents})
        }else{
            this.setState({selectedStudents:[...this.state.selectedStudents, id]})
        }
    }
    render(){
      return this.state.students.nodes.map((element) => {
        const selected = this.state.selectedStudents.includes(element.userByStudent.id);
        return <StudentPreview key={element.userByStudent.id} selected={selected} onClick={this.toggleStudent} student={element.userByStudent} />
      })
    }
}

function StudentSelect(props) {
    return <div className='student-select-container'>
            <h3>Select A Student</h3>
          <div className='students-container'>
            <QueryHandler query={GET_STUDENTS_BY_PARENT(props.queryResult.getUserData.id)}>
                    <StudentSelectInner />
            </QueryHandler>
        </div>
  </div>
}

export default StudentSelect
