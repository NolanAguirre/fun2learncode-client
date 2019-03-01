import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import App from './app/App'
import {DelvReact} from './delv/delv-react'

const delvConfig = {
    url: 'http://localhost:3005/graphql',
    handleError: (error) => {
        if(error.response && error.response.data){
            error.response.data.errors.forEach((err)=>{
                if(err.message === 'jwt expired'){
                    localStorage.removeItem('authToken')
                }else{
                    return false;
                }
            })
        }
        return true;
    }
}


ReactDOM.render(<Router>
    <DelvReact config={delvConfig}>
        <div className='app'>
            <App/>
        </div>
    </DelvReact>
</Router>, document.getElementById('root'))
