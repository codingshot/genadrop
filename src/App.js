import React, { lazy, useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/footer";
import Navbar from "./components/Navbar/Navbar";
import Overlay from "./components/overlay/overlay";
import Notification from "./components/Notification/Notification";
import Clipboard from "./components/Clipboard/Clipboard";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import WelcomeScreen from "./pages/Welcome-Screen/WelcomeScreen";
import Prompt from "./components/delete-prompt/prompt";
import FetchData from "./renderless/fetch-data/fetchData.component";
import Home from "./pages/Home/Home";
import Create from "./pages/Create/Create";
import Mint from "./pages/Mint/Mint";
import CollectionToSingleMinter from "./components/Mint/collection-single/collection-single";
import Marketplace from "./pages/Marketplace/Marketplace";
import NFTPreview from "./pages/NFT-Preview/NFTPreview";
import Explore from "./pages/Explore/Explore";
import Fallback from "./pages/Fallback/Fallback";
import CollectionDetail from "./pages/Collection-Detail/CollectionDetail";
import Collections from "./pages/Collections/Collections";
import UserDashboard from "./pages/User-Dashboard/UserDashboard";
import DocsEmbed from "./pages/Docs-Embed/DocsEmbed";
import ListNFT from "./pages/ListNFT/ListNFT";
import Profile from "./pages/Profile/Profile";
import SingleNFTs from "./pages/Single-NFTs/SingleNFTs";
import SingleNFTDetail from "./pages/Single-NFT-Detail/SingleNFTDetail";
import Artist from "./pages/Artist/Artist";

function App() {
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  /**
   * Ensures that welcome-screen component shows only once a user visits
   * the website for the first time
   */
  if (showWelcomeScreen && window.sessionStorage.showWelcomeScreen === undefined) {
    return <WelcomeScreen showWelcomeScreen={setShowWelcomeScreen} />;
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
            <Route exact path="/preview" component={NFTPreview} />
            <Route exact path="/mint" component={Mint} />
            <Route exact path="/mint/:mintId" component={CollectionToSingleMinter} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/marketplace/single-mint" component={SingleNFTs} />
            {/* <Route exact path="/marketplace/single-mint/:nftId" component={SingleNFT} /> */}
            <Route exact path="/marketplace/single-mint/:chainId/:nftId" component={SingleNFTDetail} />
            <Route exact path="/marketplace/collections" component={Collections} />
            <Route exact path="/marketplace/collections/:collectionName" component={Explore} />
            <Route exact path="/marketplace/collections/:collectionName/:nftId" component={CollectionDetail} />
            <Route exact path="/me/:userId" component={UserDashboard} />
            <Route exact path="/me/:userId/:nftId" component={ListNFT} />
            <Route exact path="/me/:userId/profile/settings" component={Profile} />
            <Route exact path="/docs" component={DocsEmbed} />
            <Route exact path="/artist" component={Artist} />
            <Route component={Fallback} />
          </Switch>
        </ErrorBoundary>
      </div>
      <Footer />
      <Overlay />
      <Notification />
      <Clipboard />
      <Loader />
      <Prompt />
      <FetchData />
    </div>
  );
}

export default App;
