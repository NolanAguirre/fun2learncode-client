import React, {Component} from 'react'
import './Announcement.css'
import next from '../../../logos/next.svg'
import moment from 'moment'
import { ReactQuery } from '../../../../delv/delv-react'

const ANNOUNCEMENTS = (params) => `{
  allAnnouncements(filter:{id:{greaterThan:${params.greaterThan}, lessThan:${params.lessThan}}}) {
    nodes{
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
    return  props.allAnnouncements.nodes.sort((a,b)=>b.id - a.id).map((item)=>{
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
        const  width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        this.count = this.props.data.allAnnouncements.totalCount
        let step
        if(width >= 1300){
            step = 3
        }else if(width <= 700){
            step = 1
        }else if(width < 1300){
            step = 2
        }
        this.state = {head:this.count+1, step}

    }
    getSet = (head) => {
        if(this.count > this.state.step){
            if(head > this.count+1){
                return {lessThan: this.count +1, greaterThan: this.count -  this.state.step}
            }else if (head <  this.state.step){
                return {lessThan: this.state.step+1, greaterThan: 0}
            }else{
                return{lessThan:head, greaterThan:head-(this.state.step+1)}
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
        const width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
        if(width >= 1300 && this.state.step !== 3){
            setTimeout(()=>this.setState({step:3}), 0)
        }else if(width <= 700 && this.state.step !== 1){
            setTimeout(()=>this.setState({step:1}), 0)
        }else if(width < 1300 && width > 700 && this.state.step !== 2){
            setTimeout(()=>this.setState({step:2}), 0)
        }
        return <div className='announcements'>
            <div className='announcement-arrow'>
                {this.state.head < this.count +1?
                    <div onClick={()=>{this.moveHead(this.state.step)}}>
                    <img className='previous' src={next} title='Icon made by Gregor Cresnar'/>
                    newer
                </div>:''}
            </div>
            <div className='announcements-container'>
                <ReactQuery query={ANNOUNCEMENTS(params)}>
                    <AnnouncementsDisplay />
                </ReactQuery>
            </div>
            <div className='announcement-arrow'>
                {this.state.head > this.state.step+1?
                <div onClick={()=>{this.moveHead(-1 * this.state.step)}}>
                    <img src={next} title='Icon made by Gregor Cresnar'/>
                    older
                </div>:''}

            </div>
        </div>
    }
}

function Announcement(props){
    return <div>
        <div className='center-x section container column'>
            <h1 className='who-we-are-header center-x'>Announcements</h1>
            <ReactQuery networkPolicy='network-no-cache' loading={<div>loading when i shouldnt</div>} query={TOTAL_COUNT}>
                <Announcements />
            </ReactQuery>
        </div>
    </div>
}

export default Announcement
