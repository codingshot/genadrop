/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import fileDownload from "js-file-download";
// eslint-disable-next-line import/no-unresolved
import worker from "workerize-loader!../worker"; // eslint-disable-line import/no-webpack-loader-syntax
import { getAlgoData } from "./arc_ipfs";
import { readSIngleUserNft } from "./firebase";
import blankImage from "../assets/blank.png";

export const getNftCollections = async (collections, mainnet) => {
  const collectionArr = [];
  for (let i = 0; i < collections.length; i += 1) {
    try {
      const collectionObj = {};
      collectionObj.name = collections[i].name;
      collectionObj.price = collections[i].price;
      collectionObj.owner = collections[i].owner;
      collectionObj.description = collections[i].description;

      const { data } = await axios.get(collections[i].url.replace("ipfs://", "https://ipfs.io/ipfs/"));

      collectionObj.number_of_nfts = data.length;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, data[0]);
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      collectionObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      collectionArr.push(collectionObj);
    } catch (error) {
      console.log(error);
    }
  }
  return collectionArr;
};

export const getNftCollection = async (collection, mainnet) => {
  const nftArr = [];
  const { data } = await axios.get(collection.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
  for (let i = 0; i < data.length; i += 1) {
    try {
      const nftObj = {};
      nftObj.collection_name = collection.name;
      nftObj.owner = collection.owner;
      nftObj.price = collection.price;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, data[i]);
      nftObj.algo_data = params;
      nftObj.Id = data[i];
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      const assetInfo = await readSIngleUserNft(collection.owner, data[i]);
      nftObj.sold = assetInfo.sold;
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

export const getUserNftCollection = async (mainnet, data) => {
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
export const getUserCollectedNftCollection = async (mainnet, data) => {
  const nftArr = [];
  for (let i = 0; i < data?.length; i += 1) {
    try {
      const nftObj = {};
      nftObj.collection_name = data[i].collection;
      nftObj.price = data[i].price;
      nftObj.buyer = data[i].Buyer;
      nftObj.sold = data[i].sold;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, data[i].id);
      nftObj.Id = data[i].id;
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      nftObj.name = response.data.name;
      nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      nftArr.push(nftObj);
    } catch (error) {
      console.error(error);
    }
  }
  return nftArr;
};

export const getSingleNfts = async (mainnet, nfts) => {
  const nftArr = [];
  for (let i = 0; i < nfts.length; i += 1) {
    try {
      const nftObj = {};
      nftObj.Id = nfts[i].id;
      nftObj.price = nfts[i].price;
      nftObj.buyer = nfts[i].buyer;
      nftObj.owner = nfts[i].owner;
      nftObj.sold = nfts[i].sold;
      nftObj.dateSold = nfts[i].dateSold;
      nftObj.description = nfts[i].description;
      nftObj.mainnet = nfts[i].mainnet;
      const {
        asset: { params },
      } = await getAlgoData(mainnet, nfts[i].id);
      const response = await axios.get(params.url.replace("ipfs://", "https://ipfs.io/ipfs/"));
      nftObj.image_url = response.data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      nftObj.name = response.data.name;
      nftObj.description = response.data.description;
      nftArr.push(nftObj);
    } catch (error) {
      console.error("get collection result failed");
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

export const getNftData = async (mainnet, collection, assetName) => {
  const collectionData = await getNftCollection(mainnet, collection);
  return collectionData.find((asset) => asset.name === assetName);
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
