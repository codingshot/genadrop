import React, { useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import NotFound from "../../not-found/notFound";
import GenadropCarouselScreen from "../../Genadrop-Carousel-Screen/GenadropCarouselScreen";
import DateFilter from "../Date-Filter/DateFilter";

const Collections = () => {
  const { auroraCollections, algoCollections, polygonCollections, celoCollections } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    window.localStorage.activeCollection = null;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.headingWrapper}>
          <h3>Top Collections</h3>
          {/* <DateFilter /> */}
        </div>
        <button type="button" onClick={() => history.push(`${url}/collections`)}>
          view all
        </button>
      </div>

      {algoCollectionsArr?.length ||
      auroraCollections?.length ||
      polygonCollections?.length ||
      celoCollections?.length ? (
        <GenadropCarouselScreen cardWidth={16 * 20} gap={16}>
          {[
            ...(algoCollectionsArr || [])
              ?.filter((_, idx) => idx < 3)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx} collection={collection} />),
            ...(auroraCollections || [])
              ?.filter((_, idx) => idx < 3)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx + 10} collection={collection} />),
            ...(polygonCollections || [])
              ?.filter((_, idx) => idx < 3)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx + 20} collection={collection} />),
            ...(celoCollections || [])
              ?.filter((_, idx) => idx < 3)
              .map((collection, idx) => <CollectionsCard useWidth="20em" key={idx + 20} collection={collection} />),
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

export default Collections;
