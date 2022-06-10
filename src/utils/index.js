/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import fileDownload from "js-file-download";
// eslint-disable-next-line import/no-unresolved
import worker from "workerize-loader!../worker"; // eslint-disable-line import/no-webpack-loader-syntax
import { getAlgoData, PurchaseNft } from "./arc_ipfs";
import { readSIngleUserNft } from "./firebase";
import blankImage from "../assets/blank.png";
import {
  setActiveCollection,
  setAlgoCollections,
  setAlgoSingleNfts,
  setLoader,
  setLoading,
  setNotification,
} from "../gen-state/gen.actions";
import supportedChains from "./supportedChains";

export const getAuroraCollections = async (collection) => {
  const collectionArr = [];
  if (collection) {
    for (let i = 0; i < collection.length; i += 1) {
      try {
        const collectionObj = {};
        for (let j = 0; j < collection[i].nfts.length; j++) {
          const { data } = await axios.get(
            collection[i]?.nfts[j].tokenIPFSPath.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          collectionObj.image_url = data?.image.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        collectionObj.name = collection[i]?.name;
        collectionObj.owner = collection[i]?.id;
        const getPrice = collection[i]?.nfts.map((col) => col.price).reduce((a, b) => (a < b ? a : b));
        const chain = collection[i]?.nfts?.map((col) => col.chain).reduce((a, b) => a === b && a);
        collectionObj.chain = chain;
        collectionObj.price = getPrice * 0.000000000000000001;
        collectionObj.description = collection[i]?.description;
        collectionObj.nfts = collection[i]?.nfts;
        collectionArr.push(collectionObj);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return collectionArr;
};

export const getNftCollections = async ({ collections, mainnet, dispatch }) => {
  const collectionsObj = {};
  const fixedColl = collections.filter((col) => col.name !== "test1k");
  console.log(fixedColl);
  for (let i = 0; i < fixedColl.length; i += 1) {
    try {
      const collectionObj = {};
      collectionObj.name = fixedColl[i].name;
      collectionObj.price = fixedColl[i].price;
      collectionObj.owner = fixedColl[i].owner;
      collectionObj.description = fixedColl[i].description;
      collectionObj.url = fixedColl[i].url;
      const urlIPF = fixedColl[i].url.replace("ipfs://", "https://ipfs.io/ipfs/");
      const { data } = await axios.get(urlIPF);
      console.log(data);
      if (!data[0]) return;
      collectionObj.nfts = data;
      const { params } = await getAlgoData(mainnet, data[0]);
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      collectionObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      collectionObj.chain = 4160;
      collectionsObj[collectionObj.name.trimEnd()] = collectionObj;
      console.log(collectionsObj);
      dispatch(setAlgoCollections({ ...collectionsObj }));
    } catch (error) {
      console.log(error);
    }
  }
  return collectionsObj;
};

export const getUserNftCollections = async ({ collections, mainnet }) => {
  const collectionsArr = [];
  for (let i = 0; i < collections.length; i += 1) {
    try {
      const collectionObj = {};
      collectionObj.name = collections[i].name;
      collectionObj.price = collections[i].price;
      collectionObj.owner = collections[i].owner;
      collectionObj.description = collections[i].description;
      collectionObj.url = collections[i].url;
      const urlIPF = collections[i].url.replace("ipfs://", "https://ipfs.io/ipfs/");
      const { data } = await axios.get(urlIPF);
      collectionObj.nfts = data;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, data[0]);
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      collectionObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      collectionObj.chain = 4160;
      collectionsArr.push(collectionObj);
    } catch (error) {
      console.log(error);
    }
  }
  return collectionsArr;
};

export const getSingleNfts = async ({ mainnet, singleNfts, dispatch }) => {
  const nftsObj = {};
  for (let i = 0; i < singleNfts?.length; i += 1) {
    try {
      const nftObj = {};
      nftObj.Id = singleNfts[i].id;
      nftObj.price = singleNfts[i].price;
      nftObj.buyer = singleNfts[i].Buyer;
      nftObj.owner = singleNfts[i].owner;
      nftObj.sold = singleNfts[i].sold;
      nftObj.dateSold = singleNfts[i].dateSold;
      nftObj.description = singleNfts[i].description;
      nftObj.mainnet = singleNfts[i].mainnet;
      const { params } = await getAlgoData(mainnet, singleNfts[i].id);
      nftObj.url = params.url;
      const urlIPF = params.url.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await axios.get(urlIPF);
      nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      nftObj.name = response.data.name;
      nftObj.description = response.data.description;
      nftObj.chain = 4160;
      nftObj.properties = response.data.properties;
      nftsObj[nftObj.Id] = nftObj;
      dispatch(setAlgoSingleNfts({ ...nftsObj }));
    } catch (error) {
      console.error("get collection result failed");
    }
  }
  return nftsObj;
};

export const getUserSingleNfts = async ({ mainnet, singleNfts }) => {
  const nftsArr = [];
  for (let i = 0; i < singleNfts?.length; i += 1) {
    try {
      const nftObj = {};
      nftObj.Id = singleNfts[i].id;
      nftObj.price = singleNfts[i].price;
      nftObj.buyer = singleNfts[i].Buyer;
      nftObj.owner = singleNfts[i].owner;
      nftObj.sold = singleNfts[i].sold;
      nftObj.dateSold = singleNfts[i].dateSold;
      nftObj.description = singleNfts[i].description;
      nftObj.mainnet = singleNfts[i].mainnet;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, singleNfts[i].id);
      nftObj.url = params.url;
      const urlIPF = params.url.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await axios.get(urlIPF);
      nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      nftObj.name = response.data.name;
      nftObj.description = response.data.description;
      nftObj.chain = 4160;
      nftObj.properties = response.data.properties;
      nftsArr.push(nftObj);
    } catch (error) {
      console.error("get collection result failed");
    }
  }
  return nftsArr;
};

export const getNftCollection = async ({ collection, mainnet, handleSetState, dispatch }) => {
  const urlIPF = collection.url.replace("ipfs://", "https://ipfs.io/ipfs/");
  console.log(collection);
  const { data } = await axios.get(urlIPF);
  console.log(data);
  const getDelayTime = (index) => {
    const reqPagination = [...new Array(Math.floor(data.length / 60) + 1)].map((_, idx) => (idx + 1) * 60);
    for (const base of reqPagination) {
      if (index < base) {
        console.log((Math.floor(base / 60) - 1) * 1000);
        return (Math.floor(base / 60) - 1) * 1000;
      }
    }
  };

  const start = Date.now();

  function p1(id, idx) {
    return new Promise((resolve, reject) => {
      const delay = getDelayTime(idx);
      setTimeout(async () => {
        try {
          const timeTaken = Date.now() - start;
          console.log(`Total time taken : ${timeTaken} milliseconds`);
          const { params } = await getAlgoData(mainnet, id);
          const nftObj = {};
          nftObj.collection_name = collection.name;
          nftObj.owner = collection.owner;
          nftObj.price = collection.price;
          nftObj.algo_data = params;
          nftObj.Id = id;
          const url = params.url.replace("ipfs://", "https://ipfs.io/ipfs/");
          const response = await axios.get(url);

          const assetInfo = await readSIngleUserNft(collection.owner, id);

          nftObj.sold = assetInfo.sold;
          nftObj.ipfs_data = response.data;
          nftObj.name = response.data.name;
          nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
          // let imgurl = await axios.get(nftObj.image_url, { responseType: "blob" });
          // console.log(imgurl);
          // imgurl = URL.createObjectURL(imgurl.data);
          // console.log(imgurl);
          // nftObj.image_url = imgurl;
          nftObj.chain = 4160;
          resolve(nftObj);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }, delay);
    });
  }
  // const test = await (await axios.get("https://testnet-api.algonode.cloud/v2/assets/94401371")).data.params;
  // console.log(test);
  // const sources = data.map((id) => `https://testnet-api.algonode.cloud/v2/assets/${id}`);
  // const tasks = sources.map(axios.get);
  // const responses = await Promise.allSettled(data.slice(0, 3000).map((id) => fetchNFTs(id)));
  const responses = await Promise.allSettled(data.map((id, idx) => p1(id, idx)));
  const nftArr = [];
  const nftsObj = {};
  responses.forEach((element) => {
    if (element?.status === "fulfilled") {
      nftArr.push(element.value);
      const nftObj = element.value;
      nftsObj[nftObj.Id] = nftObj;
    }
  });
  window.localStorage.activeCollection = JSON.stringify({ ...nftsObj });

  console.log(nftArr);
  handleSetState({
    NFTCollection: nftArr,
    loadedChain: 4160,
  });
  dispatch(setActiveCollection(nftArr));
  // for (let index = 0; index < Math.ceil(nftArr.length / 100) + 1; index += 1) {
  //   setTimeout(() => {
  //     handleSetState({
  //       NFTCollection: nftArr.slice(0, index * 100),
  //       loadedChain: 4160,
  //     });
  //   }, 1500);
  // }
  // dispatch(setActiveCollection(nftArr));
  // window.localStorage.activeCollection = JSON.stringify({ ...nftsObj });
  // const callprice = async () => {
  //   const responses = await Promise.all(IPFSurls.map(async (item) => (await axios.get(item)).data));
  //   console.log(responses);
  //   // now `responses` is an array of the response data
  // };
  // await fetchNFTs(data[0]);
  // const responses = await Promise.allSettled(data.map(async (item) => fetchNFTs(item)));
  // console.log(responses);
  // const callprice = async () => {
  //   const responses = await Promise.all(data.map(async (item) => await fetchNFTs(item)));
  //   console.log(responses);
  //   // now `responses` is an array of the response data
  // };
  // await callprice();
  // axios
  //   .all(IPFSurls)
  //   .then(
  //     axios.spread((...responses) => {
  //       const responseOne = responses[0];
  //       const responseTwo = responses[1];
  //       const responesThree = responses[2];
  //       console.log(responses);
  //       // console.log(responseOne);
  //       // console.log(responseTwo);
  //       // console.log(responesThree);

  //       // use/access the results
  //     })
  //   )
  //   .catch((errors) => {
  //     // react on errors.
  //     console.log(errors);
  //   });
  // for (let i = 0; i < data.length; i += 1) {
  //   try {
  //     const nftObj = {};
  //     nftObj.collection_name = collection.name;
  //     nftObj.owner = collection.owner;
  //     nftObj.price = collection.price;
  //     const {
  //       asset: { params },
  //     } = await getAlgoData(mainnet, data[i]);
  //     nftObj.algo_data = params;
  //     nftObj.Id = data[i];
  //     const urlIPF = params.url.replace("ipfs://", "https://ipfs.io/ipfs/");
  //     const response = await axios.get(urlIPF);

  //     const assetInfo = await readSIngleUserNft(collection.owner, data[i]);

  //     nftObj.sold = assetInfo.sold;
  //     nftObj.ipfs_data = response.data;
  //     nftObj.name = response.data.name;
  //     nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
  //     nftObj.chain = 4160;
  //     nftArr.push(nftObj);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  // return nftArr;
};

// export const getNftCollection = async ({ collection, mainnet, handleSetState, dispatch }) => {
//   const nftArr = [];
//   const nftsObj = {};
//   const urlIPF = collection.url.replace("ipfs://", "https://ipfs.io/ipfs/");
//   const { data } = await axios.get(urlIPF);
//   for (let i = 0; i < data.length; i += 1) {
//     try {
//       const nftObj = {};
//       nftObj.collection_name = collection.name;
//       nftObj.owner = collection.owner;
//       nftObj.price = collection.price;
//       const {
//         asset: { params },
//       } = await getAlgoData(mainnet, data[i]);
//       nftObj.algo_data = params;
//       nftObj.Id = data[i];
//       const urlIPF = params.url.replace("ipfs://", "https://ipfs.io/ipfs/");
//       const response = await axios.get(urlIPF);
//       const assetInfo = await readSIngleUserNft(collection.owner, data[i]);
//       nftObj.sold = assetInfo.sold;
//       nftObj.ipfs_data = response.data;
//       nftObj.name = response.data.name;
//       nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
//       nftObj.chain = 4160;
//       nftArr.push(nftObj);
//       nftsObj[nftObj.Id] = nftObj;
//       handleSetState({
//         NFTCollection: [...nftArr],
//         loadedChain: 4160,
//       });
//       dispatch(setActiveCollection([...nftArr]));
//       window.localStorage.activeCollection = JSON.stringify({ ...nftsObj });
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return nftArr;
// };

export const getGraphCollection = async (collection, mainnet) => {
  const nftArr = [];
  if (collection) {
    for (let i = 0; i < collection?.length; i++) {
      const { data } = await axios.get(collection[i].tokenIPFSPath.replace("ipfs://", "https://ipfs.io/ipfs/"));
      try {
        const nftObj = {};
        nftObj.collection_name = mainnet.name;
        nftObj.description = mainnet.description;
        nftObj.chain = collection[i].chain;
        nftObj.owner = mainnet.id;
        nftObj.Id = collection[i].id;
        const getPrice = collection.map((col) => col.price).reduce((a, b) => (a < b ? a : b));
        nftObj.collectionPrice = getPrice * 0.000000000000000001;
        nftObj.price = collection[i].price * 0.000000000000000001;
        nftObj.sold = collection[i].isSold;
        nftObj.ipfs_data = data;
        nftObj.name = data.name;
        nftObj.image_url = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
        nftArr.push(nftObj);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return nftArr;
};

export const getTransactions = async (transactions) => {
  const trnArr = [];

  for (let i = 0; i < transactions.length; i++) {
    try {
      const trnObj = {};
      (trnObj.buyer = transactions[i]?.buyer?.id),
        (trnObj.price = transactions[i]?.price),
        (trnObj.seller = transactions[i].id),
        (trnObj.txDate = transactions[i]?.txDate),
        (trnObj.txId = transactions[i]?.txId),
        (trnObj.type = transactions[i]?.type);
      trnArr.push(trnObj);
    } catch (error) {}
    return trnArr;
  }
};

export const getGraphNft = async (collection, mainnet) => {
  const { data } = await axios.get(collection?.tokenIPFSPath.replace("ipfs://", "https://ipfs.io/ipfs/"));
  const nftObj = [];
  try {
    const nftArr = {};
    nftArr.collection_name = collection?.collection?.name;
    nftArr.collection_contract = collection?.collection?.id;
    nftArr.name = data?.name;
    nftArr.chain = collection?.chain;
    nftArr.owner = collection?.owner?.id;
    nftArr.price = collection?.price * 0.000000000000000001;
    nftArr.image_url = data?.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
    nftArr.ipfs_data = data;
    nftArr.description = data?.description;
    nftArr.Id = collection?.tokenID;
    nftArr.marketId = collection?.id;
    nftArr.properties = data?.properties;
    nftObj.push(nftArr);
  } catch (error) {
    console.log(error);
  }

  return nftObj;
};

export const getUserBoughtNftCollection = async (mainnet, data) => {
  const nftArr = [];
  for (let i = 0; i < data?.length; i += 1) {
    try {
      const nftObj = {};
      nftObj.collection_name = data[i].collection;
      nftObj.price = data[i].price;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, data[i].id);
      nftObj.algo_data = params;
      nftObj.Id = data[i].id;
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      nftObj.ipfs_data = response.data;
      nftObj.name = response.data.name;
      nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      nftArr.push(nftObj);
    } catch (error) {
      console.error(error);
    }
  }
  return nftArr;
};

export const getSingleGraphNfts = async (nfts) => {
  const nftArr = [];
  for (let i = 0; i < nfts?.length; i++) {
    try {
      const nftObj = {};
      const { data } = await axios.get(nfts[i].tokenIPFSPath.replace("ipfs://", "https://ipfs.io/ipfs/"));
      nftObj.Id = nfts[i]?.id;
      nftObj.price = nfts[i]?.price * 0.000000000000000001;
      nftObj.owner = nfts[i]?.owner?.id;
      nftObj.sold = nfts[i]?.isSold;
      nftObj.chain = nfts[i]?.chain;
      nftObj.description = data?.description;
      nftObj.image_url = data?.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      nftObj.name = data?.name;
      nftArr.push(nftObj);
    } catch (error) {
      console.log(error);
    }
  }
  return nftArr;
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
    const {
      asset: { params },
    } = await getAlgoData(mainnet, nft.id);
    const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
    nftDetails.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    nftDetails.name = response.data.name;
    nftDetails.description = response.data.description;
    nftDetails.properties = response.data.properties;
  } catch (error) {
    console.error("get collection result failed");
  }
  return nftDetails;
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

  dispatch(setLoading(true));
  const res = await PurchaseNft(buyProps);

  if (res) {
    dispatch(setLoading(false));
    dispatch(
      setNotification({
        message: "transaction successful",
        type: "success",
      })
    );
    setTimeout(() => {
      history.push(`/me/${account}`);
      // history.push(`/marketplace`);
    }, 3000);
  } else {
    dispatch(setLoading(false));
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

export const handleImage = async (props) => {
  const { canvas, images, image } = props;
  const { height, width } = await getImageSize(image);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  for (const img of images) {
    const resImage = await new Promise((resolve) => {
      const mewImage = new Image();
      mewImage.src = URL.createObjectURL(img);
      mewImage.onload = () => {
        resolve(mewImage);
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

export const getMockValue = async (val) => {
  const pickerOpts = {
    types: [
      {
        description: "Images",
        accept: {
          "image/*": [".png"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  async function getTheFile() {
    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    const fileData = await fileHandle.getFile();
    return fileData;
  }

  async function getBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    });
  }

  let value = Array(val).fill({
    attributes: [
      {
        image: await getTheFile(),
        rarity: "1",
        trait_type: "a",
        value: "Red Lips.png",
      },
    ],
    description: " #0001",
    id: Date.now(),
    image: await getBase64(await getTheFile()),
    name: "",
  });

  value = value.map((v, id) => ({
    ...v,
    name: `#${id}`,
    description: `description ${id + 1}`,
  }));

  return value;
};

export const handleDownloadWithWorker = async (props) => {
  const { name, outputFormat } = props;
  const mockValue = await getMockValue(500);
  const instance = worker();
  const content = await instance.downloadCallback({
    value: mockValue,
    name,
    outputFormat,
  });
  fileDownload(
    content,
    // eslint-disable-next-line no-constant-condition
    `${"name" ? `${"name"}${true ? "" : `_${"id"}`}.zip` : "collections.zip"}`
  );
};
