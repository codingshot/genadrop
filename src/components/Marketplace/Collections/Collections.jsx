import React, { useEffect, useContext, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import { getAuroraCollections, getNftCollections } from "../../../utils";
import CollectionsCard from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import { createClient } from "urql";
import { GET_ALL_AURORA_COLLECTIONS } from "../../../graphql/querries/getCollections";

const Collections = () => {
  const APIURL = "https://api.thegraph.com/subgraphs/name/prometheo/genadrop-aurora-testnet";

  const client = createClient({
    url: APIURL,
  });

  const [state, setState] = useState({
    algoCollection: [],
    auroraCollection: [],
  });
  const { collections, mainnet } = useContext(GenContext);
  const { algoCollection, auroraCollection } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    (async function getSubgraphNfts() {
      const data = await client.query(GET_ALL_AURORA_COLLECTIONS).toPromise();
      console.log(data);
      const result = await getAuroraCollections(data.data.collections[0].nfts);
      if (result?.length) {
        handleSetState({ auroraCollection: result });
      } else {
        handleSetState({ auroraCollection: null });
      }
    })();
  }, []);

  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        // let collections = await fetchCollections();
        if (collections?.length) {
          const result = await getNftCollections(collections, mainnet);
          console.log("collections: ", result);
          handleSetState({ algoCollection: result });
        } else {
          handleSetState({ algoCollection: null });
        }
      })();
    } catch (error) {
      console.log(error);
    }
  }, [collections]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>Top Collections</h3>
        <button type="button" onClick={() => history.push(`${url}/collections`)}>
          view all
        </button>
      </div>

      {algoCollection?.length ? (
        <div className={classes.wrapper}>
          {auroraCollection.map((collection, idx) => (
            <CollectionsCard key={idx} collection={collection} />
          ))}
          {/* {algoCollection
            .filter((_, idx) => idx < 10)
            .map((collection, idx) => (
              <CollectionsCard key={idx} collection={collection} />
            ))} */}
        </div>
      ) : !algoCollection ? (
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
