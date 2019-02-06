import React, {Component} from 'react'
import './WhatWeTeach.css'
import Popup from "reactjs-popup"

// const TOPICS = [
//     {
//         name: 'Scratch'
//         description:
//     },{
//         name: 'Kodu'
//         description:
//     },{
//         name: 'Minecraft Redstone'
//         description:
//     },{
//         name:'Minecraft Mods'
//         description:
//     },{
//         name: 'Python'
//         description:
//     },{
//         name: 'Java'
//         description:
//     },{
//         name: 'Unity'
//         description:
//     },{
//         name: 'VR'
//         description:
//     }
// ]

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
		this.setState({showPopup:true})
	}
	clearPopupState = () => {
		this.setState({showPopup:false})
	}
	render = () => {
		return <React.Fragment>
			<Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <div>yo</div>
			</Popup>
            <div className='what-we-teach'>
                <div className='main-contents container column'>
                    <h1 className='center-text'>What we teach</h1>
                    <div className='teach-row'>
                        <WhatWeTeachSection onClick={this.showPopup} name='Scratch'/>
                        <WhatWeTeachSection onClick={this.showPopup} name='Kodu'/>
                        <WhatWeTeachSection onClick={this.showPopup} name='Minecraft Redstone'/>
                        <WhatWeTeachSection onClick={this.showPopup} name='Minecraft Mods'/>
                    </div>
                    <div className='teach-row'>
                        <div></div>
                        <WhatWeTeachSection onClick={this.showPopup} name='Python'/>
                        <WhatWeTeachSection onClick={this.showPopup} name='Java'/>
                        <WhatWeTeachSection onClick={this.showPopup} name='Unity/VR'/>
                        <div></div>
                    </div>
                </div>
            </div>
		</React.Fragment>
	}
}
export default WhatWeTeach
