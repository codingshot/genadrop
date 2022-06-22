import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import classes from "./HotAuctions.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import { useHistory, useRouteMatch } from "react-router-dom";
const HotAuctions = () => {
  const { url } = useRouteMatch();
  const history = useHistory();
  const [activeDuration, setActiveDuration] = useState("live");
  const { auroraCollections, algoCollections, polygonCollections } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const handleClick = (duration) => {
    setActiveDuration(duration);
  };

  useEffect(() => {
    window.localStorage.activeCollection = null;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.headingWrapper}>
          <h3>Hot Auctions</h3>
          <div className={classes.filter}>
            <div className={`${activeDuration === "live" && classes.active}`} onClick={() => handleClick("live")}>
              Live
            </div>
            <div className={`${activeDuration === "ended" && classes.active}`} onClick={() => handleClick("ended")}>
              Ended
            </div>
          </div>
        </div>
        <button onClick={() => history.push(`${url}/collections`)}>view all</button>
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
