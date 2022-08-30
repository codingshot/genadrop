import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./FeautedNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";

import { readUserProfile } from "../../../utils/firebase";
import { getDate } from "../../wallet/wallet-script";

const FeautedNfts = () => {
  const {
    auroraCollections,
    algoCollections,
    polygonCollections,
    celoCollections,
    singleAlgoNfts,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
  } = useContext(GenContext);
  const singleAlgoNftsArr = Object.values(singleAlgoNfts);

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
    lastSoldNfts: null,
  });

  const { nearCollection, filter, filteredCollection, init, lastSoldNfts } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  function breakAddress(address = "", width = 6) {
    if (!address) return "--";
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  const getSingleNFTs = (network = filter.chain) => {
    return !singleAlgoNftsArr && !singlePolygonNfts && !singleCeloNfts && !singleAuroraNfts
      ? null
      : [
          ...(singleAlgoNftsArr || []),
          ...(singlePolygonNfts || []),
          ...(singleCeloNfts || []),
          ...(singleAuroraNfts || []),
        ];
  };

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
      handleSetState({ filteredCollection: collection });
    } else {
      handleSetState({ filteredCollection: null });
    }

    const sorted = collection.sort((a, b) => b?.createdAt - a?.createdAt);

    handleSetState({ lastSoldNfts: sorted[0] });
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

      <div className={`${classes.wrapper}`}>
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
        <div className={classes.feed}>
          <div className={classes.left}>
            <span className={classes.blueBox}>Feeds</span>
            <img className={classes.newestNft} src={lastSoldNfts?.image_url} alt="" />
            <span className={classes.address}>
              <span className={classes.blue}>{lastSoldNfts?.name}</span>
              minted [<span className={classes.blue}>{breakAddress(lastSoldNfts?.owner)}</span>
              <span className={classes.blue}>{breakAddress(lastSoldNfts?.buyer)}</span> ]
            </span>
          </div>
          <div className={classes.time}>
            {lastSoldNfts?.createdAt?.seconds
              ? getDate(lastSoldNfts?.createdAt?.seconds)
              : getDate(lastSoldNfts?.createdAt)}
          </div>
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
