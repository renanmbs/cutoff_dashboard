import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <KindeProvider
    clientId="8ef309ff506b4999b2356de7a95f97f8"
    domain="https://monarchmetal.kinde.com"
    redirectUri="https://monarchcutoffdashboard.netlify.app"
    logoutUri="https://monarchintranet.netlify.app"
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </KindeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
