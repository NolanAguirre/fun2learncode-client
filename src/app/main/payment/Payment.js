import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
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

const USER_DATA = `{
    getUserData{
        nodeId
        id
        firstName
        lastName
        role
    }
}`

const createStripeStyle = {
    style: {
      base: {
        fontSize:'24px',
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace'
      },
      invalid: {
        color: '#9e2146',
      }
    }
  };

class PaymentInformationEntry extends Component{
    constructor(props){
        super(props)
        this.state = {cardholder:'', promoCode:'', address:'', city:'', state:'', showAddress:true};
    }

    showCard = () => {
        if(this.state.address === ''){
            this.setState({addressError:'Address is required.'})
        }else if(this.state.city === ''){
            this.setState({cityError:'City is required.'})
        }else if(this.state.state === ''){
            this.setState({stateError:'State is required.'})
        }else if(this.state.promoCode === ''){
            this.setState.showAddress({showAddress:false})
        }else{
            axios.post('http://localhost:3005/promoCode', {promoCode:this.state.promoCode, event:this.props.event.id, catagory:this.props.activity.id}).then((data)=>{
                if(data.data.error){
                    this.setState({promoCodeError:data.data.error})
                }else{
                    const code = data.data.promoCode
                    this.setState({showAddress:false})
                    if(code.percent){
                        this.total = this.props.total * (100-code.effect)/100
                    }else{
                        this.total = this.props.total - code.effect;
                    }
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, [name+'Error']:null})
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(!this.isProcessing){
            this.isProcessing = true
            if(this.state.cardholder != ''){
                this.props.stripe.createToken({name: this.state.cardholder}).then(({token, error}) => {
                    if(error){
                        this.isProcessing = false;
                        this.setState({error:error.message})
                    }else{
                        const {
                            promoCode,
                            address,
                            city,
                            state
                        } = this.state
                        this.props.handleSubmit({token, promoCode, address, city, state})
                    }
                });
            }else{
                this.setState({error:'Cardholder name required'})
            }
        }
    }

    render = () => {
        return <div className='login-widget'>
            <form  className='container section' onSubmit={this.handleSubmit}>
                <div className={this.state.showAddress?'payment-container':'hidden'}>
                    <h1 className='center-text'>Sub total: {this.props.total}$</h1>
                    <div className='sign-up-input-container'>
                          <div className='payment-input-container'>
                               {this.state.addressError?<span className='error'>{this.state.addressError}</span>:'Address'}
                            <input className='styled-input' name='address' onChange={this.handleChange}/>
                          </div>
                    </div>
                    <div className='container'>
                        <div className='small-input edge-margin'>
                             {this.state.cityError?<span className='error'>{this.state.cityError}</span>:'City'}
                            <input className='styled-input' name='city' placeholder='Austin' onChange={this.handleChange}/>
                        </div>
                        <div className='small-input edge-margin'>
                             {this.state.stateError?<span className='error'>{this.state.stateError}</span>:'State'}
                            <input className='styled-input' name='state' placeholder='Texas' onChange={this.handleChange}/>
                        </div>
                    </div>
                  <div className='container'>
                     <div className='small-input edge-margin'>
                          ZIP/Postal code
                          <PostalCodeElement className='styled-input' {...createStripeStyle}/>
                      </div>
                      <div className='small-input edge-margin'>
                           {this.state.promoCodeError?<span className='error'>{this.state.promoCodeError}</span>:'Promo code'}
                          <input className='styled-input' name='promoCode' placeholder='Promo Code' onChange={this.handleChange}/>
                      </div>
                  </div>
                   <div className='event-register-btn center-text' onClick={this.showCard}>Next</div>
              </div>
              <div className={this.state.showAddress?'hidden':'payment-container'}>
                  <h1 className='center-text'>Total: {this.total}$</h1>
                  <div className='container'>
                      {this.state.cardholderError?<span className='error'>{this.state.cardholderError}</span>:'Cardholder name'}
                      <input className='styled-input' placeholder="John Doe" name='cardholder' onChange={this.handleChange}/>
                </div>
                <div className='sign-up-input-container'>
                      Card number
                    <CardNumberElement className='styled-input' {...createStripeStyle}/>
                </div>
                <div className='container'>
                    <div className='small-input edge-margin'>
                        Expiry date
                        <CardExpiryElement className='styled-input '  {...createStripeStyle}/>
                    </div>
                    <div className='small-input edge-margin'>
                        Security Code
                        <CardCVCElement className='styled-input' {...createStripeStyle}/>
                    </div>
                </div>
                 <div className='event-register-btn center-text' onClick={this.handleSubmit}>Submit</div>
              </div>
          </form>
      </div>
    }
}

const PaymentInfoEntry= injectStripe(PaymentInformationEntry)

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            state:'card'
        }

    }

    showPopup = (total) => {
        this.setState({showPopup: true, total});

    }

    clearPopupState = () => {
        this.setState({showPopup: false, total:0});
    }

    handleSubmit = ({token, promoCode}) => {
        this.setState({state:'loading'})
        this.props.handleSubmit({token, promoCode, callback: (res)=>{this.setState({state:'complete',complete:res.data})}})
    }

    render = () => {
        let child;
        if(this.state.state === 'loading'){
            child = <div>loading</div>
        }else if(this.state.state === 'complete'){
            if(this.state.complete.error){
                child = <span className='error'>{this.state.complete.error}</span>
            }else{
                child = <div>Transaction successful</div>
            }
        }else if(this.state.state === 'card'){
            child = <StripeProvider apiKey='pk_test_GcXQlSWyjflCxQsqQoNz8kRb'>
                    <Elements>
                        <PaymentInfoEntry activity={this.props.activity} event={this.props.event} handleSubmit={this.handleSubmit} total={this.state.total}/>
                    </Elements>
                </StripeProvider>
        }
        return <React.Fragment>
            <Popup className='payment-overview-popup' open={this.state.showPopup} closeOnEscape={!this.state.loading} closeOnDocumentClick={!this.state.loading} onClose={this.clearPopupState}>
                {child}
            </Popup>
            <button className="continue-to-payment-btn" onClick={()=>{this.showPopup(this.props.getTotal())}}> Continue to Payment</button>
        </React.Fragment>
    }
}

export default Payment
