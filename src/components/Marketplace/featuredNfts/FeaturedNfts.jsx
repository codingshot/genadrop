import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./FeaturedNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
// import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";
import SingleNftCard from "../SingleNftCard/SingleNftCard";

const FeautedNfts = () => {
  const { singleAuroraNfts, singleAlgoNfts, singleCeloNfts, singlePolygonNfts, singleNearNfts } =
    useContext(GenContext);
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

  const featturedNFTs = [
    "genadrop-contract.nftgen.near1664333582736",
    "0xc291846a587cf00a7cc4af0bc4eedbc9c3340c36231138",
    "genadrop-contract.nftgen.near1664317298336",
  ];

  useEffect(() => {
    let nfts = [
      ...(algoNFTs || []),
      ...(singleAuroraNfts || []),
      ...(singleNearNfts || []),
      ...(singlePolygonNfts || []),
      ...(singleCeloNfts || []),
    ];

    nfts = nfts.filter((nft) => !featturedNFTs.includes(nft.Id));
    nfts = shuffle(nfts);
    const featuredNFT1 = [...(singleNearNfts || []), ...(singleCeloNfts || [])].filter((nft) =>
      featturedNFTs.includes(nft.Id)
    );
    handleSetState({ NFTs: [...featuredNFT1, ...nfts] });
  }, [singleAlgoNfts, singleAuroraNfts, singleNearNfts, singlePolygonNfts, singleCeloNfts]);
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
