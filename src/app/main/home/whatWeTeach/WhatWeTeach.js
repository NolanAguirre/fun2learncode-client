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
        name: 'Minecraft Redstone',
        description:''
    },{
        name:'Minecraft Mods',
        description:''
    },{
        name: 'Python',
        description:''
    },{
        name: 'Java',
        description:''
    },{
        name: 'Unity/VR',
        description:''
    }
]

function WhatWeTeachSection(props){
    return<div className='teach-center'>
            <div className='teach-container'>
                <div className='teach-text'>
                    <h3 className='no-margin center-text'>{props.name}</h3>
                    <p onClick={()=>props.onClick(props.name)}className='center-text'>Learn more</p>
                </div>
            </div>
        </div>
}
class WhatWeTeach extends Component{
    constructor(props){
        super(props);
        this.state = {showPopup:false, text:''}
    }
	showPopup = (name) => {
        const text = TOPICS.filter((item)=>item.name===name)[0]
		this.setState({showPopup:true, text})
	}
	clearPopupState = () => {
		this.setState({showPopup:false, text:''})
	}
	render = () => {
		return <React.Fragment>
			<Popup className='payment-overview-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <div className='topic-description'>
                    <h1 className='center-text'>{this.state.text.name}</h1>
                    {this.state.text.description}
                </div>
			</Popup>
            <div className='what-we-teach'>
                <div className='main-contents container column'>
                    <h1 className='center-text'>What we teach</h1>
                    <div className='teach-row'>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Scratch')} name='Scratch'/>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Kodu')} name='Kodu'/>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Minecraft Redstone')} name='Minecraft Redstone'/>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Minecraft Mods')} name='Minecraft Mods'/>
                    </div>
                    <div className='teach-row'>
                        <div></div>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Python')} name='Python'/>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Java')} name='Java'/>
                        <WhatWeTeachSection onClick={()=>this.showPopup('Unity/VR')} name='Unity/VR'/>
                        <div></div>
                    </div>
                </div>
            </div>
		</React.Fragment>
	}
}
export default WhatWeTeach
