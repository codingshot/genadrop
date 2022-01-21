import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';
import Footer from './components/Footer-New/Footer';
import Navbar from './components/Navbar/Navbar';
import Marketplace from './pages/Marketplace/Marketplace';
import Create from './pages/create/create';
import NewPreview from './pages/preview/Preview2';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="Routes">
        <Switch>
          {/* <Redirect exact from="/" to="/home" /> */}
          <Route exact path="/marketplace" component={Marketplace} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/preview" component={NewPreview} />
        </Switch>
      </div>
      <Footer/>
    </div>
  )
}

export default App;