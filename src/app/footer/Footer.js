import React, { Component } from 'react'
import './Footer.css'
import FacebookLogo from '../logos/ionicons-logo-facebook.svg'
import TwitterLogo from '../logos/ionicons-logo-twitter.svg'
import EmailIcon from '../logos/ionicons-md-mail.svg'
class Footer extends Component {
  render () {
    return (
      <div className='footer'>
        <div className='footer-content'>
          <a href='https://www.facebook.com/Fun2LearnCode/'><img alt='Fun2LearnCode Facebook' src={FacebookLogo} /></a>
          <a href='https://twitter.com/fun2learncode?lang=en'><img alt='Fun2LearnCode Twitter' src={TwitterLogo} /></a>
          <img alt='Fun2LearnCode Email' src={EmailIcon} />
        </div>
      </div>
    )
  }
}

export default Footer
