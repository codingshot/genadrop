import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
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
