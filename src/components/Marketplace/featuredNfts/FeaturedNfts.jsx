import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./FeaturedNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
// import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import SingleNftCard from "../SingleNftCard/SingleNftCard";

const FeautedNfts = () => {
  const {
    singleAuroraNfts,
    singleAlgoNfts,
    singleCeloNfts,
    singlePolygonNfts,
    singleNearNfts,
    singleAvaxNfts,
    mainnet,
  } = useContext(GenContext);
  const algoNFTs = Object.values(singleAlgoNfts);

  const [state, setState] = useState({
    NFTs: [],
    init: false,
  });

  const { NFTs, init } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  function shuffle(array) {
    for (let i = 0; i < 100; i += 1) {
      for (let x = array.length - 1; x > 0; x -= 1) {
        const j = Math.floor(Math.random() * (x + 1));
        [array[x], array[j]] = [array[j], array[x]];
      }
    }
    return array;
  }

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
    const nfts = [
      ...(algoNFTs || []),
      ...(singleAuroraNfts || []),
      ...(singleNearNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
      ...(singleAvaxNfts || []),
    ];

    // nfts = nfts.filter((nft) => !featuredNFTs.includes(nft.Id));

    // nfts = shuffle(nfts);
    const featuredNFT1 = [...(singleNearNfts || []), ...(singleCeloNfts || [])].filter((nft) =>
      featuredNFTs.includes(nft.Id)
    );

    if (mainnet) handleSetState({ NFTs: [...nfts.filter((e) => featuredNFTs.includes(e.Id))] });
    else handleSetState({ NFTs: [...featuredNFT1, ...nfts] });
  }, [singleAlgoNfts, singleAuroraNfts, singleNearNfts, singlePolygonNfts, singleCeloNfts, singleAvaxNfts]);
  return (
    <div className={classes.container}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>Featured NFTs </div>
      </div>

      <div className={`${classes.wrapper}`}>
        <GenadropCarouselScreen cardWidth={16 * 20} gap={32} init={init}>
          {NFTs.length ? (
            NFTs.map((collection) => <SingleNftCard use_width="20em" key={collection.Id} nft={collection} />)
          ) : !NFTs ? (
            <NotFound />
          ) : (
            [...new Array(4)]
              .map((_, idx) => idx)
              .map((id) => (
                <div className={classes.skeleton} use_width="20em" key={id}>
                  <Skeleton count={1} height={250} />
                  <br />
                  <Skeleton count={1} height={30} />
                  <br />
                  <Skeleton count={1} height={30} />
                </div>
              ))
          )}
        </GenadropCarouselScreen>
      </div>
    </div>
  );
};

export default FeautedNfts;
