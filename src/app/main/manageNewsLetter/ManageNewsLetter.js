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

    componentDidMount = () => {
        setTimeout(()=>{document.getElementById(`emailPreview`).innerHTML = this.state.newsLetter}, 0); // super hacky way to make contentEditable work
    }

    handleNewsLetterChange = (event) => {
        event.persist();
        this.setState({newsLetter:event.target.innerText})
    }

    edit = () => {
        this.setState({edit:true})
        setTimeout(()=>document.getElementById(`emailHTML`).innerText = this.state.newsLetter, 0); // super hacky way to make contentEditable work
    }

    preview = () => {
        document.getElementById(`emailHTML`).innerHTML = ''
        this.setState({edit:false})
        setTimeout(()=>{document.getElementById(`emailPreview`).innerHTML = this.state.newsLetter}, 0); // super hacky way to make contentEditable work
    }

    reset = () => {
        this.setState({newsLetter:defaultTemplate})
        setTimeout(()=>document.getElementById(`emailHTML`).innerText = defaultTemplate, 0); // super hacky way to make contentEditable work
    }

    send = () => {
        if(window.comfirm('Are you sure you would like to send this news letter?')){
            axios.post(API_URL, {html:this.state.body})
            .then(res=>{
                if(res.data.error){
                    window.alert(res.data.error)
                }
            }).catch(()=>{})
        }
    }

    render = () => {
        if(this.state.edit){
            return <div className='manage-news-letter main-contents'>
                <div>
                    <h2>News letter</h2>
                    <p>You CANNOT use css3 in emails, this means NO FLEXBOX. Likewise only inline styling works. indention does not matter, text areas do not support using the tab key and I recommend you just use a different text editor to write emial templates. The provided starter is for simple emails with a title and body. "Content here" can be replaced with your custom html if you would like to have more complex news letters. THIS WILL NOT CHECK IF THE HTML IS VALID, USE <a href='https://jsonformatter.org/html-validator' target='_blank'>https://jsonformatter.org/html-validator</a>.</p>
                </div>
                <div id='emailHTML' onInput={this.handleNewsLetterChange} className="news-letter-html styled-textarea" suppressContentEditableWarning={true} contentEditable></div>
                <div className='news-letter-btn-container'>
                    <div className='styled-button margin-top-10' onClick={this.preview}>preview</div>
                    <div className='styled-button margin-top-10' onClick={this.reset}>reset</div>
                </div>
            </div>
        }else{
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
}

export default ManageNewsLetter
