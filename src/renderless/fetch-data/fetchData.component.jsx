import { useContext, useEffect } from "react";
import { fetchAlgoCollections, fetchAlgoSingle, fetchUserCollections, fetchUserNfts } from "../../utils/firebase";
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

const FetchData = () => {
  const { dispatch, mainnet, account } = useContext(GenContext);

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
      const result = await getGraphCollections(data?.collections);
      const res = result?.filter((data) => data?.Id !== "0xd6b01b63dd514cf771d8d21b776197fdf9648d54");
      if (res?.length) {
        dispatch(setPolygonCollections(res));
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
      console.log("polygon single", result);
      if (result?.length) {
        dispatch(setPolygonSingleNfts(result));
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
      } else {
        dispatch(setCeloSingleNft(null));
      }
      return null;
    })();

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
      const res = result.filter((data) => data.Id !== "0x68c79f7d19b5de514b1fc23cbd5c4b84f05bf178");
      if (res?.length) {
        dispatch(setCeloCollections(res));
      } else {
        dispatch(setCeloCollections(null));
      }
      return null;
    })();
  }, [mainnet]);

  return null;
};

export default FetchData;
