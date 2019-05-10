import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './Hero.css'

const classNames = ['welcome-one', 'welcome-two', 'welcome-three']

class Hero extends Component{
    constructor(props){
        super(props)
        this.state = {className:0}
    }
    componentDidMount = () => {
        this.timeout = window.setInterval(()=>{this.setState({className:this.state.className+1})}, 5000)
    }

    componentWillUnmount = () => {
        window.clearInterval(this.timeout)
    }

    render = () => {
        return <div className={classNames[this.state.className%3]}>
            <div className='center-y section container'>
                <div className='center-x'>
                    <h1 className='welcome-text'>Welcome to Fun 2 Learn Code</h1>
                    <div className='hero-link-container'>
                        <div className='hero-link'><Link to='/activity/summer-camps'>View Camps</Link></div>
                        <div className='hero-link'><Link to='/activity/labs'>View Labs</Link></div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Hero
