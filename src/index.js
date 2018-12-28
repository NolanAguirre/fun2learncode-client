import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './app/App'
import Delv from './delv/delv'
import {DelvReact} from './delv/delv-react'

Delv.setURL('http://localhost:3005/graphql')

ReactDOM.render(<Router>
  <DelvReact>
    <div className='app'><App />
    </div>
    </DelvReact>
</Router>, document.getElementById('root'))
