import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./FeaturedNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
// import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import SingleNftCard from "../SingleNftCard/SingleNftCard";
import {
  getAllAlgorandNfts,
  getAllArbitrumNfts,
  getAllAuroraNfts,
  getAllAvalancheNfts,
  getAllCeloNfts,
  getAllNearNfts,
  getAllPolygonNfts,
  getAvalancheNft,
  getFeaturedAvalancheNft,
  getFeaturedPolygonNfts,
} from "../../../renderless/fetch-data/fetchUserGraphData";

const FeautedNfts = () => {
  const { mainnet, dispatch } = useContext(GenContext);

  const [state, setState] = useState({
    NFTs: [],
    init: false,
    ready: false,
  });

  const { NFTs, init, ready } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const featuredNFTs = [
    "genadrop-contract.nftgen.near1664562603103",
    "0x5ce2deee9b495b5db2996c81c16005559393efb810815",
    "0x436aeceaeec57b38a17ebe71154832fb0faff87823108",
    "0x5ce2deee9b495b5db2996c81c16005559393efb8238140",
    "0x5ce2deee9b495b5db2996c81c16005559393efb845339",
    "0x5ce2deee9b495b5db2996c81c16005559393efb812068",
    "0x436aeceaeec57b38a17ebe71154832fb0faff878160136",
  ];

  useEffect(() => {
    Promise.all([
      getFeaturedAvalancheNft(featuredNFTs[1]),
      getFeaturedAvalancheNft(featuredNFTs[3]),
      getFeaturedAvalancheNft(featuredNFTs[4]),
      getFeaturedAvalancheNft(featuredNFTs[5]),
      getFeaturedPolygonNfts(featuredNFTs[6]),
    ]).then((data) => {
      if (!mainnet) handleSetState({ NFTs: [...data.flat()] });
    });
  }, []);

  useEffect(() => {
    if (NFTs.length > 0) handleSetState({ ready: true });
  }, [NFTs]);
  return (
    <div className={classes.container}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>Featured NFTs </div>
      </div>

      <div className={`${classes.wrapper}`}>
        {ready ? (
          <GenadropCarouselScreen cardWidth={16 * 20} gap={32} init={init}>
            {NFTs.length > 0 ? (
              NFTs.map((collection) => <SingleNftCard use_width="20em" key={collection.Id} nft={collection} />)
            ) : !NFTs ? (
              <NotFound />
            ) : (
              ""
            )}
          </GenadropCarouselScreen>
        ) : (
          <div className={classes.skeletonWrapper}>
            {[...new Array(4)]
              .map((_, idx) => idx)
              .map((id) => (
                <div className={classes.skeleton} key={id}>
                  <Skeleton count={1} height={250} />
                  <Skeleton count={1} height={20} />
                  <Skeleton count={1} height={20} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeautedNfts;
