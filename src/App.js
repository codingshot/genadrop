import React, { useContext, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';
import Footer from './components/footer/footer';
import Navbar from './components/Navbar/Navbar';
import Marketplace from './pages/Marketplace/Marketplace';
import Create from './pages/create/create';
import Mint from './pages/mint/mint';
import Preview from './pages/preview/preview';
import Overlay from './components/overlay/overlay';
import Home from './pages/home/home';
import SingleMint from './pages/SingleMint/singleMint';
import SingleNFT from './pages/dashboard/singleNFT';
import { fetchCollections } from './utils/firebase';
import { GenContext } from './gen-state/gen.context';
import { setCollections } from './gen-state/gen.actions';
import Collection from './pages/collection/collection';
import Fallback from './pages/fallback/fallback';
import Notification from './components/Notification/Notification';
import Clipboard from './components/clipboard/clipboard';
import Loader from './components/Loader/Loader';

function App() {
  const { dispatch } = useContext(GenContext)

  useEffect(() => {
    (async function getCollections() {
      let collections = await fetchCollections()
      dispatch(setCollections(collections))
    }())
  }, [])

  return (
    <div className="App">
      <Navbar />
      <div className="Routes">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/marketplace" component={Marketplace} />
          <Route exact path="/marketplace/:collectionName" component={Collection} />
          <Route exact path="/marketplace/:collectionName/:nftId" component={SingleNFT} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/preview" component={Preview} />
          <Route exact path="/mint/nft-collection" component={Mint} />
          <Route exact path="/mint/single-nft" component={SingleMint} />
          <Route path="" component={Fallback} />
        </Switch>
      </div>
      <Footer />

      <Overlay />
      <Notification />
      <Clipboard/>
      <Loader/>
    </div>
  )
}

export default App;