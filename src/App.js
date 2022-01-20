import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';
import Footer from './components/Footer-New/Footer';
import Navbar from './components/Navbar/Navbar';
import Marketplace from './pages/Marketplace/Marketplace';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="Routes">
        <Switch>
          {/* <Redirect exact from="/" to="/home" /> */}
          <Route exact path="/marketplace" component={Marketplace} />
        </Switch>
      </div>
      <Footer/>
    </div>
  )
}

export default App;