import React, { useContext, useEffect, lazy, useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import { createClient } from "urql";
import Footer from "./components/footer/footer";
import Navbar from "./components/Navbar/Navbar";
import Overlay from "./components/overlay/overlay";
import { fetchCollections, readAllSingleNft } from "./utils/firebase";
import { GenContext } from "./gen-state/gen.context";
import {
  setCollections,
  setSingleNfts,
  setAlgoCollections,
  setAlgoSingleNfts,
  setAuroraCollections,
  setAuroraSingleNfts,
  setGraphCollection,
} from "./gen-state/gen.actions";
import Notification from "./components/Notification/Notification";
import Clipboard from "./components/clipboard/clipboard";
import Loader from "./components/Loader/Loader";
import ErrorBoundary from "./components/error-boundary/error-boundary";
import Welcome from "./pages/welcome/welcome";
import Prompt from "./components/delete-prompt/prompt";
import { getAuroraCollections, getNftCollections } from "./utils";
import { GET_ALL_AURORA_COLLECTIONS } from "./graphql/querries/getCollections";

const Home = lazy(() => import("./pages/home/home"));
const Create = lazy(() => import("./pages/create/create"));
const Mint = lazy(() => import("./pages/mint/mint"));
const CollectionToSingleMinter = lazy(() => import("./components/Mint/collection-single/collection-single"));
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
const Artist = lazy(() => import("./pages/artist/artist"));

// const Listed = lazy(() => import('./pages/listNFT/listed'));

function App() {
  const { dispatch, mainnet } = useContext(GenContext);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  const APIURL = "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet";

  const client = createClient({
    url: APIURL,
  });

  useEffect(() => {
    (async function getCollections() {
      const collections = await fetchCollections(mainnet);
      dispatch(setCollections(collections));
      console.log(collections);
      // Get ALGO Collection
      if (collections?.length) {
        const result = await getNftCollections(collections, mainnet);
        console.log(result);
        dispatch(setAlgoCollections(result));
      } else {
        console.log(collections);
        dispatch(setAlgoCollections(null));
      }
      // Get Aurora Collection
      const data = await client.query(GET_ALL_AURORA_COLLECTIONS).toPromise();
      const result = await getAuroraCollections(data.data?.collections);
      dispatch(setGraphCollection(result));
      if (result?.length) {
        dispatch(setAuroraCollections(result));
      } else {
        dispatch(setAuroraCollections(null));
      }
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
            <Route exact path="/mint/:mintId" component={CollectionToSingleMinter} />
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
    </div>
  );
}

export default App;
