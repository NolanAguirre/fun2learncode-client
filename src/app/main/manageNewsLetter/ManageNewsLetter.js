import React, { Component } from 'react'
import './ManageNewsLetter.css'
import axios from 'axios'

const API_URL = 'http://localhost:3005/mailing'

const defaultTemplate = `<div style="width:100%;height:100%;">
    <div style="background-color:#41a62a">
        <h1 style="text-align:center; font-family:Zekton; color:white; margin:0; padding:20px 0;">Fun 2 Learn Code</h1>
    </div>
    <!-- ABOVE IS THE CODE FOR THE HEADER, I WOULD RECOMMENT YOU DONT CHANGE IT -->
    <div style="margin:0 auto; max-width:400px; color:black;">
        <h2>Title here</h2>
        Content Here
        <!-- BELOW IS THE CODE FOR THE FOOTER, I WOULD RECOMMENT YOU DONT CHANGE IT -->
        <p style="font-size:10px;color:rgb(102, 102, 102);">To unsubscribe from our news letter <a href='http://localhost:3000/recover'>click here</a>.</p>
    </div>
</div>`



class ManageNewsLetter extends Component{
    constructor(props){
        super(props)
        this.state = {edit:false, newsLetter:defaultTemplate}
    }

    render = () => {
        return <div className='manage-news-letter main-contents'>
            <div className='news-letter-preview'>
                <h2>News letter</h2>
                <p>The below area is how the news letter SHOULD appear in the email. The black border will not appear, it is just to outline of the preview email so you know what is the email and what is the website.</p>
                </div>
        <div id='emailPreview'></div>
            <div className='news-letter-btn-container'>
                <div className='styled-button margin-top-10' onClick={this.edit}>Edit</div>
                <div className='styled-button margin-top-10'>Send</div>
            </div>
        </div>
    }
}

export default ManageNewsLetter
