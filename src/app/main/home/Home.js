import React, {Component} from 'react'
import './Home.css'
import Section from './section/Section'
import Mutation from '../../../delv/Mutation'
import { ReactQuery } from '../../../delv/delv-react'

const GET_ACTIVITIES = `{
  allActivityCatagories {
    nodes {
      nodeId
      name
      description
      id
    }
  }
}`

const JOIN_NEWS_LETTER = `mutation($email:String!){
  createNewsLetter(input:{newsLetter:{email:$email}}) {
    __typename
  }
}`

class NewsLetterForm extends Component{
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
        console.log(data)
        if(data.errors){
            this.setState({complete:0})
        }else{
            this.setState({complete:1})
        }
    }
    render = () => {
        if(this.state.complete){
            if(this.state.complete === 0){
                return <div>It appears you're already a memeber of our mailing list.</div>
            }else if(this.state.complete === 1){
                return <div>Thank you for joining our mailing list.</div>
            }
        }else{
            return<form onSubmit={this.mutation.onSubmit} className='conatiner'>
                <input className='styled-input' name='email' onChange={this.handleChange}/>
                <div className='event-register-btn center-text' onClick={this.mutation.onSubmit}>Join</div>
                <button className='hacky-submit-button' type='submit'/>
            </form>
        }
    }
}
function HomeInner(props){
    return props.allActivityCatagories.nodes.map((element) => {
      return <Section name={element.name} description={element.description} key={element.id} />
    })
}
function Home (props) {
  return <div className='home'>
    <h2>Home</h2>
    <NewsLetterForm />
    <ReactQuery query={GET_ACTIVITIES}>
        <HomeInner />
    </ReactQuery>
  </div>
}

export default Home
