import React, { Component } from 'react'
import Mutation from '../../../../delv/Mutation'
import Query from '../../../../delv/Query'
import {ReactQuery} from '../../../../delv/delv-react'
import {SecureRoute} from '../../common/Common'
import Popup from "reactjs-popup"
import {CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  StripeProvider,
  Elements,
  injectStripe} from 'react-stripe-elements'
import axios from 'axios'
import loading from '../../../logos/loading.svg'
import xicon from '../../../logos/x-icon.svg'

const USER_DATA = `{
    getUserData{
        id
        firstName
        lastName
        role
    }
}`

//TODO add option to use stored credit cards.
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
        this.state =  {address:this.props.address || '', city: this.props.city || '', state:this.props.state || '', cardholder: this.props.cardholder || ''};
        this.isProcessing = false;
    }
    handleChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({[name]: value, [name+'Error']:null})
    }

    handleSubmit = (event) => {
        if(!this.state.address){
            this.setState({addressError:'Address is required.'})
        }else if(!this.state.city){
            this.setState({cityError:'City is required.'})
        }else if(!this.state.state){
            this.setState({stateError:'State is required.'})
        }else if(!this.state.cardholder){
            this.setState({cardholderError:'Cardholder name required.'})
        }else if(!this.isProcessing){
            this.isProcessing = true
            this.props.setLoading(true)
            this.props.stripe.createToken({
                name: this.state.cardholder,
                address_line1:this.state.address,
                address_city:this.state.city,
                address_state:this.state.state,
                address_country:'US'
            }).then(({token, error}) => {
                console.log(JSON.stringify(token))
                if(error){
                    this.props.setLoading(false)
                    this.isProcessing = false;
                    this.setState({stripeError:error.message})
                }else{
                    if(this.state.stripeError){
                        this.setState({stripeError:null})
                    }
                    this.props.addCard(token)
                }
            });
        }
    }

    render = () => {
        return <form  className='payment-container'onSubmit={this.handleSubmit}>
                  <div className='error'>{this.state.stripeError}</div>
                  <div className='container'>
                      {this.state.cardholderError?<span className='error'>{this.state.cardholderError}</span>:'Cardholder name'}
                      <input className='styled-input' placeholder="John Doe" name='cardholder' onChange={this.handleChange}/>
                </div>
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
                <div>
                    <div className='styled-button center-text' onClick={this.handleSubmit}>Save</div>
                    <button className='hacky-submit-button' type='submit'/>
                </div>
          </form>
    }
}

const PaymentInfoEntry = injectStripe(PaymentInformationEntry)

class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            loading:false,
            UI:'card'
        }
    }

    showPopup = () => this.setState({showPopup: true})

    clearPopupState = () => this.setState({showPopup: false})

    setLoading = (loading) => {
        this.setState({loading:loading})
    }

    addCard = (token) => {
        const id = token.id
        const card = {
            last4: token.card.last4,
            exp_month: token.card.exp_month,
            exp_year:token.card.exp_year,
            brand:token.card.brand
        }
        console.log(card)
        this.props.addCard({id, card}).then((res)=>{
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
                <h2 className='center-text'>Card has been added</h2>
                <div className="styled-button center-x center-text" style={{width:'200px'}} onClick={()=>{this.setState({UI:'card', loading:false, showPopup:false})}}>Close</div>
            </div>
        } else {
            child = <StripeProvider apiKey='pk_test_GcXQlSWyjflCxQsqQoNz8kRb'>
                    <Elements>
                        <PaymentInfoEntry addCard={this.addCard} setLoading={this.setLoading}/>
                    </Elements>
                </StripeProvider>
        }
        return <React.Fragment>
            <Popup className='popup' open={this.state.showPopup} closeOnDocumentClick={false} closeOnEscape={!(this.state.loading || this.state.preventClose)} onClose={this.clearPopupState}>
                <div className='popup-inner'>
                    <div className='close-popup'>
                        {(this.state.UI !== 'loading')?<img onClick={this.clearPopupState} src={xicon}/>:''}
                    </div>
                    <div className='login-container' style={{position:'relative'}}>
                        {child}
                    <div className={this.state.loading?'payment-loading':'hidden-payment-loading'}><img className='loading-icon center-x' src={loading}/></div>
                    </div>
                </div>
            </Popup>
            <div className="styled-button" onClick={this.showPopup}>Add card</div>
        </React.Fragment>
    }
}

export default AddCard
