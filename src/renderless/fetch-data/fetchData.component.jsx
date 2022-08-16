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
} from "../../gen-state/gen.actions";
import {
  getGraphCollections,
  getNftCollections,
  getSingleNfts,
  getSingleGraphNfts,
  getCeloGraphCollections,
} from "../../utils";
import {
  GET_GRAPH_COLLECTIONS,
  GET_ALL_POLYGON_COLLECTIONS,
  GET_AURORA_SINGLE_NFTS,
  GET_POLYGON_SINGLE_NFTS,
  GET_CELO_SINGLE_NFT,
  GET_CELO_GRAPH_COLLECITONS,
} from "../../graphql/querries/getCollections";
import { celoClient, graphQLClient, graphQLClientPolygon } from "../../utils/graphqlClient";
import { GenContext } from "../../gen-state/gen.context";
import {
  parseAlgoCollection,
  parseAlgoSingle,
  parseAuroraCollection,
  parseAuroraSingle,
  parseCeloCollection,
  parseCeloSingle,
  parsePolygonCollection,
  parsePolygonSingle,
} from "./fetchData-script";

const FetchData = () => {
  const { dispatch, mainnet } = useContext(GenContext);

  useEffect(() => {
    // Get ALGO Collection
    (async function getALgoCollections() {
      const collections = await fetchAlgoCollections(mainnet);
      dispatch(setCollections(collections));
      if (collections?.length) {
        const result = await getNftCollections({ collections, mainnet, dispatch });
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
      if (result?.length) {
        dispatch(setAuroraCollections(result));
        dispatch(
          setSearchContainer({
            "Aurora collection": parseAuroraCollection(result),
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
          ? "0xd6b01b63dd514cf771d8d21b776197fdf9648d54"
          : "0x3243cd574e9d51ad012c7fa4957e8037beb8792f";
      const res = result?.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        dispatch(setPolygonCollections(res));
        dispatch(
          setSearchContainer({
            "Polygon collection": parsePolygonCollection(result),
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
          ? "0x68c79f7d19b5de514b1fc23cbd5c4b84f05bf178"
          : "0x0d2e152fc5cfc53f3baf7e1ae0f6b967953706ed";
      const res = result.filter((data) => data?.Id !== filterAddress);
      if (res?.length) {
        dispatch(setCeloCollections(res));
        dispatch(
          setSearchContainer({
            "Celo collection": parseCeloCollection(result),
          })
        );
      } else {
        dispatch(setCeloCollections(null));
      }
      return null;
    })();
  }, [mainnet]);

  return null;
};

export default FetchData;
