import React, { useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";

const Collections = () => {
  const { auroraCollections, algoCollections, polygonCollections } = useContext(GenContext);
  const algoCollectionsArr = algoCollections ? Object.values(algoCollections) : [];

  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    window.localStorage.activeCollection = null;
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Top Collections</h3>
        <button type="button" onClick={() => history.push(`${url}/collections`)}>
          view all
        </button>
      </div>

      {algoCollectionsArr?.length || auroraCollections?.length || polygonCollections?.length ? (
        <div className={classes.wrapper}>
          {algoCollectionsArr
            ?.filter((_, idx) => idx < 10)
            .map((collection, idx) => (
              <CollectionsCard key={idx} collection={collection} />
            ))}
          {auroraCollections?.map((collection, idx) => (
            <CollectionsCard key={idx} collection={collection} />
          ))}
          {polygonCollections?.map((collection, idx) => (
            <CollectionsCard key={idx} collection={collection} />
          ))}
        </div>
      ) : !algoCollectionsArr && !auroraCollections && !polygonCollections ? (
        <h1 className={classes.noResult}> No Results Found</h1>
      ) : (
        <div className={classes.skeleton}>
          {[...new Array(4)]
            .map((_, idx) => idx)
            .map((id) => (
              <div key={id}>
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
