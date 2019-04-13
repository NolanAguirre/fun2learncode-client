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
import loading from '../../logos/loading.svg'
import xicon from '../../logos/x-icon.svg'
import CreditCardForm from '../creditCardForm/CreditCardForm'

const PROCESS = `mutation ($card: CreditCardInput, $token: String) {
  processTransaction(input: $card, token: $token)
}`
const UPDATE_CACHE = (id) => `{
  allPayments(condition: {id: "${id}"}) {
    nodes {
      id
      snapshot
      status
      createOn
      userId
      eventRegistrationsByPayment{
        nodes{
          id
          student
          registeredBy
          userByRegisteredBy{
            id
          }
          payment
          registeredOn
          eventByEvent{
            id
            seatsLeft
          }
        }
      }
      refundRequestsByPayment {
        nodes {
          id
          reason
          amountRefunded
          grantedReason
          status
          createdOn
        }
      }
    }
  }
}`

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            UI:'choose'
        }
        this.mutation = new Mutation({
            mutation:PROCESS,
            onSubmit:this.handleSubmit,
            onResolve:this.handleResolve
        })
    }

    setLoading = (loading) => {
        this.setState({loading:loading})
    }

    onCardComplete = (token) => {
        console.log(token)
        this.activeCard = token.id
        this.mutation.onSubmit()
    }

    handleSubmit = () => {
        if(this.activeCard){
            if(this.activeCard instanceof Object){
                const{
                    id,
                    ...card
                } = this.activeCard
                this.setState({loading:true, preventClose:true})
                return {card:card}
            }else{
                return {token:this.activeCard}
            }
        }
        return false;
    }
    handleResolve = (data, error) => {
        if(data){
            this.setState({loading:false, UI:'complete'})
            return UPDATE_CACHE(data.processTransaction)
        }else{
            console.log(error)
        }
    }

    setActiveCard = (card) => this.activeCard = card


    render = () => {
        let child;
        if(this.state.UI === 'error'){
            child = <div className='section container column'>
                    <div className='section center-y'>
                        <div className='error center-text'>{this.state.error}</div>
                    </div>
                <div className='styled-button center-text' onClick={()=>{this.setState({UI:'choose', loading:false})}}>Back</div>
            </div>
        }else if(this.state.UI === 'choose'){
            child = <React.Fragment>
                <h2 className='center-text'>Select payment method</h2>
                <span>Total : ${this.props.total}</span>
                <CreditCardForm user={this.props.user} setActiveCard={this.setActiveCard} dropdown/>
                <span className='without-save' onClick={()=>{this.setState({UI:'card'})}}>Continue without saving payment method.</span>
                <div className='styled-button center-text' onClick={this.mutation.onSubmit}>Submit</div>
            </React.Fragment>
        }else if(this.state.UI === 'complete'){
            child = <React.Fragment>
                <h2 className='center-text'>Transaction Complete!</h2>
                <a href='/'><div className="styled-button center-x center-text" style={{width:'200px'}}>Home</div></a>
            </React.Fragment>
        }else if(this.state.UI === 'card'){
            child = <AddCard resolve={this.onCardComplete} />
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
