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
import CollectionNFT from './pages/collectionNFT/collectionNFT';
import { fetchCollections, readAllSingleNft } from './utils/firebase';
import { GenContext } from './gen-state/gen.context';
import { setCollections, setSingleNfts } from './gen-state/gen.actions';
import Explore from './pages/Explore/Explore';
import Fallback from './pages/fallback/fallback';
import Notification from './components/Notification/Notification';
import Clipboard from './components/clipboard/clipboard';
import Loader from './components/Loader/Loader';
import Collections from './pages/collections/Collections';
import SingleNFT from './pages/singleNFT/singleNFT';
import Profile from './pages/profile/profile';
import Dashboard from './pages/dashboard/dashboard';
import List from './pages/listNFT/list'

function App() {
  const { dispatch } = useContext(GenContext);

  useEffect(() => {
    (async function getCollections() {
      let collections = await fetchCollections();
      dispatch(setCollections(collections))
    }());

    (async function readAllSingle() {
      let singleNfts = await readAllSingleNft();
      dispatch(setSingleNfts(singleNfts))
    }());
  }, []);

  return (
    <div className="App">
      <Navbar />
      <div className="Routes">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/marketplace" component={Marketplace} />
          <Route exact path="/marketplace/collections" component={Collections} />
          <Route exact path="/marketplace/collections/:collectionName" component={Explore} />
          <Route exact path="/marketplace/collections/:collectionName/:nftId" component={CollectionNFT} />
          <Route exact path="/marketplace/:nftId" component={SingleNFT} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/preview" component={Preview} />
          <Route exact path="/mint" component={Mint} />
          <Route exact path="/me/:userId/settings" component={Profile} />
          <Route exact path="/me/:userId/:nftId" component={List} />
          <Route exact path="/me/:userId" component={Dashboard} />
          <Route path="" component={Fallback} />
        </Switch>
      </div>
      <Footer />

      <Overlay />
      <Notification />
      <Clipboard />
      <Loader />
    </div>
  )
}

export default App;