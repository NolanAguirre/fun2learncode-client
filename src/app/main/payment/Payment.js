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
import loading from '../../logos/loading.svg'

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

class AddressForm extends Component{
    constructor(props){
        super(props)
        this.state = {promoCode:'', address:'', city:'', state:''};
    }
    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, [name+'Error']:null})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.address === ''){
            this.setState({addressError:'Address is required.'})
        }else if(this.state.city === ''){
            this.setState({cityError:'City is required.'})
        }else if(this.state.state === ''){
            this.setState({stateError:'State is required.'})
        }else{
            axios.post('http://localhost:3005/payment', {promoCode:this.state.promoCode, ...this.props.info}).then((data)=>{
                this.props.callback({response:data, address:this.state.addres, city:this.state.city, state:this.state.state});
            }).catch((error)=>{
                console.log(error)
            })
            this.props.transition('loading')
        }
    }
    render = () => {
        return <form  className='container section' onSubmit={this.handleSubmit}>
            <div className='payment-container'>
                <h1 className='center-text no-margin'>Billing information</h1>
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
                      {this.state.promoCodeError?<span className='error'>{this.state.promoCodeError}</span>:'Promo code'}
                      <input className='styled-input' name='promoCode' placeholder='Promo Code' onChange={this.handleChange}/>
                  </div>
                 <div className='small-input edge-margin'>
                  </div>
              </div>
               <div className='event-register-btn center-text' onClick={this.handleSubmit}>Next</div>
               <button className='hacky-submit-button' type='submit'/>
          </div>
      </form>
    }
}

class PaymentInformationEntry extends Component{
    constructor(props){
        super(props)
        this.state = {cardholder:''};
        this.isProcessing = false;
    }
    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, error:null})
    }
    handleSubmit = (event) => {
        if(!this.isProcessing){
            this.isProcessing = true
            if(this.state.cardholder != ''){
                this.props.stripe.createToken({name: this.state.cardholder, address_line1:this.props.address, address_city:this.props.city, address_state:this.props.state, address_country:'US'})
                    .then(({token, error}) => {
                    if(error){
                        this.isProcessing = false;
                        this.setState({stripeError:error.message})
                    }else{
                        if(this.state.stripeError){
                            this.setState({stripeError:null})
                        }
                        this.props.callback(token)
                    }
                });
            }else{
                this.setState({error:'Cardholder name required.'})
            }
        }
    }

    render = () => {
        return <form  className='container section' onSubmit={this.handleSubmit}>
              <div className='payment-container'>
                  <h1 className='center-text no-margin'>Total: {this.props.total}$</h1>
                  <span className='error'>{this.state.stripeError}</span>
                  <div className='container'>
                      {this.state.error?<span className='error'>{this.state.error}</span>:'Cardholder name'}
                      <input className='styled-input' placeholder="John Doe" name='cardholder' onChange={this.handleChange}/>
                </div>
                <div className='container'>
                    <div className='card-number-container edge-margin'>
                        Card number
                      <CardNumberElement className='styled-input' {...createStripeStyle}/>
                    </div>
                    <div className='cvc-container edge-margin'>
                        CVC
                        <CardCVCElement className='styled-input' {...createStripeStyle}/>
                    </div>
                </div>
                <div className='container'>
                    <div className='small-input edge-margin'>
                        Expiry date
                        <CardExpiryElement className='styled-input '  {...createStripeStyle}/>
                    </div>
                    <div className='small-input edge-margin'>
                        ZIP/Postal code
                        <PostalCodeElement className='styled-input' {...createStripeStyle}/>
                    </div>
                </div>
                 <div className='event-register-btn center-text' onClick={this.handleSubmit}>Submit</div>
                 <button className='hacky-submit-button' type='submit'/>
              </div>
          </form>
    }
}

const PaymentInfoEntry= injectStripe(PaymentInformationEntry)

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            UI:'address'
        }
    }

    showPopup = () => this.setState({showPopup: true})

    clearPopupState = () => this.setState({showPopup: false})

    transition = (UI) => this.setState({UI})

    onCardComplete = (token) => {
        this.setState({UI:'loading'})
    }

    onAddressComplete = ({response, city, state, address}) => {
        if(response.data.error){
            this.setState({UI:'error', error:response.data.error})
        }else{
            this.setState({UI:'card', total:response.data.total, city, state, address})
        }
    }

    render = () => {
        let child;
        if(this.state.UI === 'loading'){
            child = <div className='center-y section'><img className='loading-icon center-x' src={loading}/></div>
        }else if(this.state.UI === 'error'){
            child = <div> <span className='error'>{this.state.error}</span></div>
        }else if(this.state.UI === 'complete'){

        }else if(this.state.UI === 'card'){
            child = <StripeProvider apiKey='pk_test_GcXQlSWyjflCxQsqQoNz8kRb'>
                    <Elements>
                        <PaymentInfoEntry callback={this.onCardComplete} city={this.state.city} state={this.state.address} address={this.state.address} total={this.state.total}/>
                    </Elements>
                </StripeProvider>
        }else if(this.state.UI === 'address'){
            child = <AddressForm transition={this.transition} info={this.props.getInfo()} callback={this.onAddressComplete}/>
        }
        return <React.Fragment>
            <Popup className='payment-overview-popup' open={this.state.showPopup} closeOnEscape={!this.state.loading} closeOnDocumentClick={!this.state.loading} onClose={this.clearPopupState}>
                <div className='login-widget'>
                    {child}
                </div>
            </Popup>
            <div className="event-register-btn" onClick={this.showPopup}> Continue to Payment</div>
        </React.Fragment>
    }
}

export default Payment
