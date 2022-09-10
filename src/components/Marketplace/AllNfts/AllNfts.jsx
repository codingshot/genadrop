import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import classes from "./AllNfts.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import ChainDropdown from "../Chain-dropdown/chainDropdown";
import { getCollectionsByChain, shuffle } from "../../../pages/Marketplace/Marketplace-script";
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
    singleCeloNfts,
    mainnet,
    dispatch,
  } = useContext(GenContext);

  const singleAlgoNftsArr = Object.values(singleAlgoNfts);
  const algoCollectionsArr = Object.values(algoCollections);
  const categories = ["All", "Painting", "Shorts", "Photography", "Illustration", "3D"];
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
    handleSetState({ filteredCollection: result, activeChain: chain });
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
    handleSetState({ collections: collections.slice(0, 16) });
  }, [auroraCollections, algoCollections, polygonCollections, celoCollections]);

  useEffect(() => {
    let singles = [
      ...(singleAlgoNftsArr || []),
      ...(singleAuroraNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
    ];
    singles = shuffle(singles);
    handleSetState({ singles: singles.slice(0, 16) });
  }, [singleAlgoNfts, singleAuroraNfts, singleCeloNfts, singlePolygonNfts]);

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
    handleSetState({ newest: newest.slice(0, 16) });
  }, [singles, collections]);

  useEffect(() => {
    const result = getCollectionsByChain({ collections: type[activeType], chain: activeChain, mainnet });
    handleSetState({ filteredCollection: result });
  }, [activeType, singles, collections, newest]);

  useEffect(() => {
    dispatch(setActiveCollection(null));
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.types}>
          <div
            onClick={() => handleSetState({ activeType: "T1" })}
            className={`${classes.type}  ${activeType === "T1" && classes.active}`}
          >
            New
          </div>
          <div
            onClick={() => handleSetState({ activeType: "T2" })}
            className={`${classes.type}  ${activeType === "T2" && classes.active}`}
          >
            1 of 1s
          </div>
          <div
            onClick={() => handleSetState({ activeType: "T3" })}
            className={`${classes.type}  ${activeType === "T3" && classes.active}`}
          >
            Top Collections
          </div>
        </div>
        <section className={classes.filter}>
          <div className={classes.categories}>
            {categories.map((category, idx) => (
              <div
                onClick={() => handleSetState({ activeCategory: category })}
                key={idx}
                className={`${classes.category} ${
                  activeCategory !== category ? null : activeCategory === "All" ? classes.active : classes.disable
                }`}
              >
                {category}
              </div>
            ))}
          </div>
          <ChainDropdown onChainFilter={handleChainChange} />
        </section>
        <section className={classes.nfts}>
          {activeType === "T1" ? (
            filteredCollection.map((el, idx) =>
              !el.nfts ? <SingleNftCard key={idx} nft={el} /> : <CollectionNftCard key={idx} collection={el} />
            )
          ) : activeType === "T2" ? (
            filteredCollection.map((nft, idx) => <SingleNftCard key={idx} nft={nft} />)
          ) : activeType === "T3" ? (
            filteredCollection.map((collection, idx) => <CollectionNftCard key={idx} collection={collection} />)
          ) : (
            <NotFound />
          )}
        </section>
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
