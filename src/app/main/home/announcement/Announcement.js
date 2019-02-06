import React, {Component} from 'react'
import './Announcement.css'
import Mutation from '../../../../delv/Mutation'
import next from '../../../logos/next.svg'
import moment from 'moment'
function Announcement(props){
    return <div className='main-contents home-announcement'>
        <div className='center-y section container'>
            <h1 className='center-text'>Announcements</h1>
            <div className='announcements'>
                <div className='announcement-arrow'>
                    <div>
                        <img className='previous' src={next} title='Icon made by Gregor Cresnar'/>
                        newer
                    </div>
                </div>
                <div className='announcements-container'>
                    <div className='announcement-body-container'>
                        <h2 className='center-text'>New Website!</h2>
                        <div className='created-on center-text'> announcement made: {moment().format('MMM Do YYYY')}</div>
                        <div className='announcement-body'>
                            We have a new website.
                        </div>
                    </div>
                    <div className='announcement-body-container'>
                        <h2 className='center-text'>New Website!</h2>
                        <div className='created-on center-text'> announcement made: {moment().format('MMM Do YYYY')}</div>
                        <div className='announcement-body'>
                            We have a new website.
                        </div>
                    </div>
                    <div className='announcement-body-container'>
                        <h2 className='center-text'>New Website!</h2>
                        <div className='created-on center-text'> announcement made: {moment().format('MMM Do YYYY')}</div>
                        <div className='announcement-body'>
                            We have a new website.
                        </div>
                    </div>
                </div>
                <div className='announcement-arrow'>
                    <div>
                        <img src={next} title='Icon made by Gregor Cresnar'/>
                        older
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Announcement
