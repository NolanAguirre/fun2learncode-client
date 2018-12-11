import React, { Component } from 'react'
import './StudentSelect.css'
import StudentPreview from './studentPreview/StudentPreview'
import QueryHandler from '../queryHandler/QueryHandler'
import gql from 'graphql-tag'
import Popup from "reactjs-popup"
import {CreateAccount} from '../signUp/SignUp'
import DateTime from 'react-datetime';

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

function SignUpAddOn(props, openCalendar, closeCalendar){
    return<div>
                <input {...props} />
                <button onClick={openCalendar}>open calendar</button>
                <button onClick={closeCalendar}>close calendar</button>
            </div>

}

class StudentForm extends Component{
    constructor(props){
        super(props);
        this.state = {showPopup:false}
    }

    showPopup = () =>{
        this.setState({showPopup:true});
    }

    clearPopupState = () =>{
        this.setState({showPopup:false});
    }

    render = () => {
        return <React.Fragment>
            <Popup
                open={this.state.showPopup}
                closeOnDocumentClick
                onClose={this.clearPopupState}>
            <CreateAccount>
                 <DateTime inputProps={{className:'sign-up-form-input'}} dateFormat="YYYY-MM-DD" viewMode='years' />
            </CreateAccount>
            </Popup>
        <div onClick={this.showPopup} className='student-preview-container'>

            new Student
        </div>
    </React.Fragment>
    }

}

class StudentSelectInner extends Component {
    constructor(props){
        super(props)
        this.state = {students:props.queryResult.allStudents, selectedStudents:[]}
    }
    toggleStudent = (id) =>{
        if(this.state.selectedStudents.includes(id)){
            const newSelectedStudents = this.state.selectedStudents.filter((student)=>{return student!=id})
            this.props.setSelectedStudents(newSelectedStudents)
            this.setState({selectedStudents:newSelectedStudents})
        }else{
            if(this.props.multiSelect){
                this.props.setSelectedStudents([...this.state.selectedStudents, id])
                this.setState({selectedStudents:[...this.state.selectedStudents, id]})
            }else{
                this.props.setSelectedStudents(id)
                this.setState({selectedStudents:[id], students:this.props.queryResult.allStudents})
            }
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
            <QueryHandler query={GET_STUDENTS_BY_PARENT(props.user.id)}>
                    <StudentSelectInner {...props}/>
            </QueryHandler>
            <StudentForm />
        </div>
  </div>
}

export default StudentSelect
