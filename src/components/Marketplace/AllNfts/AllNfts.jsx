import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import classes from "./AllNfts.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import ChainDropdown from "../Chain-dropdown/chainDropdown";
import {
  getCollectionsByCategory,
  getCollectionsByChain,
  shuffle,
} from "../../../pages/Marketplace/Marketplace-script";
import { setActiveCollection } from "../../../gen-state/gen.actions";
import NotFound from "../../not-found/notFound";

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
  });

  const { activeType, activeChain, activeCategory, collections, singles, newest, filteredCollection } = state;
  const {
    auroraCollections,
    algoCollections,
    polygonCollections,
    celoCollections,
    singleAlgoNfts,
    singleAuroraNfts,
    singlePolygonNfts,
    singleAvaxNfts,
    singleNearNfts,
    singleCeloNfts,
    mainnet,
    dispatch,
  } = useContext(GenContext);

  const singleAlgoNftsArr = Object.values(singleAlgoNfts);
  const algoCollectionsArr = Object.values(algoCollections);
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
    const result = getCollectionsByChain({ collections: type[activeType], chain, mainnet });
    handleSetState({ filteredCollection: result || [], activeChain: chain });
  };

  const handleMore = () => {
    if (activeType === "T2") {
      history.push("/marketplace/1of1");
    } else if (activeType === "T3") {
      history.push("/marketplace/collections");
    }
  };

  useEffect(() => {
    let collections = [
      ...(auroraCollections || []),
      ...(algoCollectionsArr || []),
      ...(polygonCollections || []),
      ...(celoCollections || []),
    ];
    collections = shuffle(collections);
    handleSetState({ collections });
  }, [auroraCollections, algoCollections, polygonCollections, celoCollections]);

  useEffect(() => {
    let singles = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
      ...(singleNearNfts || []),
      ...(singleAvaxNfts || []),
    ];
    singles = shuffle(singles);
    handleSetState({ singles });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts, singleNearNfts]);

  useEffect(() => {
    let newest = [...collections, ...singles];
    newest = shuffle(newest);
    newest = newest.sort((a, b) => {
      if (!a.createdAt || !b.createAt) return a - b; // this code line is because 1of1 nfts do not yet have createAt properties
      if (typeof a.createdAt === "object") {
        return a.createdAt.seconds - b.createdAt.seconds;
      }
      return a.createdAt - b.createdAt;
    });
    handleSetState({ newest });
  }, [singles, collections]);

  useEffect(() => {
    const result = getCollectionsByChain({ collections: type[activeType], chain: activeChain, mainnet });
    handleSetState({ filteredCollection: result || [] });
  }, [singles, collections, newest]);

  useEffect(() => {
    dispatch(setActiveCollection(null));
  }, []);

  const categoryFilter = (category) => {
    handleSetState({ activeCategory: category });
    const result = getCollectionsByCategory({ collections: type[activeType], category });
    handleSetState({ filteredCollection: result || [] });
  };

  const haandleTabActive = (active) => {
    handleSetState({
      activeType: active,
    });
    let result = getCollectionsByChain({ collections: type[active], chain: activeChain, mainnet });
    result = getCollectionsByCategory({ collections: result, category: activeCategory });
    handleSetState({ filteredCollection: result || [] });
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
        {filteredCollection.length ? (
          <section className={classes.nfts}>
            {activeType === "T1" ? (
              filteredCollection
                .slice(0, 16)
                .map((el, idx) =>
                  !el.nfts ? <SingleNftCard key={idx} nft={el} /> : <CollectionNftCard key={idx} collection={el} />
                )
            ) : activeType === "T2" ? (
              filteredCollection.slice(0, 16).map((nft, idx) => <SingleNftCard key={idx} nft={nft} />)
            ) : activeType === "T3" ? (
              filteredCollection
                .slice(0, 16)
                .map((collection, idx) => <CollectionNftCard key={idx} collection={collection} />)
            ) : (
              <NotFound />
            )}
          </section>
        ) : (
          <NotFound />
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
