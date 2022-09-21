import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./FeaturedNfts.module.css";
import "react-loading-skeleton/dist/skeleton.css";
// import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import CollectionNftCard from "../CollectionNftCard/CollectionNftCard";

const FeautedNfts = () => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections } = useContext(GenContext);

  const algoCollectionsArr = Object.values(algoCollections);

  const [state, setState] = useState({
    collections: [],
    init: false,
  });

  const { collections, init } = state;

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

  return (
    <div className={classes.container}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>Featured NFTs </div>
      </div>

      <div className={`${classes.wrapper}`}>
        <GenadropCarouselScreen cardWidth={16 * 20} gap={32} init={init}>
          {collections.length ? (
            collections.map((collection, idx) => (
              <CollectionNftCard use_width="20em" key={idx} collection={collection} />
            ))
          ) : !collections ? (
            <NotFound />
          ) : (
            [...new Array(4)].map((_, idx) => (
              <div className={classes.skeleton} use_width="20em" key={idx}>
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
