import React, { Component } from 'react'
import Mutation from '../../../delv/Mutation'
import Query from '../../../delv/Query'
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
        this.state = {promoCode:'', address:this.props.address || '', city: this.props.city || '', state:this.props.state || ''};
    }
    handleChange = (event) => {
        const target = event.target
        const value = target.value
        const name = target.name
        this.setState({[name]: value, [name+'Error']:null})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if(!this.state.address){
            this.setState({addressError:'Address is required.'})
        }else if(!this.state.city){
            this.setState({cityError:'City is required.'})
        }else if(!this.state.state){
            this.setState({stateError:'State is required.'})
        }else{
            this.props.setLoading(true);
            axios.post('http://localhost:3005/payment/begin', {promoCode:this.state.promoCode, ...this.props.info}).then((data)=>{
               this.props.callback({response:data, address:this.state.address, city:this.state.city, state:this.state.state});
            }).catch((error)=>{
               console.log(error)
            })
        }
    }
    render = () => {
        return <form  className='container section' onSubmit={this.handleSubmit}>
            <div className='payment-container'>
                <h1 className='center-text no-margin'>Billing information</h1>
                <div className='sign-up-input-container'>
                      <div className='payment-input-container'>
                           {this.state.addressError?<span className='error'>{this.state.addressError}</span>:'Address'}
                        <input className='styled-input' name='address' value={this.state.address} onChange={this.handleChange}/>
                      </div>
                </div>
                <div className='container'>
                    <div className='small-input edge-margin'>
                         {this.state.cityError?<span className='error'>{this.state.cityError}</span>:'City'}
                        <input className='styled-input' name='city' placeholder='Austin' value={this.state.city} onChange={this.handleChange}/>
                    </div>
                    <div className='small-input edge-margin'>
                         {this.state.stateError?<span className='error'>{this.state.stateError}</span>:'State'}
                        <input className='styled-input' name='state' placeholder='Texas' value={this.state.state} onChange={this.handleChange}/>
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
               <div className='styled-button center-text' onClick={this.handleSubmit}>Next</div>
               <button className='hacky-submit-button' type='submit'/>
          </div>
      </form>
    }
}

class PaymentInformationEntry extends Component{
    constructor(props){
        super(props)
        this.state = {cardholder:'', hidden:false};
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
            if(this.state.cardholder || this.props.total < 1){
                this.isProcessing = true
                if(this.props.total < 1){
                    this.props.callback()
                }else{
                    this.props.setLoading(true)
                    this.props.stripe.createToken({
                        name: this.state.cardholder,
                        address_line1:this.props.address,
                        address_city:this.props.city,
                        address_state:this.props.state,
                        address_country:'US'
                    }).then(({token, error}) => {
                        if(error){
                            this.props.setLoading(false)
                            this.isProcessing = false;
                            this.setState({stripeError:error.message})
                        }else{
                            if(this.state.stripeError){
                                this.setState({stripeError:null})
                            }
                            this.props.callback(token.id)
                        }
                    });
                }
            }else{
                this.setState({error:'Cardholder name required.'})
            }
        }
    }

    render = () => {
        if(this.props.total < 22){
            return <form  className='container section' onSubmit={this.handleSubmit}>
                  <div className='payment-container'>
                     <h1 className='center-text no-margin'>Total: 0$</h1>
                     <div className='styled-button center-text' onClick={this.handleSubmit}>Submit</div>
                     <button className='hacky-submit-button' type='submit'/>
                  </div>
              </form>
        }
        return <form  className='container section' onSubmit={this.handleSubmit}>
              <div className='payment-container'>
                  <h1 className='center-text no-margin'>Total: {this.props.total}$</h1>
                  <div className='error'>{this.state.stripeError}</div>
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
                 <div className='styled-button center-text' onClick={this.handleSubmit}>Submit</div>
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
            loading:false,
            UI:'address'
        }
    }

    showPopup = () => this.setState({showPopup: true})

    clearPopupState = () => this.setState({showPopup: false})

    setLoading = (loading) => {
        this.setState({loading:loading})
    }

    onCardComplete = (token) => {
        axios.post('http://localhost:3005/payment/process', {token, user:this.props.info.user}).then((res)=>{ //TODO URL
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

    onAddressComplete = ({response, city, state, address}) => {
        if(response.data.error){
            this.setState({UI:'error', error:response.data.error, city, state, address, loading:false})
        }else{
            this.setState({UI:'card', total:response.data.total, city, state, address, loading:false})
        }
    }

    render = () => {
        let child;
        if(this.state.UI === 'error'){
            child = <div className='section container column'>
                    <div className='section center-y'>
                        <div className='error center-text'>{this.state.error}</div>
                </div>
                <div className='styled-button center-text' onClick={()=>{this.setState({UI:'address', loading:false})}}>Back</div>
            </div>
        }else if(this.state.UI === 'complete'){
            child = <div className='payment-container'>
                <h2 className='center-text'>Transaction Complete!</h2>
                <a href='/'><div className="styled-button center-x center-text" style={{width:'200px'}}>Home</div></a>
            </div>
        }else if(this.state.UI === 'card'){
            child = <StripeProvider apiKey='pk_test_GcXQlSWyjflCxQsqQoNz8kRb'>
                    <Elements>
                        <PaymentInfoEntry callback={this.onCardComplete} setLoading={this.setLoading} city={this.state.city} state={this.state.state} address={this.state.address} total={this.state.total}/>
                    </Elements>
                </StripeProvider>
        }else if(this.state.UI === 'address'){
            child = <AddressForm setLoading={this.setLoading} info={this.props.info} city={this.state.city} state={this.state.state} address={this.state.address} total={this.state.total} callback={this.onAddressComplete}/>
        }
        return <React.Fragment>
            <Popup className='payment-popup' open={this.state.showPopup} closeOnDocumentClick={false} closeOnEscape={!(this.state.loading || this.state.preventClose)} onClose={this.clearPopupState}>
                <div className='login-container' style={{position:'relative'}}>
                    {child}
                    <div className={this.state.loading?'payment-loading':'hidden-payment-loading'}><img className='loading-icon center-x' src={loading}/></div>
                </div>
            </Popup>
            <div className="styled-button" onClick={this.showPopup}> Continue to Payment</div>
        </React.Fragment>
    }
}

export default Payment
