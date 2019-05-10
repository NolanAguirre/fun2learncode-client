import React, {Component} from 'react'
import './WhoWeAre.css'

function WhoWeAre(props){
    return <div className='who-we-are'>
            <h1 className='center-text who-we-are-header'>Who we are</h1>
            <div className='who-we-are-container main-content'>
                <div className='who-we-are-section'>
                    <h2>Our Goal</h2>
                    Fun 2 Learn Code offers a deiverse selection of project-based learning experiences focused on students intrests.
                    Our courses are created in house to ensure students are learning the most relevant and up to date topics in each class.
                    We strive to extends accessablity if code concepts to all those who are intrested, and work hard to ensure every student
                    has the opprotunity to learn, not matter the topic.
                </div>
                <div className='who-we-are-section'>
                    <h2>About us</h2>
                    Founded in 2013 by Manny Castro, Fun 2 Learn Code's roots stem from the need for accessable and afforable summer camp options
                    in the programming field.
                </div>
            </div>
    </div>
}

export default WhoWeAre
