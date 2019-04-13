import React, {Component} from 'react'
import './Home.css'
import spline from '../../logos/spline.svg'
import WhatWeTeach from './whatWeTeach/WhatWeTeach'
import Announcement from './announcement/Announcement'
import NewsLetter from './newsLetter/NewsLetter'
import WhoWeAre from './whoWeAre/WhoWeAre'
import ClassStructure from './classStructure/ClassStructure'
const GET_ACTIVITIES = `{
  allCategories {
    nodes {
      name
      description
      id
    }
  }
}`

function Home (props) {
  return <div className='home'>
    <div className='welcome'>
        <div className='center-y section container'>
            <div className='center-x'>
                <h1 className='welcome-text'>Welcome to Fun 2 Learn Code</h1>
            </div>
        </div>
    </div>
    <WhoWeAre />
    <div className='spline flipped-spline-container'>
        <img className='flipped-spline' src={spline}/>
    </div>
    <WhatWeTeach />
    <div className='spline'>
        <img  src={spline}/>
    </div>
    <div className='class-structure main-contents'>
        <h1 className='center-text'>Class Structure</h1>
        <ClassStructure />
    </div>
    <div className='spline flipped-spline-container'>
        <img className='flipped-spline' src={spline}/>
    </div>
    <div className='gap-cover'></div>
    <div className='spline'>
        <img  src={spline}/>
    </div>
    <Announcement />
    <NewsLetter />
  </div>
}

export default Home
