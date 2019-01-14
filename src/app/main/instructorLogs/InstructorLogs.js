import React, {Component} from 'react';
import Mutation from '../../../delv/Mutation'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'

const GET_INSTRUCTOR_LOGS = `{
  allDateIntervals{
    nodes{
      nodeId
      attendancesByDate{
        nodes{
          nodeId
          studentByStudent{
            nodeId
          }
        }
      }
    }
  }
}`

class InstructorLogsInner extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        return <div>{JSON.stringify(this.props.allDateIntervals)}</div>
    }
}


class InstructorLogs extends Component{
    constructor(props){
        super(props)

    }

    render = () => {
        return <SecureRoute ignoreResult roles={["FTLC_LEAD_INSTRUCTOR", "FTLC_INSTRUCTOR"]}>
            <ReactQuery query={GET_INSTRUCTOR_LOGS}>
                <InstructorLogsInner />
            </ReactQuery>
        </SecureRoute>
    }
}
export default InstructorLogs
