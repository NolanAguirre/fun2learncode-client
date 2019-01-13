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
        this.state = {cardholder:'', promoCode:''};
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        if(name === 'cardholder'){
            this.setState({[name]: value, error:null})

        }else{
            this.setState({[name]: value})
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.cardholder != ''){
            this.props.stripe.createToken({name: this.state.cardholder}).then(({token}) => {
                this.props.handleSubmit({token, promoCode:this.state.promoCode})
            });
        }else{
            this.setState({error:'Cardholder name required'})
        }
    }

    render = () => {
        return <div className='payment-container'>
            <h1>Total: {this.props.total}$</h1>
            <form className='sign-up-form' onSubmit={this.handleSubmit}>
                <div className='sign-up-input-container'>
                    <div className='payment-input-container'>
                         {this.state.error?<span className='error'>{this.state.error}</span>:'Cardholder name'}
                        <input className='sign-up-form-input' placeholder="John Doe" name='cardholder' onChange={this.handleChange}/>
                        </div>
              </div>
                <div className='sign-up-input-container'>
                    <div className='payment-input-container'>
                        Card number
                      <CardNumberElement className='sign-up-form-input' {...createStripeStyle}/>
                        </div>
              </div>


              <div className='sign-up-input-container'>
                  <div className='edge-margin'>
                      Expiry date
                      <CardExpiryElement className='sign-up-form-input-small '  {...createStripeStyle}/>
                  </div>
                  <div className='edge-margin'>
                      Security Code
                      <CardCVCElement className='edge-padding sign-up-form-input-small' {...createStripeStyle}/>
                  </div>
              </div>
              <div className='sign-up-input-container'>
                  <div className='edge-margin'>
                      ZIP/Postal code
                      <PostalCodeElement className='sign-up-form-input-small' {...createStripeStyle}/>
                  </div>
                  <div className='edge-margin'>
                      Promo code
                      <input className='sign-up-form-input-small' name='promoCode' placeholder='Promo Code' onChange={this.handleChange}/>
                  </div>
              </div>
              <button className='submit-payment-btn' type='submit'>Submit</button>
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
            preventClose:false
        }

    }

    showPopup = (total) => {
        this.setState({showPopup: true, total});

    }

    clearPopupState = () => {
        this.setState({showPopup: false, total:0});
    }


    handleSubmit = (token) => {
        this.setState({preventClose:true});
        this.props.handleSubmit(token)
    }

    render = () => {
        return <React.Fragment>
            <Popup preventClose={this.state.preventClose} className='payment-overview-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <div className='payment-overview-container'>
                    <StripeProvider apiKey='pk_test_GcXQlSWyjflCxQsqQoNz8kRb'>
                        <Elements>
                            <PaymentInfoEntry handleSubmit={this.props.handleSubmit} total={this.state.total}/>
                        </Elements>
                    </StripeProvider>
                </div>
            </Popup>
            <button className="continue-to-payment-btn" onClick={()=>{this.showPopup(this.props.getTotal())}}> Continue to Payment</button>
        </React.Fragment>
    }
}

export default Payment
