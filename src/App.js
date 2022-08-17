import React, { lazy, useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";

const Preview = lazy(() => import("./pages/preview/preview"));
const Explore = lazy(() => import("./pages/Explore/Explore"));
const CollectionNFT = lazy(() => import("./pages/collectionNFT/collectionNFT"));
const Collections = lazy(() => import("./pages/collections/collections"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const docsEmbed = lazy(() => import("./pages/docs/docsEmbed"));
const List = lazy(() => import("./pages/listNFT/list"));
const Profile = lazy(() => import("./pages/profile/profile"));
const SingleNftCollection = lazy(() => import("./pages/singleNftCollection/singleNftCollection"));
const SingleNFT = lazy(() => import("./pages/singleNFT/singleNFT"));
const Artist = lazy(() => import("./pages/artist/artist"));
const ListSingleNFT = lazy(() => import("./pages/userDashboard/singleNFT/singleNFT"));
const Listed = lazy(() => import("./pages/userDashboard/listNFT/listed"));
const Partner = lazy(() => import("./pages/Partner/Partner"));
const Prompt = lazy(() => import("./components/delete-prompt/prompt"));
const Minter = lazy(() => import("./components/Mint/minter/minter"));
const Session = lazy(() => import("./pages/Session/Session"));
const SessionModal = lazy(() => import("./components/Modals/Session-Modal/SessionModal"));
const UpgradeModal = lazy(() => import("./components/Modals/Upgrade-Modal/UpgradeModal"));
const SuccessPlan = lazy(() => import("./pages/Pricing/Success-Plan/SuccessPlan"));
const FailedPlan = lazy(() => import("./pages/Pricing/Failed-Plan/FailedPlan"));
const Pitch = lazy(() => import("./pages/Pitch/Pitch"));
const CollectionToSingleMinter = lazy(() => import("./components/Mint/collection-single/collection-single"));
const Camera = lazy(() => import("./pages/camera/Camera"));
const Marketplace = lazy(() => import("./pages/Marketplace/Marketplace"));
import Footer from "./components/footer/footer";
import Navbar from "./components/Navbar/Navbar";
import Overlay from "./components/overlay/overlay";
import Notification from "./components/Notification/Notification";
import Clipboard from "./components/clipboard/clipboard";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import Welcome from "./pages/welcome/welcome";
import Home from "./pages/home/home";
import Create from "./pages/create/create";
import Mint from "./pages/mint/mint";
import SwitchWalletNotification from "./components/Switch-Wallet-Notification/SwitchWalletNotification";
import Pricing from "./pages/Pricing/Pricing";
import Fallback from "./pages/fallback/fallback";
import StoreData from "./renderless/store-data/StoreData";
import FetchData from "./renderless/fetch-data/fetchData.component";
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
            <Route exact path="/mint/:mintId/minter" component={Minter} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/marketplace/1of1" component={SingleNftCollection} />
            {/* <Route exact path="/marketplace/1of1/:nftId" component={SingleNFT} /> */}
            <Route exact path="/marketplace/1of1/:chainId/:nftId" component={SingleNFT} />
            <Route exact path="/marketplace/1of1/preview/:chainId/:nftId" component={ListSingleNFT} />
            <Route exact path="/marketplace/1of1/list/:chainId/:nftId" component={List} />
            <Route exact path="/marketplace/1of1/list/:chainId/:nftId/listed" component={Listed} />
            <Route exact path="/marketplace/collections" component={Collections} />
            <Route exact path="/marketplace/collections/:collectionName" component={Explore} />
            <Route exact path="/marketplace/collections/:collectionName/:nftId" component={CollectionNFT} />
            <Route exact path="/me/:userId" component={Dashboard} />
            {/* <Route exact path="/me/:userId/:nftId" component={List} /> */}
            <Route exact path="/me/:userId/profile/settings" component={Profile} />
            <Route exact path="/docs" component={docsEmbed} />
            <Route exact path="/artist" component={Artist} />
            <Route exact path="/partner" component={Partner} />
            <Route exact path="/pitch" component={Pitch} />
            <Route exact path="/create/session" component={Session} />
            <Route exact path="/create/session/pricing" component={Pricing} />
            <Route exact path="/create/session/create" component={SuccessPlan} />
            <Route exact path="/create/session/pricing/failed" component={FailedPlan} />
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
      <UpgradeModal />
      <StoreData />
    </div>
  );
}

export default App;
