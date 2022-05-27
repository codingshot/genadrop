import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory, useRouteMatch } from "react-router-dom";
import { createClient } from "urql";
import { getSingleGraphNfts, getSingleNfts } from "../../../utils";
import NftCard from "../NftCard/NftCard";
import classes from "./SingleNft.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import { GET_AURORA_SINGLE_NFTS, GET_POLYGON_SINGLE_NFTS } from "../../../graphql/querries/getCollections";
import { graphQLClient, graphQLClientPolygon } from "../../../utils/graphqlClient";
import { setNotification } from "../../../gen-state/gen.actions";

const SingleNft = () => {
  const [state, setState] = useState({
    allSingleNfts: [],
    allSingleGraphNfts: [],
    polygonSingleNfts: null,
    auroraSingleNfts: null,
  });
  const { allSingleNfts, allSingleGraphNfts, polygonSingleNfts, auroraSingleNfts } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { singleNfts, mainnet, dispatch } = useContext(GenContext);
  const { url } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    (async function getResult() {
      if (singleNfts?.length) {
        const allSingleNFTs = await getSingleNfts(mainnet, singleNfts.slice(0, 10));
        handleSetState({ allSingleNfts: allSingleNFTs });
      } else {
        handleSetState({ allSingleNfts: null });
      }
    })();
  }, [singleNfts]);

  const getAllCollectionChains = () => {
    return !auroraSingleNfts && !polygonSingleNfts ? null : [...(auroraSingleNfts || []), ...(polygonSingleNfts || [])];
  };

  async function getDataFromEndpointB() {
    const { data, error } = await graphQLClientPolygon
      .query(
        GET_POLYGON_SINGLE_NFTS,
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
    const result = await getSingleGraphNfts(data?.nfts);

    if (result?.length) {
      handleSetState({ polygonSingleNfts: result });
    } else {
      handleSetState({ polygonSingleNfts: null });
    }
  }

  async function getDataFromEndpointA() {
    const { data, error } = await graphQLClient
      .query(
        GET_AURORA_SINGLE_NFTS,
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
    const result = await getSingleGraphNfts(data?.nfts);
    if (result?.length) {
      handleSetState({ auroraSingleNfts: result });
    } else {
      handleSetState({ auroraSingleNfts: null });
    }
  }

  useEffect(() => {
    getDataFromEndpointA();
    getDataFromEndpointB();
  }, []);

  useEffect(() => {
    const singleNfts = getAllCollectionChains();
    handleSetState({
      allSingleGraphNfts: singleNfts,
    });
  }, [auroraSingleNfts, polygonSingleNfts]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h3>1 of 1s</h3>
        <button type="button" onClick={() => history.push(`${url}/single-mint`)}>
          view all
        </button>
      </div>
      {allSingleNfts?.length ? (
        <div className={classes.wrapper}>
          {allSingleNfts.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
          {allSingleGraphNfts?.map((nft) => (
            <NftCard key={nft.Id} nft={nft} extend="/single-mint" />
          ))}
        </div>
      ) : !allSingleNfts ? (
        <h1 className={classes.noResult}> No Results Found</h1>
      ) : (
        <div className={classes.wrapper}>
          {[...new Array(5)]
            .map((_, idx) => idx)
            .map((id) => (
              <div key={id}>
                <Skeleton count={1} height={200} />
                <Skeleton count={3} height={40} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SingleNft;
