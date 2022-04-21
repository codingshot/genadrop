import React, { useContext, useEffect, lazy, useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/footer";
import Navbar from "./components/Navbar/Navbar";
import Overlay from "./components/overlay/overlay";
import { fetchCollections, readAllSingleNft } from "./utils/firebase";
import { GenContext } from "./gen-state/gen.context";
import { setCollections, setSingleNfts } from "./gen-state/gen.actions";
import Notification from "./components/Notification/Notification";
import Clipboard from "./components/clipboard/clipboard";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import Welcome from "./pages/welcome/welcome";
import Prompt from "./components/delete-prompt/prompt";

const Home = lazy(() => import("./pages/home/home"));
const Create = lazy(() => import("./pages/create/create"));
const Mint = lazy(() => import("./pages/mint/mint"));
const Marketplace = lazy(() => import("./pages/Marketplace/Marketplace"));
const Preview = lazy(() => import("./pages/preview/preview"));
const Explore = lazy(() => import("./pages/Explore/Explore"));
const Fallback = lazy(() => import("./pages/fallback/fallback"));
const CollectionNFT = lazy(() => import("./pages/collectionNFT/collectionNFT"));
const Collections = lazy(() => import("./pages/collections/collections"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const docsEmbed = lazy(() => import("./pages/docs/docsEmbed"));
const List = lazy(() => import("./pages/listNFT/list"));
const Profile = lazy(() => import("./pages/profile/profile"));
const SingleNftCollection = lazy(() => import("./pages/singleMintCollection/singleNftCollection"));
const SingleNFT = lazy(() => import("./pages/singleNFT/singleNFT"));
// const Listed = lazy(() => import('./pages/listNFT/listed'));

function App() {
  const { dispatch, mainnet } = useContext(GenContext);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  useEffect(() => {
    (async function getCollections() {
      const collections = await fetchCollections(mainnet);
      dispatch(setCollections(collections));
    })();

    (async function readAllSingle() {
      const singleNfts = await readAllSingleNft(mainnet);
      dispatch(setSingleNfts(singleNfts));
    })();
  }, [mainnet]);

  if (showWelcomeScreen) {
    return <Welcome showWelcomeScreen={setShowWelcomeScreen} />;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="Routes">
        <ErrorBoundary>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/preview" component={Preview} />
            <Route exact path="/mint" component={Mint} />
            <Route exact path="/marketplace" component={Marketplace} />
            <Route exact path="/marketplace/single-mint" component={SingleNftCollection} />
            <Route exact path="/marketplace/single-mint/:nftId" component={SingleNFT} />
            <Route exact path="/marketplace/collections" component={Collections} />
            <Route exact path="/marketplace/collections/:collectionName" component={Explore} />
            <Route exact path="/marketplace/collections/:collectionName/:nftId" component={CollectionNFT} />
            <Route exact path="/me/:userId" component={Dashboard} />
            <Route exact path="/me/:userId/:nftId" component={List} />
            <Route exact path="/me/:userId/profile/settings" component={Profile} />
            <Route exact path="/docs" component={docsEmbed} />
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
    </div>
  );
}

export default App;
