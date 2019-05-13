import React, {Component} from 'react';
import './ClassStructure.css';
import {GridView} from '../../common/Common'
const STRUCTURES = [
    {
        name:'Summer Camps',
        description:'Summer camps are week long events that cover one of many topics. They take place in a classroom environment allowing for students to work together and socialize. The average camp covers one topic for the its entire duration, with students working to create one or more project pertaining to that topic. With a student to teacher ratio of 6:1 summer camps are best suited for students that do well in a classroom like environment.'
    },
    {
        name:'Labs',
        description:'Labs are our most flexible class structure. Unlike the other options, labs have no set topic, they focus solely on the student’s interests. The average student to teacher ratio for a lab is 1:1, this allows for a highly personalized learning experience. For beginner we follow a basic introductory curriculum, while more advanced students are just asked them “What do you want to make?” and are taught how.'
    },
    {
        name:'Classes',
        description:'Classes cover the same topic as a summer camp, however do so over a longer duration. Class’s meet for between 1 month and 3 months, generally weekly and run during the school year without conflicting with the school schedule. The student to teacher ratio is usually lower than that of a summer camp, averaging at 3:1. Classes are a good alternative to summer camps for students who cannot sit for 3 hours, or for students who couldn’t attend a summer camp.'
    },
    {
        name:'Workshops',
        description:'Workshops are our oddball events. There are no rules when it comes to workshops, so we encourage you to just check them out for yourself!'
    }
]
function ClassStructure(props){

    const items = STRUCTURES.map((item)=>{
        return <div className="card section-card" key={item.name}>
            <h2 className='what-we-teach-header'>{item.name}</h2>
            <div className="container column">
                <div className="home-section">{item.description}</div>
            </div>
        </div>
    })
    return <GridView className='' itemsPerRow={2}>
        {items}
    </GridView>
}

export default ClassStructure
