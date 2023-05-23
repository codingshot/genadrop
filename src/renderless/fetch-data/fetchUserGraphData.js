/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { gql } from "@apollo/client";
import { ethers } from "ethers";
import {
  GET_ALL_POLYGON_COLLECTIONS,
  GET_AURORA_SINGLE_NFTS,
  GET_AURORA_SINGLE_NFTS_WITH_LIMIT,
  GET_AURORA_SOUL_BOUND_NFTS,
  GET_AURORA_SOUL_BOUND_NFTS_WITH_LIMIT,
  GET_AVAX_SINGLE_NFTS,
  GET_AVAX_SINGLE_NFTS_WITH_LIMIT,
  GET_CELO_GRAPH_COLLECITONS,
  GET_CELO_NFT,
  GET_CELO_SINGLE_NFT,
  GET_CELO_SINGLE_NFT_WITH_LIMITS,
  GET_CELO_SOUL_BOUND_NFTS,
  GET_CELO_SOUL_BOUND_NFTS_WITH_LIMITS,
  GET_FEATURED_SINGLE_NFT,
  GET_GRAPH_COLLECTIONS,
  GET_GRAPH_NFT,
  GET_NEAR_NFT,
  GET_NEAR_SINGLE_NFTS,
  GET_NEAR_SINGLE_NFTS_WITH_LIMIT,
  GET_NEAR_USER_NFT,
  GET_POLYGON_SINGLE_NFTS,
  GET_POLYGON_SINGLE_NFTS_WITH_LIMIT,
  GET_POLYGON_SOUL_BOUND_NFTS,
  GET_POLYGON_SOUL_BOUND_NFTS_WITH_LIMITS,
  GET_SINGLE_GRAPH_COLLECTION,
  GET_USER_COLLECTIONS,
  GET_USER_NFT,
} from "../../graphql/querries/getCollections";
import {
  getCeloGraphNft,
  getGraphCollection,
  getGraphCollections,
  getGraphNft,
  getNearNft,
  getNearSingleGraphNfts,
  getGraphTransactionHistory,
  getSingleGraphNfts,
  getTransactions,
  getUserGraphNft,
  getNftCollections,
  getSingleNfts,
  getNearTransactions,
  getGraphCollectionData,
  getFeaturedGraphNft,
} from "../../utils";
import { fetchAlgoCollections, fetchAlgoSingle } from "../../utils/firebase";
import {
  arbitrumClient,
  auroraClient,
  avalancheClient,
  celoClient,
  nearClient,
  polygonClient,
} from "../../utils/graphqlClient";

const soulboundSingleFilterAddress = ethers.utils.hexlify(process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS);

export const polygonUserData = async (address) => {
  const { data: polygonData, error: polygonError } = await polygonClient
    .query(GET_GRAPH_NFT, { id: address })
    .toPromise();
  if (polygonError) return;
  let trHistory;
  let polygonResult = [];
  if (polygonData?.nft !== null) {
    polygonResult = await getGraphNft(polygonData?.nft);
    trHistory = await getTransactions(polygonData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = polygonResult[0].price;
    });
  }
  return [polygonResult[0], trHistory];
};

export const arbitrumUserData = async (address) => {
  const { data, error: polygonError } = await arbitrumClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (polygonError) return;
  let trHistory;
  let arbitrumResult = [];
  if (data?.nft !== null) {
    arbitrumResult = await getGraphNft(data?.nft);
    trHistory = await getTransactions(data?.nft?.transactions);
  }
  return [arbitrumResult[0], trHistory];
};

export const getAvalancheNft = async (address) => {
  const { data: avaxData, error: avaxError } = await avalancheClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (avaxError) return;
  let trHistory;
  let avaxResult = [];
  if (avaxData?.nft !== null) {
    avaxResult = await getGraphNft(avaxData?.nft);
    trHistory = await getTransactions(avaxData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = avaxResult[0].price;
    });
  }
  return [avaxResult[0], trHistory];
};

export const getFeaturedAvalancheNft = async (address) => {
  const { data, error } = await avalancheClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (error) return [];
  const result = await getFeaturedGraphNft(data?.nft);
  return result;
};

export const getFeaturedNearNfts = async (address) => {
  const { data, error } = await nearClient.query(GET_NEAR_NFT, { id: address }).toPromise();
  if (error) return [];
  const result = await getNearNft(data?.nft);
  return result;
};

export const getFeaturedPolygonNfts = async (address) => {
  const { data: polygonData, error: polygonError } = await polygonClient
    .query(GET_GRAPH_NFT, { id: address })
    .toPromise();
  if (polygonError) return [];
  const result = await getFeaturedGraphNft(polygonData?.nft);
  return result;
};

export const nearUserData = async (address) => {
  const { data: nearData, error: nearError } = await nearClient.query(GET_NEAR_NFT, { id: address }).toPromise();
  if (nearError) return;
  let trHistory;
  let nearResult = [];
  if (nearData?.nft !== null) {
    nearResult = await getNearNft(nearData?.nft);
    trHistory = await getNearTransactions(nearData?.nft?.transactions);
  }
  const transactionHistory = trHistory.sort((a, b) => b?.txDate - a?.txDate);
  return [nearResult[0], transactionHistory];
};

export const nearFeaturedNfts = async (address) => {
  const { data, error } = await nearClient.query(GET_FEATURED_SINGLE_NFT, { id: address }).toPromise();
  if (error) return [];
  const nearData = await getGraphNft(data?.nft);
  return nearData;
};

export const getPolygonNFTToList = async (address, nftId) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const polygonBoughtNft = await getUserGraphNft(data?.user?.nfts, address);
  const nft = polygonBoughtNft.filter((NFT) => NFT.tokenID === nftId)[0];
  return nft;
};

export const getPolygonCollectedNFTs = async (address) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const polygonBoughtNft = response?.filter((NFTS) => NFTS.sold === true);
  return polygonBoughtNft;
};

export const getArbitrumCollectedNFTs = async (address) => {
  const { data, error } = await arbitrumClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (error) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const arbitrumBoughtNft = response?.filter((NFTS) => NFTS.sold === true);
  return arbitrumBoughtNft;
};

export const getPolygonMintedNFTs = async (address) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;

  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
  const response = await getSingleGraphNfts(data?.user?.nfts, data?.user?.id);
  const polygonMintedNfts = response?.filter(
    (NFTS) =>
      !NFTS?.sold && (NFTS?.collectionId === soulboundSingleFilterAddress || NFTS?.collectionId === filterAddress)
  );
  return polygonMintedNfts;
};

export const getNearMintedNfts = async (address) => {
  const { data: nearData, error: nearError } = await nearClient.query(GET_NEAR_USER_NFT, { id: address }).toPromise();
  if (nearError) return;

  const response = await getNearSingleGraphNfts(nearData?.user?.nfts, address);
  const nearMintedNfts = response?.filter((NFTS) => NFTS?.sold !== true);
  return nearMintedNfts;
};

export const getArbitrumMintedNfts = async (address) => {
  const { data, error } = await arbitrumClient.query(GET_NEAR_USER_NFT, { id: address }).toPromise();
  if (error) return;

  const response = await getNearSingleGraphNfts(data?.user?.nfts, address);
  const arbitrumMintedNfts = response?.filter((NFTS) => NFTS?.sold !== true);
  return arbitrumMintedNfts;
};

export const getAvaxMintedNfts = async (address) => {
  const { data: avaxData, error: avaxError } = await avalancheClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (avaxError) return;
  const response = await getSingleGraphNfts(avaxData?.user?.nfts, address);
  const avaxMintedNfts = response?.filter((NFTS) => NFTS?.sold !== true);
  return avaxMintedNfts;
};

export const getCeloNFTToList = async (address, nftId) => {
  const { data, error: celoError } = await celoClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (celoError) return;
  const celoBoughtNft = await getUserGraphNft(data?.user?.nfts, address);
  const nft = celoBoughtNft.filter((NFT) => NFT.tokenID === nftId)[0];
  return nft;
};

export const getCeloMintedNFTs = async (address) => {
  const { data, error: celoError } = await celoClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (celoError) return;
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers?.utils?.hexlify(process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS)
      : ethers?.utils?.hexlify(process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS);
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const celoMintedNfts = response?.filter(
    (NFTS) =>
      !NFTS?.sold && (NFTS?.collectionId === soulboundSingleFilterAddress || NFTS?.collectionId === filterAddress)
  );
  return celoMintedNfts;
};

export const getCeloCollectedNFTs = async (address) => {
  const { data, error: celoError } = await celoClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (celoError) return;

  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const celoCollectedNfts = response?.filter((NFTS) => NFTS.sold === true);
  return celoCollectedNfts;
};

export const getPolygonSingleCollection = async (address) => {
  const { data, error } = await polygonClient.query(GET_SINGLE_GRAPH_COLLECTION, { id: address }).toPromise();
  if (error) return;
  const nftData = await getGraphCollection(data?.collection?.nfts, data?.collection);
  const collectionData = await getGraphCollectionData(data?.collection);
  return [nftData, collectionData];
};

export const getCeloSingleCollection = async (address) => {
  const { data, error } = await celoClient.query(GET_SINGLE_GRAPH_COLLECTION, { id: address }).toPromise();
  if (error) return;
  const nftData = await getGraphCollection(data?.collection?.nfts, data?.collection);
  const collectionData = await getGraphCollectionData(data?.collection);
  return [nftData, collectionData];
};

export const getAuroraSingleCollection = async (address) => {
  const { data, error } = await auroraClient.query(GET_SINGLE_GRAPH_COLLECTION, { id: address }).toPromise();
  if (error) return;
  const nftData = await getGraphCollection(data?.collection?.nfts, data?.collection);
  const collectionData = await getGraphCollectionData(data?.collection);
  return [nftData, collectionData];
};

export const getAuroraMintedNfts = async (address) => {
  const { data, error: auroraError } = await auroraClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (auroraError) return;

  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS);

  const auroraSoulBoundAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_AURORA_TESTNET_SOULBOUND_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AURORA_MAINNET_SOULBOUND_ADDRESS);

  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const auroraMintedNfts = response?.filter(
    (NFTS) => !NFTS?.sold && (NFTS?.collectionId === auroraSoulBoundAddress || NFTS?.collectionId === filterAddress)
  );
  return auroraMintedNfts;
};

export const getAuroraCollectedNFTs = async (address) => {
  const { data, error: auroraError } = await auroraClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (auroraError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const auroraCollectedNfts = response?.filter((NFTS) => NFTS?.sold === true);
  return auroraCollectedNfts;
};

export const getAvaxCollectedNFTs = async (address) => {
  const { data, error: auroraError } = await avalancheClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (auroraError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const avaxCollectedNfts = response?.filter((NFTS) => NFTS?.sold === true);
  return avaxCollectedNfts;
};

export const getCeloUserCollections = async (account) => {
  const { data, error: celoError } = await celoClient.query(GET_USER_COLLECTIONS, { id: account }).toPromise();
  if (celoError) return;
  const result = await getGraphCollections(data?.user?.collections);
  return result;
};

export const getPolygonUserCollections = async (account) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_COLLECTIONS, { id: account }).toPromise();
  if (polygonError) return;
  const result = await getGraphCollections(data?.user?.collections);
  return result;
};

export const getAuroraUserCollections = async (account) => {
  const { data, error: auroraError } = await auroraClient.query(GET_USER_COLLECTIONS, { id: account }).toPromise();
  if (auroraError) return;
  const result = await getGraphCollections(data?.user?.collections);
  return result;
};

export const auroraUserData = async (address) => {
  const { data: auroraData, error: auroraError } = await auroraClient.query(GET_GRAPH_NFT, { id: address }).toPromise();
  if (auroraError) return;
  let trHistory;
  let auroraResult = [];
  if (auroraData?.nft !== null) {
    auroraResult = await getGraphNft(auroraData?.nft);
    trHistory = await getTransactions(auroraData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = auroraResult[0].price;
    });
  }
  return [auroraResult[0], trHistory];
};

export const celoUserData = async (address) => {
  const { data: celoData, error: celoError } = await celoClient.query(GET_CELO_NFT, { id: address }).toPromise();
  if (celoError) return;
  let trHistory;
  let celoResult = [];
  if (celoData?.nft !== null) {
    celoResult = await getCeloGraphNft(celoData?.nft);
    trHistory = await getTransactions(celoData?.nft?.transactions);
    trHistory.find((t) => {
      if (t.type === "Minting") t.price = celoResult[0].price;
    });
  }
  return [celoResult[0], trHistory];
};

export const getAllCeloNfts = async (limit) => {
  const { data: graphData, error } = await celoClient
    .query(limit ? GET_CELO_SINGLE_NFT_WITH_LIMITS : GET_CELO_SINGLE_NFT)
    .toPromise();
  const { data: sbData, error: sbError } = await celoClient
    .query(limit ? GET_CELO_SOUL_BOUND_NFTS_WITH_LIMITS : GET_CELO_SOUL_BOUND_NFTS)
    .toPromise();

  if (error || sbError) return [];
  const data = await getSingleGraphNfts([...graphData.nfts, ...sbData.nfts]);
  return data;
};

export const getAllPolygonNfts = async (limit) => {
  const { data: graphData, error } = await polygonClient
    .query(limit ? GET_POLYGON_SINGLE_NFTS_WITH_LIMIT : GET_POLYGON_SINGLE_NFTS)
    .toPromise();
  const { data: sbData, error: sbError } = await polygonClient
    .query(limit ? GET_POLYGON_SOUL_BOUND_NFTS_WITH_LIMITS : GET_POLYGON_SOUL_BOUND_NFTS)
    .toPromise();

  if (error || sbError) return [];
  const data = getSingleGraphNfts([...graphData.nfts, ...sbData.nfts]);
  return data;
};

export const getAllArbitrumNfts = async (limit) => {
  const { data: graphData, error } = await arbitrumClient
    .query(limit ? GET_NEAR_SINGLE_NFTS_WITH_LIMIT : GET_NEAR_SINGLE_NFTS)
    .toPromise();
  if (error) return [];
  const data = await getSingleGraphNfts(graphData?.nfts);
  return data;
};

export const getAllAuroraNfts = async (limit) => {
  const { data: graphData, error } = await auroraClient
    .query(limit ? GET_AURORA_SINGLE_NFTS_WITH_LIMIT : GET_AURORA_SINGLE_NFTS)
    .toPromise();
  const { data: sbData, error: sbError } = await auroraClient
    .query(limit ? GET_AURORA_SOUL_BOUND_NFTS_WITH_LIMIT : GET_AURORA_SOUL_BOUND_NFTS)
    .toPromise();

  if (error || sbError) return [];
  const data = await getSingleGraphNfts([...graphData.nfts, ...sbData.nfts]);
  return data;
};

export const getAllNearNfts = async (limit) => {
  const { data: graphData, error } = await nearClient
    .query(limit ? GET_NEAR_SINGLE_NFTS_WITH_LIMIT : GET_NEAR_SINGLE_NFTS)
    .toPromise();
  if (error) return [];
  const data = await getNearSingleGraphNfts(graphData?.nfts);
  return data;
};

export const getAllAlgorandNfts = async (mainnet, dispatch) => {
  const singleNfts = await fetchAlgoSingle(mainnet);
  let result = [];
  if (singleNfts?.length) {
    const nfts = await getSingleNfts({ mainnet, singleNfts, dispatch });
    result = Object.values(nfts);
  }
  return result;
};

export const getAllAlgorandCollections = async (mainnet, dispatch) => {
  const collections = await fetchAlgoCollections(mainnet);
  let result = [];
  if (collections?.length) {
    const collectionNfts = await getNftCollections({ collections, mainnet, dispatch });
    result = Object.values(collectionNfts);
  }
  return result;
};

export const getAllAvalancheNfts = async (limit) => {
  const { data: graphData, error } = await avalancheClient
    .query(limit ? GET_AVAX_SINGLE_NFTS_WITH_LIMIT : GET_AVAX_SINGLE_NFTS)
    .toPromise();
  if (error) return [];
  const data = await getSingleGraphNfts(graphData?.nfts);
  return data;
};

export const getAllAuroraCollections = async () => {
  const { data, error } = await auroraClient.query(GET_GRAPH_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter((aurora) => aurora?.Id !== filterAddress);
  return res;
};

export const getAllPolygonCollections = async () => {
  const { data, error } = await polygonClient.query(GET_ALL_POLYGON_COLLECTIONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter((aurora) => aurora?.Id !== filterAddress && aurora?.Id !== soulboundSingleFilterAddress);
  return res;
};

export const getAllCeloCollections = async () => {
  const { data, error } = await celoClient.query(GET_CELO_GRAPH_COLLECITONS).toPromise();
  if (error) return [];
  const result = await getGraphCollections(data?.collections);
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS);
  const res = result?.filter((aurora) => aurora?.Id !== filterAddress && aurora?.Id !== soulboundSingleFilterAddress);
  return res;
};

export const celoCollectionTransactions = async (id) => {
  const { data: celoData, error: celoError } = await celoClient
    .query(
      gql`query MyQuery {
      transactions(
        where: {nft_contains: "${id}"}
        orderBy: txDate
      ) {
        id
        price
        txDate
        txId
        type
        to {
          id
        }
        from {
          id
        }
      }
    }`
    )
    .toPromise();
  if (celoError) return;
  const transaction = getGraphTransactionHistory(celoData?.transactions);
  if (transaction) return (await transaction).reverse();
};

export const polygonCollectionTransactions = async (id) => {
  const { data: celoData, error: celoError } = await polygonClient
    .query(
      gql`query MyQuery {
      transactions(
        where: {nft_contains: "${id}"}
        orderBy: txDate
      ) {
        id
        price
        txDate
        txId
        type
        to {
          id
        }
        from {
          id
        }
      }
    }`
    )
    .toPromise();
  if (celoError) return;
  const transaction = getGraphTransactionHistory(celoData?.transactions);
  if (transaction) return (await transaction).reverse();
};

export const auroraCollectionTransactions = async (id) => {
  const { data: celoData, error: celoError } = await auroraClient
    .query(
      gql`query MyQuery {
      transactions(
        where: {nft_contains: "${id}"}
        orderBy: txDate
      ) {
        id
        price
        txDate
        txId
        type
        to {
          id
        }
        from {
          id
        }
      }
    }`
    )
    .toPromise();
  if (celoError) return;
  const transaction = getGraphTransactionHistory(celoData?.transactions);
  if (transaction) return (await transaction).reverse();
};
