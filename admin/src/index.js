import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotistackProvider from '../src/components/MuiToast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotistackProvider>
    <App />
    </NotistackProvider>
  </React.StrictMode>
);
