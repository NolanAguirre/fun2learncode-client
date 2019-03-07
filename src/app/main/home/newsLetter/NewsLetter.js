import React, {Component} from 'react'
import './NewsLetter.css'
import Mutation from '../../../../delv/Mutation'


const JOIN_NEWS_LETTER = `mutation($email:String!){
  makeNewsLetter(input:{arg0:$email}) {
    __typename
  }
}`


class NewsLetter extends Component{
    constructor(props){
        super(props);
        this.state = {email:''}
        this.mutation = new Mutation({
            mutation: JOIN_NEWS_LETTER,
            networkPolicy:'network-no-cache',
            onSubmit:this.handleSubmit,
            onResolve:this.handleResolve
        })
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
        return false;
    }
    handleResolve = (data) => {
        if(data.errors){
            this.setState({complete:2})
        }else{
            this.setState({complete:3})
        }
    }
    render = () => {
        let overlay;
        if(this.state.complete){
            setTimeout(()=>{this.setState({complete:undefined})}, 2000)
            if(this.state.complete === 2){
                overlay = <div className='news-letter-overlay error'>It appears you are already a memeber of our mailing list.</div>
            }else if(this.state.complete === 3){
                overlay = <div className='news-letter-overlay'>Thank you for joining our mailing list.</div>
            }
        }
        return<div className='news-letter-container'>
            <div className='news-letter-section'>
                <h2 className='no-margin center-text'>Join our news letter</h2>
                <form onSubmit={this.mutation.onSubmit} className='conatiner'>
                    <div className='news-letter-input-container'>
                        <input className='news-letter-input' name='email' onChange={this.handleChange}/>
                        <div className='news-letter-btn styled-button center-text' onClick={this.mutation.onSubmit}>Join</div>
                        {overlay}
                    </div>
                    <button className='hacky-submit-button' type='submit'/>
                </form>
            </div>
        </div>
    }
}

export default NewsLetter
