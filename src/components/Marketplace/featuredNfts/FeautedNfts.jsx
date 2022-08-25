import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./FeautedNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";

import { readUserProfile } from "../../../utils/firebase";

const FeautedNfts = () => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections } = useContext(GenContext);
  const algoCollectionsArr = algoCollections
    ? Object.values(algoCollections).sort(
        (collection_a, collection_b) => collection_a.createdAt["seconds"] - collection_b.createdAt["seconds"]
      )
    : [];

  const [state, setState] = useState({
    filteredCollection: [],
    nearCollection: null,
    allChains: null,
    init: false,
    filter: {
      chain: "All Chains",
    },
  });

  const { nearCollection, filter, filteredCollection, init } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  function breakAddress(address = "", width = 6) {
    if (!address) return "--";
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }
  const getCollectionByChain = (network = filter.chain) => {
    switch (network.toLowerCase().replace(/ /g, "")) {
      case "allchains":
        return !algoCollectionsArr && !polygonCollections && !celoCollections && !nearCollection && !auroraCollections
          ? null
          : [
              ...(algoCollectionsArr || []),
              ...(polygonCollections || []),
              ...(celoCollections || []),
              ...(auroraCollections || []),
              ...(nearCollection || []),
            ];
      case "algorand":
        return algoCollectionsArr;
      case "polygon":
        return polygonCollections;
      case "celo":
        return celoCollections;
      case "near":
        return nearCollection;
      case "aurora":
        return auroraCollections;
      default:
        break;
    }
    return null;
  };

  async function getUsername(account) {
    const data = await readUserProfile(account);

    return data.username;
  }
  useEffect(() => {
    const collection = getCollectionByChain(filter.chain).sort((a, b) => a.createdAt - b.createdAt);
    if (collection) {
      console.log("collect", collection);
      handleSetState({ filteredCollection: collection });
    } else {
      handleSetState({ filteredCollection: null });
    }
  }, [algoCollections, polygonCollections, celoCollections, auroraCollections]);

  useEffect(() => {
    window.localStorage.activeCollection = null;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.wrapper}>
          <h3>Featured NFTs </h3>
        </div>
        {/* <ChainDropdown onChainFilter={chainChange} /> */}
      </div>

      <GenadropCarouselScreen cardWidth={16 * 20} gap={16} init={init}>
        {filteredCollection?.length ? (
          filteredCollection.map((collection, idx) => (
            <CollectionsCard useWidth="20em" key={idx} collection={collection} />
          ))
        ) : !filteredCollection ? (
          <NotFound />
        ) : (
          [...new Array(4)].map((_, idx) => (
            <div className={classes.skeleton} useWidth="20em" key={idx}>
              <Skeleton count={1} height={250} />
              <br />
              <Skeleton count={1} height={30} />
              <br />
              <Skeleton count={1} height={30} />
            </div>
          ))
        )}
      </GenadropCarouselScreen>

      <div className={`${classes.wrapper}`}>
        <div className={classes.feed}>
          <div className={classes.left}>
            <span className={classes.blueBox}>Feeds</span>
            <img className={classes.newestNft} src={filteredCollection[0]?.image_url} alt="" />
            <span className={classes.address}>
              <span className={classes.blue}>{filteredCollection[0]?.name}</span>
              sold [<span className={classes.blue}>0x694c…7489</span> To{" "}
              <span className={classes.blue}>Onallee.algo</span> ]
            </span>
          </div>
          <div className={classes.time}>3 Minutes ago</div>
        </div>
      </div>

      <div className={classes.wrapper}>
        <div className={classes.heading2}>
          <h3>Popular Creators</h3>
          <div className={classes.blueBtn}>View All</div>
        </div>
        <div className={classes.creators}>
          {[
            ...(filteredCollection || [])
              ?.filter((_, idx) => idx < 8)
              .map((collection, idx) => {
                return (
                  <div className={classes.creator}>
                    <img src={collection.image_url} className={classes.profile} alt="" />
                    <div className={classes.creatorDetails}>
                      <div className={classes.creatorName}>{breakAddress(collection.owner)}</div>
                      <div className={classes.dropedNfts}>{collection.nfts.length} NFT Drops</div>
                    </div>
                  </div>
                );
              }),
          ]}
        </div>
      </div>
    </div>
  );
};

export default FeautedNfts;
