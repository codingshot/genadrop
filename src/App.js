import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import "./fonts.css";
import Preview from "./pages/preview/preview";
import Explore from "./pages/Explore/Explore";
import Collections from "./pages/collections/collections";
import Dashboard from "./pages/dashboard/dashboard";
// import docsEmbed from "./pages/docs/docsEmbed";
import List from "./pages/listNFT/list";
import Profile from "./pages/profile/profile";
import SingleNftCollection from "./pages/singleNftCollection/singleNftCollection";
import Artist from "./pages/artist/artist";
import Listed from "./pages/userDashboard/listNFT/listed";
import Partner from "./pages/Partner/Partner";
import Prompt from "./components/delete-prompt/prompt";
import Minter from "./components/Mint/minter/minter";
import Session from "./pages/Session/Session";
import SessionModal from "./components/Modals/Session-Modal/SessionModal";
import UpgradeModal from "./components/Modals/Upgrade-Modal/UpgradeModal";
import SuccessPlan from "./pages/Pricing/Success-Plan/SuccessPlan";
import FailedPlan from "./pages/Pricing/Failed-Plan/FailedPlan";
import Pitch from "./pages/Pitch/Pitch";
import CollectionToSingleMinter from "./components/Mint/collection-single/collection-single";
import Camera from "./pages/camera/Camera";
import Marketplace from "./pages/Marketplace/Marketplace";
import Footer from "./components/footer/footer";
import Navbar from "./components/Navbar/Navbar";
import Overlay from "./components/overlay/overlay";
import Notification from "./components/Notification/Notification";
import Clipboard from "./components/clipboard/clipboard";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import Welcome from "./pages/welcome/welcome";
import Home from "./pages/home/home";
import CreateCollection from "./pages/createCollection/CreateCollection";
import Pricing from "./pages/Pricing/Pricing";
import Fallback from "./pages/fallback/fallback";
import StoreData from "./renderless/store-data/StoreData";
import FetchData from "./renderless/fetch-data/fetchData.component";
import Links from "./pages/links/links";
import SearchResult from "./pages/searchResult/searchResult";
import Brand from "./pages/brand/Brand";
import "@stripe/stripe-js";
import NFTDetail from "./pages/NFT-Detail/NFTDetail";
import CollectionOptions from "./pages/collection-options/CollectionOptions";
import MarketplaceAll from "./pages/marketplace-all/MarketplaceAll";
import Creating from "./pages/creating/Creating";
import Redirect from "./utils/redirect";
import AI from "./components/Mint/ai/AI";

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
            <Route exact path="/collection" component={CollectionOptions} />
            <Route exact path="/create/collection" component={CreateCollection} />
            <Route exact path="/create" component={Creating} />
            <Route exact path="/preview" component={Preview} />
            <Route exact path="/mint" component={Creating} />
            <Route
              exact
              path={["/mint/camera", "/mint/vibe", "/mint/sesh", "/mint/doubletake", "/mint/video"]}
              component={Camera}
            />
            <Route exact path="/mint/ai" component={AI} />
            <Route exact path="/mint/:mintId" component={CollectionToSingleMinter} />
            <Route exact path="/mint/:mintId/minter" component={Minter} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/marketplace/1of1" component={SingleNftCollection} />
            <Route exact path="/marketplace/collections" component={Collections} />
            <Route exact path="/marketplace/all" component={MarketplaceAll} />
            <Route exact path="/marketplace/1of1/:chainId/:nftId" component={NFTDetail} />

            <Route exact path="/marketplace/1of1/list/:chainId/:nftId" component={List} />
            <Route exact path="/marketplace/1of1/list/:chainId/:nftId/listed" component={Listed} />
            <Route exact path="/marketplace/collections/:collectionName" component={Explore} />
            <Route exact path="/marketplace/collections/:collectionName/:nftId" component={NFTDetail} />
            <Route exact path="/profile/:chainId/:userId" component={Dashboard} />
            {/* <Route exact path="/me/:userId/:nftId" component={List} /> */}
            <Route exact path="/profile/settings" component={Profile} />
            {/* <Route exact path="/docs" component={docsEmbed} /> */}
            <Route exact path="/artist" component={Artist} />
            <Route exact path="/partner" component={Partner} />
            <Route exact path="/pitch" component={Pitch} />
            <Route exact path="/create/session" component={Session} />
            <Route exact path="/create/session/pricing" component={Pricing} />
            <Route exact path="/create/session/create" component={SuccessPlan} />
            <Route exact path="/create/session/pricing/failed" component={FailedPlan} />
            <Route exact path="/links" component={Links} />
            <Route exact path="/search" component={SearchResult} />
            <Route exact path="/brand" component={Brand} />
            <Route
              exact
              path="/aurora"
              component={() => {
                window.location.replace("https://www.genadrop.com/marketplace/all?chain=Aurora");
                return null;
              }}
            />
            <Route
              exact
              path="/near"
              component={() => {
                window.location.replace("https://www.genadrop.com/marketplace/all?chain=Near");
                return null;
              }}
            />
            <Route
              exact
              path="/celo"
              component={() => {
                window.location.replace("https://www.genadrop.com/marketplace/all?chain=Celo");
                return null;
              }}
            />
            <Route
              exact
              path="/algorand"
              component={() => {
                window.location.replace("https://www.genadrop.com/marketplace/all?chain=Algorand");
                return null;
              }}
            />
            <Route
              exact
              path="/polygon"
              component={() => {
                window.location.replace("https://www.genadrop.com/marketplace/all?chain=Polygon");
                return null;
              }}
            />
            <Redirect />

            <Route component={Fallback} />
          </Switch>
        </ErrorBoundary>
      </div>
      <Footer />
      <Overlay />
      <Notification />
      {/* <SwitchWalletNotification /> */}
      <Clipboard />
      <Loader />
      <Prompt />
      <FetchData />
      <SessionModal />
      <UpgradeModal />
      <StoreData />
    </div>
  );
}

export default App;
