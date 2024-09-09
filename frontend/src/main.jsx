import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Provider}  from 'react-redux';
import store from './store.js';
import  {Provider as AlertProvider ,transitions,positions}  from 'react-alert'
import AlertTemplate from "react-alert-template-basic"

const options ={
  position :positions.BOTTOM_CENTER,
  timeout : 5000,
  transition : transitions.SCALE,
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Provider>
  </StrictMode>,
)
