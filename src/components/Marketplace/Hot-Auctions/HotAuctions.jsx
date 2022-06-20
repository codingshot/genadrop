import React, { useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./HotAuctions.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";

const HotAuctions = () => {
  const { auroraCollections, algoCollections, polygonCollections } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  useEffect(() => {
    window.localStorage.activeCollection = null;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Hot Auctions</h3>
        <button>view all</button>{" "}
      </div>

      {algoCollectionsArr?.length || auroraCollections?.length || polygonCollections?.length ? (
        <GenadropCarouselScreen cardWidth={16 * 20} gap={16}>
          {[
            ...algoCollectionsArr
              ?.filter((_, idx) => idx < 10)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx} collection={collection} />),
            ...auroraCollections
              ?.filter((_, idx) => idx < 10)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx + 20} collection={collection} />),
            ...polygonCollections
              ?.filter((_, idx) => idx < 10)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx + 30} collection={collection} />),
          ]}
        </GenadropCarouselScreen>
      ) : !algoCollectionsArr && !auroraCollections && !polygonCollections ? (
        <NotFound />
      ) : (
        <div className={classes.skeleton}>
          {[...new Array(4)].map((_, idx) => (
            <div key={idx}>
              <Skeleton count={1} height={250} />
              <br />
              <Skeleton count={1} height={30} />
              <br />
              <Skeleton count={1} height={30} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotAuctions;
