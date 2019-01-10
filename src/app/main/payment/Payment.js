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

const createStripeStyle= (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class PaymentInformationEntry extends Component{
    constructor(props){
        super(props)
    }

    render = () => {
        return <div>
        <CardNumberElement className='card-number-element' {...createStripeStyle('18px', '10px')}/>
        <CardExpiryElement className="card-expiry-element" />
        <CardCVCElement />
        <PostalCodeElement />
      </div>
    }
}

const PaymentInfoEntry= injectStripe(PaymentInformationEntry)

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        }

    }
    showPopup = () => {
        this.setState({showPopup: true});
    }

    clearPopupState = () => {
        this.setState({showPopup: false});
    }



    render = () => {
        return <React.Fragment>
            <Popup className='payment-overview-popup' open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                <div className='payment-overview-container'>
                    <StripeProvider apiKey='pk_test_GcXQlSWyjflCxQsqQoNz8kRb'>
                        <Elements>
                            <PaymentInfoEntry />
                        </Elements>
                    </StripeProvider>
                </div>
            </Popup>
            <button className="continue-to-payment-btn" onClick={this.showPopup}> Continue to Payment</button>
        </React.Fragment>
    }
}

export default Payment
