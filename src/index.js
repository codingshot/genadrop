import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GenContextProvider from './gen-state/gen.context';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GenContextProvider>
        <App />
      </GenContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
