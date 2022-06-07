import { useContext, useEffect } from "react";
import { fetchAlgoCollections, fetchAlgoSingle } from "../../utils/firebase";
import {
  setCollections,
  setSingleNfts,
  setAlgoCollections,
  setAlgoSingleNfts,
  setAuroraCollections,
  setPolygonCollections,
  setAuroraSingleNfts,
  setPolygonSingleNfts,
  setNotification,
} from "../../gen-state/gen.actions";
import { getAuroraCollections, getNftCollections, getSingleNfts, getSingleGraphNfts } from "../../utils";
import {
  GET_ALL_AURORA_COLLECTIONS,
  GET_ALL_POLYGON_COLLECTIONS,
  GET_AURORA_SINGLE_NFTS,
  GET_POLYGON_SINGLE_NFTS,
} from "../../graphql/querries/getCollections";
import { graphQLClient, graphQLClientPolygon } from "../../utils/graphqlClient";
import { GenContext } from "../../gen-state/gen.context";

const FetchData = () => {
  const { dispatch, mainnet } = useContext(GenContext);

  useEffect(() => {
    // Get ALGO Collection
    (async function getALgoCollections() {
      const collections = await fetchAlgoCollections(mainnet);
      dispatch(setCollections(collections));
      if (collections?.length) {
        getNftCollections({ collections, mainnet, dispatch });
      } else {
        dispatch(setAlgoCollections({}));
      }
    })();

    // Get ALGO Signle NFTs
    (async function getAlgoSingle() {
      const singleNfts = await fetchAlgoSingle(mainnet);
      dispatch(setSingleNfts(singleNfts));
      if (singleNfts?.length) {
        getSingleNfts({ mainnet, singleNfts, dispatch });
      } else {
        dispatch(setAlgoSingleNfts({}));
      }
    })();

    // get Aurora Collections
    (async function getDataFromEndpointA() {
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
        dispatch(setAuroraCollections(result));
      } else {
        dispatch(setAuroraCollections(null));
      }
      return null;
    })();

    // Get Aurora Signle NFTs
    (async function getDataFromEndpointA() {
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
        dispatch(setAuroraSingleNfts(result));
      } else {
        dispatch(setAuroraSingleNfts(null));
      }
      return null;
    })();

    // Get Polygon Collections
    (async function getDataFromEndpointB() {
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
        dispatch(setPolygonCollections(result));
      } else {
        dispatch(setPolygonCollections(null));
      }
      return null;
    })();

    // Get Polygon Signle NFTs
    (async function getDataFromEndpointB() {
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
        dispatch(setPolygonSingleNfts(result));
      } else {
        dispatch(setPolygonSingleNfts(null));
      }
      return null;
    })();
  }, [mainnet]);

  return null;
};

export default FetchData;
