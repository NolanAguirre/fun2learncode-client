import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import Query from '../../../delv/Query'
import AddCard from '../creditCardForm/views/AddCard'
import {ReactQuery} from '../../../delv/delv-react'
import {SecureRoute} from '../common/Common'
import Popup from "reactjs-popup"
import './Payment.css'
import {CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  StripeProvider,
  Elements,
  injectStripe} from 'react-stripe-elements'
import axios from 'axios'
import loading from '../../logos/loading.svg'
import xicon from '../../logos/x-icon.svg'
import CardDropdown from '../creditCardForm/CardDropdown'

const USER_DATA = `{
    getUserData{
        id
        firstName
        lastName
        role
    }
}`
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            UI:'choose'
        }
    }

    setLoading = (loading) => {
        this.setState({loading:loading})
    }

    onCardComplete = (token) => {
        console.log(token)
        this.activeCard = token
        this.onSubmit()
    }

    onSubmit = () => {
        axios.post('http://localhost:3005/payment/process', {paymentItem:this.activeCard, user:this.props.user}).then((res)=>{ //TODO URL
            if(res.data.error){
                this.setState({UI:'error', error:res.data.error, loading:false})
            }else{
                this.setState({UI:'complete' ,loading:false, preventClose:true})
            }
        }).catch((error)=>{
            console.log(error)
            this.setState({UI:'error', error:'Network error occured', loading:false})
        })
    }

    setActiveCard = (card) => this.activeCard = {cardInfo: card}


    render = () => {
        let child;
        if(this.state.UI === 'error'){
            child = <div className='section container column'>
                    <div className='section center-y'>
                        <div className='error center-text'>{this.state.error}</div>
                    </div>
                <div className='styled-button center-text' onClick={()=>{this.setState({UI:'address', loading:false})}}>Back</div>
            </div>
        }else if(this.state.UI === 'choose'){
            child = <React.Fragment>
                <h2 className='center-text'>Select payment method</h2>
                <span>Total : ${this.props.total}</span>
                <CardDropdown user={this.props.user} setActiveCard={this.setActiveCard}/>
                <span className='without-save' onClick={()=>{this.setState({UI:'card'})}}>Continue without saving payment method.</span>
                <div className='styled-button center-text' onClick={this.onSubmit}>Submit</div>
            </React.Fragment>
        }else if(this.state.UI === 'complete'){
            child = <React.Fragment>
                <h2 className='center-text'>Transaction Complete!</h2>
                <a href='/'><div className="styled-button center-x center-text" style={{width:'200px'}}>Home</div></a>
            </React.Fragment>
        }else if(this.state.UI === 'card'){
            child = <AddCard callback={this.onCardComplete} />
        }
        return <Popup className='popup' open={this.props.showPopup} closeOnDocumentClick={false} closeOnEscape={!(this.state.loading || this.state.preventClose)} onClose={this.props.clearPopupState}>
                <div className='popup-inner'>
                    <div className='close-popup'>
                        {(this.state.UI !== 'error' || this.state.UI !== 'complete')?
                        <img onClick={this.props.clearPopupState} src={xicon}/>:''}
                    </div>
                    <div className='payment-container'>
                        {child}
                    <div className={this.state.loading?'payment-loading':'hidden-payment-loading'}><img className='loading-icon center-x' src={loading}/></div>
                    </div>
                </div>
            </Popup>
    }
}

export default Payment
