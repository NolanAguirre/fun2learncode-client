import React, {Component} from 'react'
import './WhatWeTeach.css'
import Popup from "reactjs-popup"

const TOPICS = [
    {
        name: 'Scratch',
        description:'Scratch is a programming language and an online community where children can program and share interactive media such as stories, games, and animation with people from all over the world. As children create with Scratch, they learn to think creatively, work collaboratively, and reason systematically. Scratch is designed and maintained by the Lifelong Kindergarten group at the MIT Media Lab.'
    },{
        name: 'Kodu',
        description:'Kodu lets kids create games on the PC and Xbox via a simple visual programming language. Kodu can be used to teach creativity, problem solving, storytelling, as well as programming. Anyone can use Kodu to make a game, young children as well as adults with no design or programming skills.'
    },{
        name: 'Python',
        description:''
    },{
        name:'Minecraft Mods',
        description:'Minecraft Mods (short for modifications) allow for anyone to add their own items, blocks and more to minecraft. While anyone can make minecraft mods, sadly mods are runnable on PC only.'
    },{
        name: 'Java',
        description:''
    },{
        name: 'Unity',
        description:"Unity is a professional grade game engine, that is free to the public to use. Powered by C#, and containng a easy to use UI, Unity has become the game engine that powers over half the world's games. Using unity students are able to create their very own game."
    },{
        name: 'VR',
        description:'Leveraging the power of Unity, students are able to create Virtual Reality games on the Vive headset.'
    }
]

class WhatWeTeachSection extends Component{
    constructor(props){
        super(props)
        this.state={showPopup:false}
    }

    render = () => {
        return<div className='teach-center'>
                <h3 className='no-margin center-text'>{this.props.name}</h3>
                <Popup
                className='popup'
                contentStyle={{padding:'0px!important'}}
                open={this.state.showPopup} trigger={<p className='learn-more'>Learn more</p>}>
                    <div className='topic-description'>
                        {TOPICS.filter((item)=>item.name===this.props.name)[0].description}
                    </div>
            	</Popup>
            </div>
    }
}
class WhatWeTeach extends Component{
	render = () => {
		return <React.Fragment>
            <div className='what-we-teach'>
                <div className='what-we-teach-center'>
                    <h1 className='what-we-teach-header'>What we teach</h1>
                    <div className='teach-row'>
                        <WhatWeTeachSection name='Scratch'/>
                        <WhatWeTeachSection name='Kodu'/>
                        <WhatWeTeachSection name='Python'/>
                        <WhatWeTeachSection name='Minecraft Mods'/>
                    </div>
                    <div className='teach-row'>
                        <div></div>
                        <WhatWeTeachSection name='Java'/>
                        <WhatWeTeachSection name='Unity'/>
                        <WhatWeTeachSection  name='VR'/>
                        <div></div>
                    </div>
                </div>
            </div>
		</React.Fragment>
	}
}
export default WhatWeTeach
