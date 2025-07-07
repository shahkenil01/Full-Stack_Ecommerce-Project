import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotistackProvider from '../src/Components/MuiToast';
import { SearchProvider } from './context/SearchContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotistackProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </NotistackProvider>
  </React.StrictMode>
);

