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
  setCeloCollections,
  setCeloSingleNft,
  setSearchContainer,
  setNearSingleNft,
} from "../../gen-state/gen.actions";
import {
  getGraphCollections,
  getNftCollections,
  getSingleNfts,
  getSingleGraphNfts,
  getCeloGraphCollections,
  fetchNearSingleNfts,
} from "../../utils";
import {
  GET_GRAPH_COLLECTIONS,
  GET_ALL_POLYGON_COLLECTIONS,
  GET_AURORA_SINGLE_NFTS,
  GET_POLYGON_SINGLE_NFTS,
  GET_CELO_SINGLE_NFT,
  GET_CELO_GRAPH_COLLECITONS,
  GET_NEAR_SINGLE_NFTS,
} from "../../graphql/querries/getCollections";
import { celoClient, graphQLClient, graphQLClientPolygon, nearClient } from "../../utils/graphqlClient";
import { GenContext } from "../../gen-state/gen.context";
import {
  parseAlgoCollection,
  parseAlgoSingle,
  parseAuroraCollection,
  parseAuroraSingle,
  parseCeloCollection,
  parseCeloSingle,
  parseNearSingle,
  parsePolygonCollection,
  parsePolygonSingle,
} from "./fetchData-script";
import { ethers } from "ethers";

const FetchData = () => {
  const { dispatch, mainnet } = useContext(GenContext);
  useEffect(() => {
    // Get ALGO Collection
    (async function getALgoCollections() {
      const collections = await fetchAlgoCollections(mainnet);
      dispatch(setCollections(collections));
      if (collections?.length) {
        const result = await getNftCollections({ collections, mainnet, dispatch });
        dispatch(setAlgoCollections(result));
        dispatch(
          setSearchContainer({
            "Algorand collection": parseAlgoCollection(result),
          })
        );
      } else {
        dispatch(setAlgoCollections({}));
      }
    })();

    // Get ALGO Signle NFTs
    (async function getAlgoSingle() {
      const singleNfts = await fetchAlgoSingle(mainnet);
      dispatch(setSingleNfts(singleNfts));
      if (singleNfts?.length) {
        const result = await getSingleNfts({ mainnet, singleNfts, dispatch });
        dispatch(
          setSearchContainer({
            "Algorand 1of1": parseAlgoSingle(result),
          })
        );
      } else {
        dispatch(setAlgoSingleNfts({}));
      }
    })();

    // get Aurora Collections
    (async function getDataFromEndpointA() {
      const { data, error } = await graphQLClient
        .query(
          GET_GRAPH_COLLECTIONS,
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
      const result = await getGraphCollections(data?.collections);
      const filterAddress =
        process.env.REACT_APP_ENV_STAGING === "true"
          ? ethers.utils.hexlify(process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS)
          : ethers.utils.hexlify(process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS);
      const res = result?.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        dispatch(setAuroraCollections(res));
        dispatch(
          setSearchContainer({
            "Aurora collection": parseAuroraCollection(res),
          })
        );
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
        dispatch(
          setSearchContainer({
            "Aurora 1of1": parseAuroraSingle(result),
          })
        );
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
      const result = await getGraphCollections(data?.collections);
      const filterAddress =
        process.env.REACT_APP_ENV_STAGING === "true"
          ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
          : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
      const res = result?.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        dispatch(setPolygonCollections(res));
        dispatch(
          setSearchContainer({
            "Polygon collection": parsePolygonCollection(res),
          })
        );
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
        dispatch(
          setSearchContainer({
            "Polygon 1of1": parsePolygonSingle(result),
          })
        );
      } else {
        dispatch(setPolygonSingleNfts(null));
      }
      return null;
    })();

    // Get Celo Single NFTs
    (async function getCeloSingleNft() {
      const { data, error } = await celoClient.query(GET_CELO_SINGLE_NFT).toPromise();
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
        dispatch(setCeloSingleNft(result));
        dispatch(
          setSearchContainer({
            "Celo 1of1": parseCeloSingle(result),
          })
        );
      } else {
        dispatch(setCeloSingleNft(null));
      }
      return null;
    })();

    // Get Celo Collection NFTs
    (async function getCeloCollections() {
      const { data, error } = await celoClient.query(GET_CELO_GRAPH_COLLECITONS).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await getGraphCollections(data?.collections);
      const filterAddress =
        process.env.REACT_APP_ENV_STAGING === "true"
          ? ethers.utils.hexlify(process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS)
          : ethers.utils.hexlify(process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS);
      const res = result.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        dispatch(setCeloCollections(res));
        dispatch(
          setSearchContainer({
            "Celo collection": parseCeloCollection(res),
          })
        );
      } else {
        dispatch(setCeloCollections(null));
      }
      return null;
    })();

    (async function getNearSingleNfts() {
      const { data, error } = await nearClient.query(GET_NEAR_SINGLE_NFTS).toPromise();
      if (error) {
        return dispatch(
          setNotification({
            message: error.message,
            type: "warning",
          })
        );
      }
      const result = await fetchNearSingleNfts(data?.nfts);
      if (result) {
        dispatch(setNearSingleNft(result));
        dispatch(
          setSearchContainer({
            "Near 1of1": parseNearSingle(result),
          })
        );
      } else {
        dispatch(setNearSingleNft(null));
      }
    })();
  }, [mainnet]);

  return null;
};

export default FetchData;
