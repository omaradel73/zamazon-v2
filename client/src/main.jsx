import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="367305409057-scckm3ombvie02emu4u69p095dhuf344.apps.googleusercontent.com">
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
