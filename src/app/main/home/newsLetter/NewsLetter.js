import React, {Component} from 'react'
import './NewsLetter.css'
import Mutation from '../../../../delv/Mutation'


const JOIN_NEWS_LETTER = `mutation($email:String!){
  subscribToMailingList(email:$email)
}`


class NewsLetter extends Component{
    constructor(props){
        super(props);
        this.state = {email:''}
        this.mutation = new Mutation({
            mutation:JOIN_NEWS_LETTER,
            onSubmit:this.handleSubmit,
            onResolve:this.handleResolve
        })
    }

    componentWillUnmount = () => {
        clearTimeout(this.timeout)
        this.mutation.removeListeners()
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, error:null})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.email.match('^.+@.+\..+$')){
            return {email:this.state.email}
        }
        this.setState({error:'No valid email provided.'})
        return false
    }

    handleResolve = (data, errors) => {
        if(errors){
            this.setState({error:'It appears you are already a memeber of our mailing list.'})
        }else{
            this.setState({complete:true})
        }
    }
    render = () => {
        let overlay;
        if(this.state.error){
            this.timeout = setTimeout(()=>{this.setState({complete:undefined, error:undefined})}, 2000)
            overlay = <div className='news-letter-overlay error'>{this.state.error}</div>
        }else if(this.state.complete){
            this.timeout = setTimeout(()=>{this.setState({complete:undefined, error:undefined})}, 2000)
            overlay = <div className='news-letter-overlay'>Thank you for joining our mailing list.</div>
        }
        return<div className='news-letter-container'>
            <div className='news-letter-section'>
                <h2 className='no-margin center-text'>Join our news letter</h2>
                <form onSubmit={this.mutation.onSubmit} className='news-letter-input-container'>
                    <input className='news-letter-input' name='email' onChange={this.handleChange}/>
                    <div className='news-letter-btn styled-button center-text' onClick={this.mutation.onSubmit}>Join</div>
                    {overlay}
                    <button className='hacky-submit-button' type='submit'/>
                </form>
            </div>
        </div>
    }
}


export default NewsLetter
