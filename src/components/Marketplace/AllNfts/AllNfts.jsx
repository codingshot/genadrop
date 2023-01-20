import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment/moment";
import Skeleton from "react-loading-skeleton";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import classes from "./AllNfts.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import ChainDropdown from "../Chain-dropdown/chainDropdown";
import {
  getCollectionsByCategory,
  getCollectionsByChain,
  shuffle,
  sortBy,
} from "../../../pages/Marketplace/Marketplace-script";
import { setActiveCollection } from "../../../gen-state/gen.actions";
import NotFound from "../../not-found/notFound";
import {
  getAllAlgorandCollections,
  getAllAlgorandNfts,
  getAllArbitrumNfts,
  getAllAuroraCollections,
  getAllAuroraNfts,
  getAllAvalancheNfts,
  getAllCeloCollections,
  getAllCeloNfts,
  getAllNearNfts,
  getAllPolygonCollections,
  getAllPolygonNfts,
} from "../../../renderless/fetch-data/fetchUserGraphData";

const AllNfts = () => {
  const history = useHistory();
  const [state, setState] = useState({
    activeType: "T1",
    activeChain: "All Chains",
    activeCategory: "All",
    filteredCollection: [],
    collections: [],
    singles: [],
    newest: [],
    load: true,
  });

  const { activeType, activeChain, activeCategory, collections, singles, newest, filteredCollection, load } = state;
  const { mainnet, dispatch, allChainsNfts } = useContext(GenContext);

  const categories = [
    "All",
    "Vibe",
    "Sesh",
    "Photography",
    "Shorts",
    "Doubletake",
    "Digital Graphic",
    "Painting",
    "Illustration",
    "3D",
    "Video",
    "Audio",
    "Tweet",
    "AI",
  ];
  const type = {
    T1: newest,
    T2: singles,
    T3: collections,
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleChainChange = (chain) => {
    handleSetState({
      load: true,
    });
    const result = getCollectionsByChain({ collections: type[activeType], chain, mainnet });
    handleSetState({ filteredCollection: result || [], activeChain: chain });
    setTimeout(() => {
      handleSetState({ load: false });
    }, 2000);
  };

  const handleMore = () => {
    if (activeType === "T2") {
      history.push("/marketplace/1of1");
    } else if (activeType === "T3") {
      history.push("/marketplace/collections");
    }
  };

  const haandleTabActive = (active) => {
    handleSetState({
      activeType: active,
      load: true,
    });
    let result = getCollectionsByChain({ collections: type[active], chain: activeChain, mainnet });
    result = getCollectionsByCategory({ collections: result, category: activeCategory, activeChain });
    handleSetState({ filteredCollection: result });
    setTimeout(() => {
      handleSetState({ load: false });
    }, 2000);
  };

  useEffect(() => {
    Promise.all([
      getAllAuroraCollections(),
      getAllPolygonCollections(),
      getAllCeloCollections(),
      getAllAlgorandCollections(mainnet, dispatch),
    ]).then((data) => {
      const filteredData = sortBy({ collections: shuffle(data.flat()), value: "newest" });
      handleSetState({ collections: filteredData });
    });
  }, []);

  useEffect(() => {
    Promise.all([
      getAllNearNfts(),
      getAllCeloNfts(),
      getAllAuroraNfts(),
      getAllAvalancheNfts(),
      getAllArbitrumNfts(),
      getAllPolygonNfts(),
      getAllAlgorandNfts(mainnet, dispatch),
    ]).then((data) => {
      handleSetState({ singles: sortBy({ collections: data.flat(), value: "newest" }) });
    });
  }, []);

  useEffect(() => {
    const newestNfts = sortBy({ collections: [...singles], value: "newest" });
    handleSetState({ newest: newestNfts, load: false });
  }, [singles, collections]);

  useEffect(() => {
    const result = getCollectionsByChain({ collections: type[activeType], chain: activeChain, mainnet });
    handleSetState({ filteredCollection: result || [], load: false });
  }, [singles, collections, activeType, newest]);

  useEffect(() => {
    dispatch(setActiveCollection(null));
  }, []);

  const categoryFilter = (category) => {
    handleSetState({ activeCategory: category, load: true });
    const result = getCollectionsByCategory({ collections: type[activeType], category, activeChain });
    handleSetState({ filteredCollection: result || [] });
    setTimeout(() => {
      handleSetState({ load: false });
    }, 1000);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.types}>
          <div
            onClick={() => haandleTabActive("T1")}
            className={`${classes.type}  ${activeType === "T1" && classes.active}`}
          >
            New
          </div>
          <div
            onClick={() => haandleTabActive("T2")}
            className={`${classes.type}  ${activeType === "T2" && classes.active}`}
          >
            1 of 1s
          </div>
          <div
            onClick={() => haandleTabActive("T3")}
            className={`${classes.type}  ${activeType === "T3" && classes.active}`}
          >
            Top Collections
          </div>
        </div>
        <section className={classes.filter}>
          <div className={classes.categories}>
            {categories.map((category, idx) => (
              <div
                onClick={() => categoryFilter(category)}
                key={idx}
                className={`${classes.category} ${activeCategory === category && classes.active}`}
              >
                {category}
              </div>
            ))}
          </div>
          <ChainDropdown onChainFilter={handleChainChange} />
        </section>
        {collections?.length > 0 && !load ? (
          <section className={classes.nfts}>
            {activeType === "T1" ? (
              filteredCollection.length > 0 ? (
                filteredCollection
                  .slice(0, 16)
                  .map((el, idx) =>
                    !el?.nfts ? <SingleNftCard key={idx} nft={el} /> : <CollectionNftCard key={idx} collection={el} />
                  )
              ) : (
                <div className={classes.notFound}>
                  <NotFound />
                </div>
              )
            ) : activeType === "T2" ? (
              filteredCollection.length > 0 ? (
                filteredCollection.slice(0, 16).map((nft, idx) => <SingleNftCard key={idx} nft={nft} />)
              ) : (
                <div className={classes.notFound}>
                  <NotFound />
                </div>
              )
            ) : activeType === "T3" ? (
              filteredCollection
                .slice(0, 16)
                .map((collection, idx) => <CollectionNftCard key={idx} collection={collection} />)
            ) : (
              <div className={classes.notFound}>
                <NotFound />
              </div>
            )}
          </section>
        ) : (
          <div className={classes.skeleton}>
            {[...new Array(4)].map((id, idx) => (
              <div key={idx}>
                <Skeleton count={1} height={200} />
                <Skeleton count={1} height={20} />
                <Skeleton count={1} height={20} />
              </div>
            ))}
          </div>
        )}
        <div className={classes.btnContainer}>
          {activeType !== "T1" ? (
            <div onClick={handleMore} className={classes.btn}>
              See More
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AllNfts;
