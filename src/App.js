import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/footer";
import Navbar from "./components/Navbar/Navbar";
import Overlay from "./components/overlay/overlay";
import Notification from "./components/Notification/Notification";
import Clipboard from "./components/clipboard/clipboard";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import Welcome from "./pages/welcome/welcome";
import Prompt from "./components/delete-prompt/prompt";
import FetchData from "./renderless/fetch-data/fetchData.component";
import Home from "./pages/home/home";
import Create from "./pages/create/create";
import Mint from "./pages/mint/mint";
import CollectionToSingleMinter from "./components/Mint/collection-single/collection-single";
import Camera from "./pages/camera/Camera";
import Marketplace from "./pages/Marketplace/Marketplace";
import Preview from "./pages/preview/preview";
import Explore from "./pages/Explore/Explore";
import Fallback from "./pages/fallback/fallback";
import CollectionNFT from "./pages/collectionNFT/collectionNFT";
import Collections from "./pages/collections/collections";
import Dashboard from "./pages/dashboard/dashboard";
import docsEmbed from "./pages/docs/docsEmbed";
import List from "./pages/listNFT/list";
import Profile from "./pages/profile/profile";
import SingleNftCollection from "./pages/singleNftCollection/singleNftCollection";
import SingleNFT from "./pages/singleNFT/singleNFT";
import Artist from "./pages/artist/artist";
import ListSingleNFT from "./pages/userDashboard/singleNFT/singleNFT";
import Listed from "./pages/userDashboard/listNFT/listed";
import Partner from "./pages/Partner/Partner";
import SwitchWalletNotification from "./components/Switch-Wallet-Notification/SwitchWalletNotification";
import StoreData from "./renderless/store-data/StoreData";
import SessionModal from "./components/Session-Modal/SessionModal";
import Pricing from "./pages/Pricing/Pricing";
import Success from "./pages/Pricing/Success";
import Cancel from "./pages/Pricing/Cancel";
import "@stripe/stripe-js";

function App() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  if (showWelcomeScreen && window.sessionStorage.showWelcomeScreen === undefined) {
    return <Welcome showWelcomeScreen={setShowWelcomeScreen} />;
  }

  return (
    <div className="App">
      <div className="topSectionContainer">
        <Navbar />
      </div>
      <div className="Routes">
        <ErrorBoundary>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/preview" component={Preview} />
            <Route exact path="/mint" component={Mint} />
            <Route exact path="/mint/camera" component={Camera} />
            <Route exact path="/mint/:mintId" component={CollectionToSingleMinter} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/marketplace/single-mint" component={SingleNftCollection} />
            {/* <Route exact path="/marketplace/single-mint/:nftId" component={SingleNFT} /> */}
            <Route exact path="/marketplace/single-mint/:chainId/:nftId" component={SingleNFT} />
            <Route exact path="/marketplace/single-mint/preview/:chainId/:nftId" component={ListSingleNFT} />
            <Route exact path="/marketplace/single-mint/list/:chainId/:nftId" component={List} />
            <Route exact path="/marketplace/single-mint/list/:chainId/:nftId/listed" component={Listed} />
            <Route exact path="/marketplace/collections" component={Collections} />
            <Route exact path="/marketplace/collections/:collectionName" component={Explore} />
            <Route exact path="/marketplace/collections/:collectionName/:nftId" component={CollectionNFT} />
            <Route exact path="/me/:userId" component={Dashboard} />
            {/* <Route exact path="/me/:userId/:nftId" component={List} /> */}
            <Route exact path="/me/:userId/profile/settings" component={Profile} />
            <Route exact path="/docs" component={docsEmbed} />
            <Route exact path="/artist" component={Artist} />
            <Route exact path="/partner" component={Partner} />
            <Route exact path="/create/pricing" component={Pricing} />
            <Route exact path="/success" component={Success} />
            <Route exact path="/cancel" component={Cancel} />
            <Route component={Fallback} />
          </Switch>
        </ErrorBoundary>
      </div>
      <Footer />
      <Overlay />
      <Notification />
      <SwitchWalletNotification />
      <Clipboard />
      <Loader />
      <Prompt />
      <FetchData />
      <SessionModal />
      <StoreData />
    </div>
  );
}

export default App;
