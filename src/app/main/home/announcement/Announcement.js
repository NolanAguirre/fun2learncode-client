import React, {Component} from 'react'
import './Announcement.css'
import Mutation from '../../../../delv/Mutation'
import next from '../../../logos/next.svg'
import moment from 'moment'
import { ReactQuery } from '../../../../delv/delv-react'

const ANNOUNCEMENTS = (params) => `{
  allAnnouncements(filter:{id:{greaterThan:${params.greaterThan}, lessThan:${params.lessThan}}}) {
    nodes{
      nodeId
      id
      message
      title
      createdOn
    }
  }
}
`

const TOTAL_COUNT = `{
  allAnnouncements {
    totalCount
  }
}`

function AnnouncementsDisplay(props){
    return  props.allAnnouncements.nodes.sort((a,b)=>a.id < b.id).map((item)=>{
        return <div key={item.nodeId} className='announcement-body-container'>
            <h2 className='center-text'>{item.title}</h2>
            <div className='created-on center-text'> announcement made: {moment(item.createdOn).format('MMM Do YYYY')}</div>
            <div className='announcement-body'>
                {item.message}
            </div>
        </div>
    })
}

class Announcements extends Component{
    constructor(props){
        super(props);
        this.count = this.props.data.allAnnouncements.totalCount
        this.state = {head:this.count+1}
    }
    getSet = (head) => {
        if(this.count > 3){
            if(head > this.count +1){
                return {lessThan: this.count +1, greaterThan: this.count - 3}
            }else if (head < 3){
                return {lessThan:4, greaterThan: 0}
            }else{
                return{lessThan:head, greaterThan:head-4}
            }
        }else{
            return {lessThan: this.count +1, greaterThan: 0}
        }
    }

    moveHead = (value) => {
        this.setState({head:this.state.head + value})
    }

    render = () => {
        const params = this.getSet(this.state.head)
        return <div className='announcements'>
            <div className='announcement-arrow'>
                {this.state.head < this.count +1?
                    <div onClick={()=>{this.moveHead(3)}}>
                    <img className='previous' src={next} title='Icon made by Gregor Cresnar'/>
                    newer
                </div>:''}
            </div>
            <div className='announcements-container'>
                <ReactQuery query={ANNOUNCEMENTS(params)} skipLoading>
                    <AnnouncementsDisplay />
                </ReactQuery>
            </div>
            <div className='announcement-arrow'>
                {this.state.head > 4?
                <div onClick={()=>{this.moveHead(-3)}}>
                    <img src={next} title='Icon made by Gregor Cresnar'/>
                    older
                </div>:''}

            </div>
        </div>
    }
}

function Announcement(props){
    return <div className='main-contents home-announcement'>
        <div className='center-y section container'>
            <h1 className='center-text'>Announcements</h1>
            <ReactQuery networkPolicy='network-no-cache' loading={<div>loading when i shouldnt</div>} query={TOTAL_COUNT}>
                <Announcements />
            </ReactQuery>
        </div>
    </div>
}

export default Announcement
