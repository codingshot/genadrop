import React, { useContext, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./TopCollections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import CollectionNFTCard from "../Collection-NFT-Card/CollectionNFTCard";
import { GenContext } from "../../gen-state/gen.context";
import NotFound from "../not-found/notFound";

const TopCollections = () => {
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
              <CollectionNFTCard key={idx} collection={collection} />
            ))}
          {auroraCollections?.map((collection, idx) => (
            <CollectionNFTCard key={idx} collection={collection} />
          ))}
          {polygonCollections?.map((collection, idx) => (
            <CollectionNFTCard key={idx} collection={collection} />
          ))}
        </div>
      ) : !algoCollectionsArr && !auroraCollections && !polygonCollections ? (
        <NotFound />
      ) : (
        <div className={classes.skeleton}>
          {[...new Array(4)].map((id) => (
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

export default TopCollections;
