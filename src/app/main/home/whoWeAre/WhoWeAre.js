import React, {Component} from 'react'
import './WhoWeAre.css'

function WhoWeAre(props){
    return <div className='who-we-are'>
        <div className='main-contents'>
            <h1 className='center-text'>Who we are</h1>
            <div className='who-we-are-container'>
                <div className='who-we-are-section'>
                    <h2>Our Goal</h2>
                    Our goal at Fun 2 Learn code is to provide educational, and fun
                </div>
                <div className='who-we-are-section'>
                    <h2>About us</h2>
                    Founded in 2013
                </div>
            </div>
        </div>
    </div>
}

export default WhoWeAre
