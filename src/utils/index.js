/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import {
  getAlgoData,
  purchaseArbitrumNfts,
  purchaseAuroraNfts,
  purchaseAvaxNfts,
  purchaseCeloNfts,
  PurchaseNft,
  purchasePolygonNfts,
} from "./arc_ipfs";
import { fetchUserNfts, readSIngleUserNft } from "./firebase";
import blankImage from "../assets/blank.png";
import {
  clearLayers,
  setAlgoCollections,
  setAlgoSingleNfts,
  setOverlay,
  setNotification,
  setCollectionName,
  clearRule,
  clearPreview,
  setCurrentSession,
  setLayerAction,
  setImageAction,
  setNftLayers,
  setActionProgress,
  setCurrentPlan,
} from "../gen-state/gen.actions";
import supportedChains from "./supportedChains";

const PRICE_CONVERSION_VALUE = 0.000000000000000001;
// setting a delay as not exceed the API limit
const getDelayTime = (index, data, batch) => {
  const reqPagination = [...new Array(Math.floor(data.length / batch) + 1)].map((_, idx) => (idx + 1) * batch);
  for (const base of reqPagination) {
    if (index < base) {
      return (Math.floor(base / batch) - 1) * 1000;
    }
  }
};
// Fetch Single NFTs
function fetchNFT(NFT, mainnet) {
  const fetch = async (resolve, reject) => {
    try {
      const nftObj = {};
      nftObj.Id = NFT.id;
      nftObj.price = NFT.price;
      nftObj.buyer = NFT.Buyer;
      nftObj.owner = NFT.owner;
      nftObj.sold = NFT.sold;
      nftObj.createdAt = new Date(NFT.createdAt.seconds * 1000);
      nftObj.dateSold = NFT.dateSold;
      nftObj.isListed = NFT.isListed;
      nftObj.manager = NFT.manager;
      nftObj.description = NFT.description;
      nftObj.mainnet = NFT.mainnet;
      const { params } = await getAlgoData(mainnet, NFT.id);
      const urlIPF = params.url.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
      nftObj.url = params.url;
      const response = await axios.get(urlIPF);
      nftObj.image_url = response.data.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
      nftObj.name = response.data.name;
      nftObj.description = response.data.description;
      nftObj.chain = 4160;
      nftObj.properties = response.data.properties;
      resolve(nftObj);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  };
  return new Promise((resolve, reject) => {
    fetch(resolve, reject);
  });
}

// Fetch Collections
function fetchCollection(collection, mainnet) {
  const fetch = async (resolve, reject) => {
    try {
      const collectionObj = {};
      collectionObj.name = collection.name;
      collectionObj.price = collection.price;
      collectionObj.owner = collection.owner;
      collectionObj.description = collection.description;
      collectionObj.url = collection.url;
      collectionObj.createdAt = new Date(collection?.createdAt?.seconds * 1000);
      const urlIPF = collection.url.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
      const { data } = await axios.get(urlIPF);
      collectionObj.nfts = data;

      const { params } = await getAlgoData(mainnet, data[0]);
      const response = await axios.get(params.url.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/"));
      collectionObj.image_url = response.data.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
      collectionObj.chain = 4160;
      resolve(collectionObj);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  };
  return new Promise((resolve, reject) => {
    fetch(resolve, reject);
  });
}

export const getGraphCollections = async (collections) => {
  function fetchAuroraCollection(collection) {
    const fetch = async (resolve, reject) => {
      try {
        const collectionObj = {};
        const { data } = await axios.get(
          collection?.nfts[0].tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
        );
        collectionObj.image_url = data?.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");

        collectionObj.name = collection?.name;
        collectionObj.owner = collection?.creator?.id;
        collectionObj.Id = collection?.id;
        const getPrice = collection?.nfts.map((col) => col.price).reduce((a, b) => (a < b ? a : b));
        const chain = collection?.nfts?.map((col) => col.chain).reduce((a, b) => a === b && a);
        collectionObj.chain = chain;
        collectionObj.price = (getPrice * PRICE_CONVERSION_VALUE).toString();
        collectionObj.description = collection?.description;
        collectionObj.isListed = collection?.isListed ? collection?.isListed : false;
        collectionObj.nfts = collection?.nfts;
        collectionObj.createdAt = new Date(Number(collection?.nfts?.[0].createdAtTimestamp) * 1000);
        collectionObj.transactions = collection?.nfts?.transactions;
        resolve(collectionObj);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    };
    return new Promise((resolve, reject) => {
      fetch(resolve, reject);
    });
  }
  const collectionsArr = [];
  if (collections) {
    const responses = await Promise.allSettled(collections.map((collection) => fetchAuroraCollection(collection)));
    responses.forEach((element) => {
      if (element?.status === "fulfilled") {
        collectionsArr.push(element.value);
      }
    });
  }
  return collectionsArr;
};

export const getCeloGraphCollections = async (collections) => {
  function fetchAuroraCollection(collection) {
    const fetch = async (resolve, reject) => {
      try {
        const collectionObj = {};
        const { data } = await axios.get(
          collection?.nfts[0].tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
        );
        collectionObj.image_url = data?.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");

        collectionObj.name = collection?.name;
        collectionObj.owner = collection?.id;
        const getPrice = collection?.nfts.map((col) => col.price).reduce((a, b) => (a < b ? a : b));
        const chain = collection?.nfts?.map((col) => col.chain).reduce((a, b) => a === b && a);
        collectionObj.chain = chain;
        collectionObj.price = getPrice;
        collectionObj.description = collection?.description;
        collectionObj.nfts = collection?.nfts;
        resolve(collectionObj);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    };
    return new Promise((resolve, reject) => {
      fetch(resolve, reject);
    });
  }
  const collectionsArr = [];
  if (collections) {
    const responses = await Promise.allSettled(collections.map((collection) => fetchAuroraCollection(collection)));
    responses.forEach((element) => {
      if (element?.status === "fulfilled") {
        collectionsArr.push(element.value);
      }
    });
  }
  return collectionsArr;
};

export const getNftCollections = async ({ collections, mainnet, dispatch }) => {
  const responses = await Promise.allSettled(collections.map((collection) => fetchCollection(collection, mainnet)));

  // removing rejected responses
  const collectionsObj = {};
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      collectionsObj[element.value.name.trimEnd()] = element.value;
    }
  });
  dispatch(setAlgoCollections(collectionsObj));
  return collectionsObj;
};

export const getUserNftCollections = async ({ collections, mainnet }) => {
  const responses = await Promise.allSettled(collections.map((collection) => fetchCollection(collection, mainnet)));
  // removing rejected responses
  const collectionsArr = [];
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      collectionsArr.push(element.value);
    }
  });
  return collectionsArr;
};

export const getSingleNfts = async ({ mainnet, singleNfts, dispatch }) => {
  const responses = await Promise.allSettled(singleNfts.map((NFT) => fetchNFT(NFT, mainnet)));
  const nftArr = [];
  const nftsObj = {};
  // removing rejected responses
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      nftArr.push(element.value);
      nftsObj[element.value.Id] = element.value;
    }
  });
  dispatch(setAlgoSingleNfts(nftsObj));
  return nftsObj;
};

export const getUserSingleNfts = async ({ mainnet, singleNfts }) => {
  const _1of1 = singleNfts?.filter((s) => !s.collection);
  const responses = await Promise.allSettled(_1of1?.map((NFT) => fetchNFT(NFT, mainnet)));
  const nftArr = [];
  // // removing rejected responses
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      nftArr.push(element.value);
    }
  });
  return nftArr;
};

export const getNftCollection = async ({ collection, mainnet }) => {
  const urlIPF = collection.url.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
  const { data } = await axios.get(urlIPF);

  function fetchCollectionNFT(id, idx) {
    return new Promise((resolve, reject) => {
      const delay = getDelayTime(idx, data, 60);
      setTimeout(async () => {
        try {
          const { params } = await getAlgoData(mainnet, id);
          const nftObj = {};
          nftObj.collection_name = collection.name;
          nftObj.owner = collection.owner;
          nftObj.price = collection.price;
          nftObj.algo_data = params;
          nftObj.Id = id;
          const url = params.url.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
          const response = await axios.get(url);

          const assetInfo = await readSIngleUserNft(collection.owner, id);

          nftObj.sold = assetInfo.sold;
          nftObj.ipfs_data = response.data;
          nftObj.name = response.data.name;
          nftObj.image_url = response.data.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
          nftObj.chain = 4160;
          resolve(nftObj);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }, delay);
    });
  }

  const responses = await Promise.allSettled(data.map((id, idx) => fetchCollectionNFT(id, idx)));
  const nftArr = [];
  const nftsObj = {};
  // removing rejected responses
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      nftArr.push(element.value);
      const nftObj = element.value;
      nftsObj[nftObj.Id] = nftObj;
    }
  });
  window.localStorage.activeCollection = JSON.stringify({ ...nftsObj });

  return { NFTCollection: nftArr, loadedChain: 4160 };
  // handleSetState({
  //   NFTCollection: nftArr,
  //   loadedChain: 4160,
  // });
  // dispatch(setActiveCollection(nftArr));
};

export const getGraphCollection = async (collection, mainnet) => {
  const nftArr = [];
  if (collection) {
    for (let i = 0; i < collection?.length; i++) {
      const { data } = await axios.get(
        collection[i].tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
      );
      try {
        const nftObj = {};
        nftObj.collection_name = mainnet.name;
        nftObj.description = mainnet.description;
        nftObj.chain = collection[i].chain;
        nftObj.owner = collection[i]?.owner?.id;
        nftObj.Id = collection[i].id;
        const getPrice = collection.map((col) => col.price).reduce((a, b) => (a < b ? a : b));
        nftObj.collectionPrice = getPrice * PRICE_CONVERSION_VALUE;
        nftObj.price = collection[i].price * PRICE_CONVERSION_VALUE;
        nftObj.sold = collection[i].isSold;
        nftObj.ipfs_data = data;
        nftObj.name = data.name;
        nftObj.image_url = data.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
        nftArr.push(nftObj);
        window.localStorage.activeCollection = JSON.stringify({ ...nftObj });
      } catch (error) {
        console.log(error);
      }
    }
  }
  return nftArr;
};

const getDate = (newDate) => {
  const now = new Date();
  const date = new Date(newDate * 1000);
  const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  if (diff < 0.04) return `${parseInt(diff * 24 * 60)} mins ago`;
  if (diff < 1) return `${parseInt(diff * 24)} hours ago`;
  if (diff < 31) return `${parseInt(diff)} days ago`;
  if (diff < 356) return `${parseInt(diff / 30)} months ago`;
  return `${diff / 30 / 12} years ago`;
};

export const getGraphTransactionHistory = async (transactions) => {
  const transactionArr = [];
  if (transactions) {
    for (let i = 0; i < transactions.length; i++) {
      try {
        const transactionObj = {};
        transactionObj.type = transactions[i].type;
        const newDate = getDate(transactions[i].txDate);
        transactionObj.date = newDate;
        transactionObj.price = transactions[i].price;
        transactionObj.from = transactions[i].from?.id;
        transactionObj.to = transactions[i].to?.id;
        transactionObj.id = transactions[i].txId;
        transactionArr.push(transactionObj);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return transactionArr;
};

export const getFormatedPrice = async (id) => {
  const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
  return Object.values(res?.data)[0]?.usd;
};

export const getTransactions = async (transactions) => {
  const trnArr = [];
  for (let i = 0; i < transactions?.length; i++) {
    try {
      const trnObj = {};
      (trnObj.buyer = transactions[i]?.to?.id),
        (trnObj.price = transactions[i]?.price * PRICE_CONVERSION_VALUE),
        (trnObj.seller = transactions[i].from?.id),
        (trnObj.txDate = Number(transactions[i]?.txDate)),
        (trnObj.txId = transactions[i]?.txId),
        (trnObj.type = transactions[i]?.type);
      trnArr.push(trnObj);
    } catch (error) {}
  }
  return trnArr;
};

export const getUserGraphNft = async (collections, address) => {
  function fetchUserNfts(collection) {
    const fetch = async (resolve, reject) => {
      try {
        const { data } = await axios.get(
          collection.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
        );
        const nftObj = {};
        // nftObj.collection_name = collection?.owner.collections[0]?.name;
        nftObj.owner = address;
        nftObj.chain = collection?.chain;
        nftObj.Id = collection?.id;
        nftObj.collectionId = collection?.collection?.id;
        nftObj.tokenID = collection?.tokenID;
        const getPrice = collection?.price;
        nftObj.collectionPrice = getPrice * PRICE_CONVERSION_VALUE;
        nftObj.price = collection?.price * PRICE_CONVERSION_VALUE;
        nftObj.sold = collection?.isSold;
        nftObj.ipfs_data = data;
        nftObj.contractAddress = collection?.id?.split(collection?.tokenID)[0];
        nftObj.collection_contract = collection?.id?.split(collection?.tokenID)[0];
        nftObj.name = data?.name;
        nftObj.image_url = data?.image?.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
        resolve(nftObj);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    };
    return new Promise((resolve, reject) => {
      fetch(resolve, reject);
    });
  }

  const nftArr = [];
  if (collections) {
    const responses = await Promise.allSettled(collections.map((collection) => fetchUserNfts(collection)));
    responses.forEach((element) => {
      if (element?.status === "fulfilled") {
        nftArr.push(element.value);
      }
    });
  }
  return nftArr;
};

export const getCeloGraphNft = async (collection) => {
  const { data } = await axios.get(
    collection?.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
  );
  const nftObj = [];
  try {
    const nftArr = {};
    nftArr.collection_name = collection?.collection?.name;
    nftArr.collection_contract = collection?.id?.split(collection?.tokenID)[0];
    nftArr.name = data?.name;
    nftArr.chain = collection?.chain;
    nftArr.owner = collection?.owner?.id;
    nftArr.price = collection?.price * PRICE_CONVERSION_VALUE;
    nftArr.isListed = collection?.isListed;
    nftArr.image_url = data?.image?.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
    nftArr.ipfs_data = data;
    nftArr.sold = collection?.isSold;
    nftArr.description = data?.description;
    nftObj.contractAddress = collection?.id?.split(collection?.tokenID)[0];
    nftArr.Id = collection?.id;
    nftArr.tokenID = collection?.tokenID;
    nftArr.marketId = collection?.marketId;
    nftArr.properties = data?.properties;
    nftObj.push(nftArr);
  } catch (error) {
    console.log(error);
  }

  return nftObj;
};

export const getGraphNft = async (collection, mainnet) => {
  const { data } = await axios.get(
    collection?.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
  );
  const nftObj = [];
  try {
    const nftArr = {};
    nftArr.collection_name = collection?.collection?.name;
    nftArr.collection_contract = collection?.id?.split(collection?.tokenID)[0];
    nftArr.name = data?.name;
    nftArr.chain = collection?.chain;
    nftArr.owner = collection?.owner?.id;
    nftArr.isListed = collection?.isListed;
    nftArr.price = collection?.price * PRICE_CONVERSION_VALUE;
    nftArr.image_url = data?.image?.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
    nftArr.ipfs_data = data;
    nftArr.sold = collection?.isSold;
    nftArr.description = data?.description;
    nftArr.Id = collection?.id;
    nftArr.tokenID = collection?.tokenID;
    nftArr.marketId = collection?.marketId;
    nftArr.properties = data?.properties;
    nftObj.push(nftArr);
  } catch (error) {
    console.log(error);
  }

  return nftObj;
};

export const getNearNft = async (collection, mainnet) => {
  const { data } = await axios.get(
    collection?.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
  );
  const nftObj = [];
  try {
    const nftArr = {};
    nftArr.collection_name = collection?.collection?.name;
    nftArr.creator = collection?.collection?.creator?.id;
    nftArr.collection_contract = collection?.id?.split(collection?.tokenID)[0];
    nftArr.name = data?.name;
    nftArr.chain = collection?.chain;
    nftArr.owner = collection?.owner?.id;
    nftArr.price = collection?.price * PRICE_CONVERSION_VALUE;
    nftArr.image_url = data?.image?.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
    nftArr.ipfs_data = data;
    nftArr.sold = collection?.isSold;
    nftArr.description = data?.description;
    nftArr.Id = collection?.id;
    nftArr.tokenID = collection?.tokenID;
    nftArr.marketId = collection?.marketId;
    nftArr.properties = data?.properties;
    nftObj.push(nftArr);
  } catch (error) {
    console.log(error);
  }

  return nftObj;
};

export const getUserBoughtNftCollection = async (mainnet, data) => {
  const responses = await Promise.allSettled(data.map((NFT) => fetchNFT(NFT, mainnet)));
  const nftArr = [];
  // removing rejected responses
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      nftArr.push(element.value);
    }
  });
  return nftArr;
};

export const getSingleGraphNfts = async (nfts) => {
  function fetchGraphNFT(NFT, idx, singleNfts) {
    return new Promise((resolve, reject) => {
      const delay = getDelayTime(idx, singleNfts, 60);
      setTimeout(async () => {
        try {
          const nftObj = {};
          const { data } = await axios.get(
            NFT.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
          );
          nftObj.Id = NFT?.id;
          nftObj.price = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.owner = NFT?.owner?.id;
          nftObj.sold = NFT?.isSold;
          nftObj.isListed = NFT?.isListed;
          nftObj.chain = NFT?.chain;
          nftObj.description = data?.description;
          nftObj.image_url = data?.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
          nftObj.name = data?.name;
          nftObj.collectionId = NFT?.collection?.id;
          nftObj.collectionPrice = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.price = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.tokenID = NFT?.tokenID;
          nftObj.createdAt = new Date(Number(NFT?.createdAtTimestamp) * 1000);
          nftObj.ipfs_data = data;
          nftObj.collection_contract = NFT?.id?.split(NFT?.tokenID)[0];
          nftObj.contractAddress = NFT?.id?.split(NFT?.tokenID)[0];
          resolve(nftObj);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }, delay);
    });
  }
  const responses = await Promise.allSettled(nfts.map((NFT, idx) => fetchGraphNFT(NFT, idx, nfts)));
  const nftArr = [];
  // removing rejected responses
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      nftArr.push(element.value);
    }
  });
  return nftArr;
};

export const getNearSingleGraphNfts = async (nfts) => {
  function fetchGraphNFT(NFT, idx, singleNfts) {
    return new Promise((resolve, reject) => {
      const delay = getDelayTime(idx, singleNfts, 60);
      setTimeout(async () => {
        try {
          const nftObj = {};
          const { data } = await axios.get(
            NFT.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
          );
          nftObj.Id = NFT?.id;
          nftObj.price = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.owner = NFT?.owner?.id;
          nftObj.sold = NFT?.isSold;
          nftObj.chain = NFT?.chain;
          nftObj.description = data?.description;
          nftObj.image_url = data?.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
          nftObj.name = data?.name;
          nftObj.collectionId = NFT?.collection?.id;
          nftObj.collectionPrice = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.price = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.tokenID = NFT?.tokenID;
          nftObj.ipfs_data = data;
          nftObj.collection_contract = NFT?.id?.split(NFT?.tokenID)[0];
          nftObj.contractAddress = NFT?.id?.split(NFT?.tokenID)[0];
          resolve(nftObj);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }, delay);
    });
  }
  if (nfts?.length) {
    const responses = await Promise.allSettled(nfts?.map((NFT, idx) => fetchGraphNFT(NFT, idx, nfts)));
    const nftArr = [];
    // removing rejected responses
    responses.forEach((element) => {
      if (element?.status === "fulfilled") {
        nftArr.push(element.value);
      }
    });
    return nftArr;
  }
};

export const fetchNearSingleNfts = async (nfts) => {
  function fetchGraphNFT(NFT, idx, singleNfts) {
    return new Promise((resolve, reject) => {
      const delay = getDelayTime(idx, singleNfts, 60);
      setTimeout(async () => {
        try {
          const nftObj = {};
          const { data } = await axios.get(
            NFT.tokenIPFSPath.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/")
          );
          nftObj.Id = NFT?.id;
          nftObj.price = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.owner = NFT?.owner?.id;
          nftObj.sold = NFT?.isSold;
          nftObj.chain = NFT?.chain;
          nftObj.description = data?.description;
          nftObj.image_url = data?.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
          nftObj.name = data?.name;
          nftObj.collectionId = NFT?.collection?.id;
          nftObj.collectionPrice = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.price = NFT?.price * PRICE_CONVERSION_VALUE;
          nftObj.tokenID = NFT?.tokenID;
          nftObj.createdAt = new Date(Number(NFT?.createdAtTimestamp) * 1000);
          nftObj.ipfs_data = data;
          nftObj.collection_contract = NFT?.id?.split(NFT?.tokenID)[0];
          nftObj.contractAddress = NFT?.id?.split(NFT?.tokenID)[0];
          resolve(nftObj);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }, delay);
    });
  }
  if (nfts?.length) {
    const responses = await Promise.allSettled(nfts?.map((NFT, idx) => fetchGraphNFT(NFT, idx, nfts)));
    const nftArr = [];
    // removing rejected responses
    responses.forEach((element) => {
      if (element?.status === "fulfilled") {
        nftArr.push(element.value);
      }
    });
    return nftArr;
  }
};

export const getSingleNftDetails = async (mainnet, nft) => {
  const nftDetails = {};
  try {
    nftDetails.Id = nft.id;
    nftDetails.price = nft.price;
    nftDetails.buyer = nft.buyer;
    nftDetails.owner = nft.owner;
    nftDetails.sold = nft.sold;
    nftDetails.dateSold = nft.dateSold;
    nftDetails.description = nft.description;
    const { params } = await getAlgoData(mainnet, nft.id);
    const response = await axios.get(params.url.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/"));
    nftDetails.image_url = response.data.image.replace("ipfs://", "https://genadrop.mypinata.cloud/ipfs/");
    nftDetails.name = response.data.name;
    nftDetails.description = response.data.description;
    nftDetails.properties = response.data.properties;
  } catch (error) {
    console.error("get collection result failed");
  }
  return nftDetails;
};

export const buyGraphNft = async (buyProps) => {
  const {
    dispatch,
    history,
    account,
    nftDetails: { chain },
    chainId,
  } = buyProps;

  if (!account) {
    return dispatch(
      setNotification({
        message: `Please, connect your wallet to ${supportedChains[chain].label} network and try again.`,
        type: "error",
      })
    );
  }

  if (chainId != chain) {
    return dispatch(
      setNotification({
        message: `Please, connect your wallet to ${supportedChains[chain].label} network and try again.`,
        type: "warning",
      })
    );
  }
  if (supportedChains[chainId].chain === "Celo") {
    dispatch(setOverlay(true));
    const res = await purchaseCeloNfts(buyProps);
    if (res) {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction successful",
          type: "success",
        })
      );
      setTimeout(() => {
        history.push(`/profile/${chainId}/${account}`);
      }, 3000);
    } else {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction failed",
          type: "error",
        })
      );
    }
  } else if (supportedChains[chainId].chain === "Aurora") {
    dispatch(setOverlay(true));
    const res = await purchaseAuroraNfts(buyProps);
    if (res) {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction successful",
          type: "success",
        })
      );
      setTimeout(() => {
        history.push(`/profile/${chainId}/${account}`);
        // history.push(`/marketplace`);
      }, 3000);
    } else {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction failed",
          type: "error",
        })
      );
    }
  } else if (supportedChains[chainId].chain === "Arbitrum") {
    dispatch(setOverlay(true));
    const res = await purchaseArbitrumNfts(buyProps);
    if (res) {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction successful",
          type: "success",
        })
      );
      setTimeout(() => {
        history.push(`/profile/${chainId}/${account}`);
        // history.push(`/marketplace`);
      }, 3000);
    } else {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction failed",
          type: "error",
        })
      );
    }
  } else if (supportedChains[chainId].chain === "Avalanche") {
    dispatch(setOverlay(true));
    const res = await purchaseAvaxNfts(buyProps);
    if (res) {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction successful",
          type: "success",
        })
      );
      setTimeout(() => {
        history.push(`/profile/${chainId}/${account}`);
        // history.push(`/marketplace`);
      }, 3000);
    } else {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction failed",
          type: "error",
        })
      );
    }
  } else {
    dispatch(setOverlay(true));
    const res = await purchasePolygonNfts(buyProps);
    if (res) {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction successful",
          type: "success",
        })
      );
      setTimeout(() => {
        history.push(`/profile/${chainId}/${account}`);
        // history.push(`/marketplace`);
      }, 3000);
    } else {
      dispatch(setOverlay(false));
      dispatch(
        setNotification({
          message: "transaction failed",
          type: "error",
        })
      );
    }
  }
};

export const buyNft = async (buyProps) => {
  const {
    dispatch,
    history,
    account,
    nftDetails: { chain },
    chainId,
  } = buyProps;

  if (!account) {
    return dispatch(
      setNotification({
        message: `Please, connect your wallet to ${supportedChains[chain].label} network and try again.`,
        type: "error",
      })
    );
  }

  if (chainId !== chain) {
    return dispatch(
      setNotification({
        message: `Please, connect your wallet to ${supportedChains[chain].label} network and try again.`,
        type: "warning",
      })
    );
  }

  dispatch(setOverlay(true));
  const res = await PurchaseNft(buyProps);

  if (res) {
    dispatch(setOverlay(false));
    dispatch(
      setNotification({
        message: "transaction successful",
        type: "success",
      })
    );
    setTimeout(() => {
      history.push(`/profile/${chainId}/${account}`);
      // history.push(`/marketplace`);
    }, 3000);
  } else {
    dispatch(setOverlay(false));
    dispatch(
      setNotification({
        message: "transaction failed",
        type: "error",
      })
    );
  }
};

export const getImageSize = async (img) =>
  new Promise((resolve) => {
    const image = new Image();
    if (typeof img === "string") {
      image.src = img;
    } else {
      image.src = URL.createObjectURL(img);
    }
    image.onload = () => {
      resolve({ height: image.height, width: image.width });
    };
  });

export const getDefaultName = (nameId) => {
  let id = nameId;
  id = String(id);
  if (id.length < 4) {
    const repeatBy = 4 - id.length;
    return `#${"0".repeat(repeatBy)}${id}`;
  }
  return `#${id}`;
};

export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return blob;
};

export const getFile = async (url, name = "image", type = "image/png") => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], name, { type });
  return file;
};

export const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export const handleImage = async (props) => {
  const { canvas, images, image } = props;
  const { height, width } = await getImageSize(image);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  for (const img of images) {
    const resImage = await new Promise((resolve) => {
      const newImage = new Image();
      newImage.src = URL.createObjectURL(img);
      newImage.onload = () => {
        resolve(newImage);
      };
    });
    if (resImage) ctx.drawImage(resImage, 0, 0, width, height);
  }
};

export const handleBlankImage = async (props) => {
  const { img, canvas } = props;
  const { height, width } = await getImageSize(img);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  const image = await new Promise((resolve) => {
    const newImage = new Image();
    newImage.src = blankImage;
    newImage.onload = () => {
      resolve(newImage);
    };
  });
  if (image) ctx.drawImage(image, 0, 0, width, height);
};

export const handleTemplateImage = async (props) => {
  const { img, canvas } = props;
  const { height, width } = await getImageSize(img);
  if (height) {
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
  }
  const ctx = canvas.getContext("2d");
  const resImage = await new Promise((resolve) => {
    const newImage = new Image();
    newImage.src = img;
    newImage.crossOrigin = "anonymous";
    newImage.onload = () => {
      resolve(newImage);
    };
  });
  if (resImage) {
    ctx.drawImage(resImage, 0, 0, width, height);
    return true;
  }
  return false;
};

export const reOrderPreview = ({ preview, layers }) => {
  const newPreview = [];
  [...layers].forEach(({ id, traits, layerTitle }) => {
    traits.forEach(({ traitTitle }) => {
      preview.forEach((p) => {
        if (id === p.layerId && traitTitle === p.imageName) {
          newPreview.push({ ...p, layerTitle });
        }
      });
    });
  });
  return newPreview;
};

export const handleResetCreate = ({ dispatch }) => {
  dispatch(setCollectionName(""));
  dispatch(clearLayers());
  dispatch(clearPreview());
  dispatch(clearRule());
  dispatch(setNftLayers([]));
  dispatch(setCurrentSession(null));
  dispatch(setCurrentPlan("free"));
  dispatch(
    setLayerAction({
      type: "",
    })
  );
  dispatch(
    setImageAction({
      type: "",
      value: {},
    })
  );
  dispatch(
    setActionProgress({
      totalCount: 0,
      resetCount: true,
    })
  );
};
