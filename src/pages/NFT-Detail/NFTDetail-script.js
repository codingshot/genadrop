import { readNftTransaction, readUserProfile } from "../../utils/firebase";
// import axios from "axios";
import { getCeloGraphNft, getGraphCollection, getTransactions } from "../../utils";
import { auroraUserData, celoUserData, polygonUserData } from "../../renderless/fetch-data/fetchUserGraphData";
import supportedChains from "../../utils/supportedChains";

export const getAlgoData = async ({ algoProps }) => {
  const { singleAlgoNfts, activeCollection, params } = algoProps;
  const { collectionName, nftId } = params;
  let nftDetails;
  if (collectionName) {
    nftDetails = activeCollection.find((col) => col.Id === Number(nftId));
  } else {
    nftDetails = singleAlgoNfts[nftId];
  }
  let transactionHistory;
  if (nftDetails) {
    transactionHistory = await readNftTransaction(nftDetails.Id);
  }
  // tHistory.find((t) => {
  //   if (t.type === "Minting") t.price = nftDetails.price;
  // });

  return {
    nftDetails,
    transactionHistory,
    _1of1: singleAlgoNfts || [],
    collection: activeCollection || [],
  };
};

export const getGraphData = async ({ graphProps }) => {
  const {
    auroraCollections,
    polygonCollections,
    celoCollections,
    singleAuroraNfts,
    singlePolygonNfts,
    singleCeloNfts,
    params: { collectionName, nftId, chainId },
  } = graphProps;

  if (collectionName) {
    let graphCollections = null;
    if (auroraCollections && polygonCollections && celoCollections) {
      graphCollections = [...(auroraCollections || []), ...(polygonCollections || []), ...(celoCollections || [])];
    }
    // filtering to get the unqiue collection
    let collection = graphCollections.find((col) => col.Id === collectionName);
    if (collection) {
      // filtering to get the unique nft
      const nft = collection.nfts.find((col) => col.id === nftId);

      if (nft) {
        try {
          const nftDetails = await getCeloGraphNft(nft);
          const transactionHistory = await getTransactions(nft.transactions);
          collection = await getGraphCollection(collection.nfts, collection);
          return {
            nftDetails: nftDetails[0],
            collection,
            _1of1: [],
            transactionHistory,
          };
        } catch (error) {
          console.log(error);
        }
      }
    }
  } else {
    try {
      // Fetching for nft by Id comparing it to the chain it belongs to before displaying the Id
      if (supportedChains[Number(chainId)]?.chain === "Celo") {
        const [celoData, trHistory] = await celoUserData(nftId);
        return {
          nftDetails: celoData,
          transactionHistory: trHistory,
          collection: [],
          _1of1: singleCeloNfts,
        };
      }
      if (supportedChains[Number(chainId)]?.chain === "Aurora") {
        const [auroraData, trHistory] = await auroraUserData(nftId);
        // if (!auroraData) return;
        return {
          nftDetails: auroraData,
          collection: [],
          transactionHistory: trHistory,
          _1of1: singleAuroraNfts,
        };
      }
      if (supportedChains[Number(chainId)]?.chain === "Polygon") {
        const [polygonData, trHistory] = await polygonUserData(nftId);
        // if (!polygonData) return history.goBack();
        return {
          nftDetails: polygonData,
          collection: [],
          transactionHistory: trHistory,
          _1of1: singlePolygonNfts,
        };
      }
    } catch (error) {
      console.log({ error });
    }
  }
};

export const getCreator = async (owner) => {
  if (owner) return await readUserProfile(owner);
  return {};
};

export const breakAddress = (address = "", width = 6) => {
  return address && `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const getFormatedTxDate = (txDate) => {
  let newDate = null;
  if (typeof txDate === "object") {
    newDate = txDate.seconds;
  } else {
    newDate = txDate;
  }
  const now = new Date();
  const date = new Date(newDate * 1000);
  const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  if (diff < 0.04) return `${parseInt(diff * 24 * 60)} mins ago`;
  if (diff < 1) return `${parseInt(diff * 24)} hours ago`;
  if (diff < 31) return `${parseInt(diff)} days ago`;
  if (diff < 356) return `${parseInt(diff / 30)} months ago`;
  return `${diff / 30 / 12} years ago`;
};
