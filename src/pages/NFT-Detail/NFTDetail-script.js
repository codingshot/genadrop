import { readNftTransaction, readUserProfile } from "../../utils/firebase";
import axios from "axios";

export const getAlgoNftData = async ({ singleAlgoNfts, algoCollections, params }) => {
  const { collectionName, chainId, nftId } = params;
  console.log({ collectionName, chainId, singleAlgoNfts, algoCollections, params });
  if (collectionName) {
    const collection = algoCollections[collectionName];
    console.log({ collection });
  } else {
    const nft = singleAlgoNfts[nftId];
    return nft;
  }
};

export const getTransactionHistory = async () => {
  const tHistory = await readNftTransaction(nftId);
  console.log({ tHistory });
};

export const getCreator = async (owner) => {
  return await readUserProfile(owner);
};

export const breakAddress = (address = "", width = 6) => {
  return address && `${address.slice(0, width)}...${address.slice(-width)}`;
};
