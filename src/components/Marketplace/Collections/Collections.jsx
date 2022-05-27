import React, { useEffect, useContext, useState, useMemo } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { createClient } from "urql";
import Skeleton from "react-loading-skeleton";
import classes from "./collections.module.css";
import "react-loading-skeleton/dist/skeleton.css";
import { getAuroraCollections, getNftCollections } from "../../../utils";
import CollectionsCard, { NearCollectionCard } from "../collectionsCard/collectionsCard";
import { GenContext } from "../../../gen-state/gen.context";
import { GET_ALL_AURORA_COLLECTIONS, GET_ALL_POLYGON_COLLECTIONS } from "../../../graphql/querries/getCollections";
import { graphQLClient, graphQLClientPolygon } from "../../../utils/graphqlClient";
import { setNotification } from "../../../gen-state/gen.actions";

const Collections = () => {
  const [state, setState] = useState({
    algoCollection: [],
    auroraCollection: null,
    graphCollection: [],
    polygonCollection: null,
  });
  const { collections, mainnet, dispatch } = useContext(GenContext);
  const { algoCollection, auroraCollection, polygonCollection, graphCollection } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const history = useHistory();
  const { url } = useRouteMatch();

  const getAllCollectionChains = () => {
    return !auroraCollection && !polygonCollection ? null : [...(auroraCollection || []), ...(polygonCollection || [])];
  };

  async function getDataFromEndpointB() {
    const { data, error } = await graphQLClientPolygon
      .query(
        GET_ALL_POLYGON_COLLECTIONS,
        {},
        {
          clientName: "polygon",
        }
      )
      .toPromise();
    if (error) {
      return dispatch(
        setNotification({
          message: error.message,
          type: "warning",
        })
      );
    }
    const result = await getAuroraCollections(data?.collections);

    if (result?.length) {
      handleSetState({ polygonCollection: result });
    } else {
      handleSetState({ polygonCollection: null });
    }
  }

  async function getDataFromEndpointA() {
    const { data, error } = await graphQLClient
      .query(
        GET_ALL_AURORA_COLLECTIONS,
        {},
        {
          clientName: "aurora",
        }
      )
      .toPromise();
    if (error) {
      return dispatch(
        setNotification({
          message: error.message,
          type: "warning",
        })
      );
    }
    const result = await getAuroraCollections(data?.collections);
    if (result?.length) {
      handleSetState({ auroraCollection: result });
    } else {
      handleSetState({ auroraCollection: null });
    }
  }

  useEffect(() => {
    getDataFromEndpointA();
    getDataFromEndpointB();
  }, []);

  useEffect(() => {
    const collection = getAllCollectionChains();
    handleSetState({
      graphCollection: collection,
    });
  }, [auroraCollection, polygonCollection]);

  useEffect(() => {
    try {
      (async function getAlgoCollection() {
        // let collections = await fetchCollections();
        if (collections?.length) {
          const result = await getNftCollections(collections.slice(0, 10), mainnet);
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
          {algoCollection
            ?.filter((_, idx) => idx < 10)
            ?.map((collection, idx) => (
              <CollectionsCard key={idx} collection={collection} />
            ))}
          {graphCollection?.map((collection, idx) => (
            <NearCollectionCard key={idx} collection={collection} />
          ))}
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
