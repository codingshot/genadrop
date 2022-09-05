import { ethers } from "ethers";
import {
  GET_CELO_GRAPH_COLLECITONS,
  GET_CELO_NFT,
  GET_GRAPH_NFT,
  GET_USER_COLLECTIONS,
  GET_USER_NFT,
} from "../../graphql/querries/getCollections";
import {
  getCeloGraphNft,
  getGraphCollection,
  getGraphCollections,
  getGraphNft,
  getSingleGraphNfts,
  getTransactions,
  getUserGraphNft,
} from "../../utils";
import { auroraClient, celoClient, polygonClient } from "../../utils/graphqlClient";

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

export const getPolygonMintedNFTs = async (address) => {
  const { data, error: polygonError } = await polygonClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (polygonError) return;
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS);
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const polygonMintedNfts = response?.filter((NFTS) => NFTS?.sold !== true && NFTS?.collectionId === filterAddress);
  return polygonMintedNfts;
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
  const celoMintedNfts = response?.filter((NFTS) => NFTS?.sold !== true && NFTS?.collectionId === filterAddress);
  return celoMintedNfts;
};

export const getCeloCollectedNFTs = async (address) => {
  const { data, error: celoError } = await celoClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (celoError) return;

  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const celoCollectedNfts = response?.filter((NFTS) => NFTS.sold === true);
  return celoCollectedNfts;
};

export const getAuroraMintedNfts = async (address) => {
  const { data, error: auroraError } = await auroraClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (auroraError) return;
  const filterAddress =
    process.env.REACT_APP_ENV_STAGING === "true"
      ? ethers.utils.hexlify(process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS)
      : ethers.utils.hexlify(process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS);
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const auroraMintedNfts = response?.filter((NFTS) => NFTS?.sold !== true && NFTS.collectionId === filterAddress);
  return auroraMintedNfts;
};

export const getAuroraCollectedNFTs = async (address) => {
  const { data, error: auroraError } = await auroraClient.query(GET_USER_NFT, { id: address }).toPromise();
  if (auroraError) return;
  const response = await getSingleGraphNfts(data?.user?.nfts, address);
  const auroraCollectedNfts = response?.filter((NFTS) => NFTS?.sold === true);
  return auroraCollectedNfts;
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
  console.log("xxxx", celoData);
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
