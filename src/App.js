import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';
import Footer from './components/Footer-New/Footer';
import Navbar from './components/Navbar/Navbar';
import Marketplace from './pages/Marketplace/Marketplace';
import Create from './pages/create/create';
import Mint from './pages/mint/mint';
import Preview from './pages/preview/preview';
import Overlay from './components/overlay/overlay';
import Home from './pages/home/home';

function App() {
  return (
    <div className="App">
      <Overlay />
      <Navbar />
      <div className="Routes">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/marketplace" component={Marketplace} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/preview" component={Preview} />
          <Route exact path="/mint" component={Mint} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default App;