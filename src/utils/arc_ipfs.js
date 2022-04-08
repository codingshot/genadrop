/* eslint-disable no-alert */
/* eslint-disable no-await-in-loop */
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import JSZip from "jszip";
import { ethers } from "ethers";

const algosdk = require("algosdk");
const bs58 = require("bs58");

const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_SECRET_KEY;
const pinataSDK = require("@pinata/sdk");

const pinata = pinataSDK(pinataApiKey, pinataApiSecret);
const axios = require("axios");
const FormData = require("form-data");
const config = require("./arc_config");

const algoAddress = config.algodClientUrl;
const algoNode = config.algodNodeUrl;
const algoMainAddress = config.algodMainClientUrl;
const algoMainNode = config.algoMaindNodeUrl;
const { algodClientPort } = config;
const algoToken = config.algodClientToken;
const write = require("./firebase");
const marketAbi = require("./marketAbi.json");

/*
TODO: change conditional addresses once mainnet address is ready!
*/

let algodClient;

let algodTxnClient;

function initAlgoClients(mainnet) {
  algodClient = new algosdk.Algodv2(algoToken, mainnet ? algoMainAddress : algoAddress, algodClientPort);

  algodTxnClient = new algosdk.Algodv2(algoToken, mainnet ? algoMainNode : algoNode, algodClientPort);
}

const mintCollectionAbi = [
  "function createCollection(string memory _name, string memory _symbol, address manager) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)",
];

const mintSingle = [
  "function mint(address to, uint256 id, uint256 amount, string memory uri, bytes memory data) public {}",
];

// const marketAi = ['function getMarketItems() public view {}'];

const mintAbi = [
  "function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}",
];

// const fromHexString = (hexString) =>
// new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

// const toHexString = (bytes) => bytes.reduce((str, byte)
//  => str + byte.toString(16).padStart(2, '0'), '');

const pinFileToIPFS = async (pinataApiIFPSKey, pinataSecretApiKey, file, metadata, option) => {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();
  data.append("file", file);

  data.append("pinataMetadata", metadata);
  data.append("pinataOptions", option);
  return axios
    .post(url, data, {
      maxBodyLength: "Infinity", // this is needed to prevent axios from erroring out with large files
      headers: {
        pinata_api_key: pinataApiIFPSKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      // handle error here
    });
};

const waitForConfirmation = async (txId) => {
  const response = await algodTxnClient.status().do();
  let lastround = response["last-round"];
  const pageConid = true;
  while (pageConid) {
    const pendingInfo = await algodTxnClient.pendingTransactionInformation(txId).do();
    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
      break;
    }
    lastround += 1;
    await algodTxnClient.statusAfterBlock(lastround).do();
  }
};

const convertIpfsCidV0ToByte32 = (cid) => {
  const hex = `${bs58.decode(cid).slice(2).toString("hex")}`;
  const base64 = `${bs58.decode(cid).slice(2).toString("base64")}`;

  const buffer = Buffer.from(bs58.decode(cid).slice(2).toString("base64"), "base64");

  return { base64, hex, buffer };
};

const uploadToIpfs = async (nftFile, nftFileName, asset) => {
  const fileCat = "image";

  const nftFileNameSplit = nftFileName.split(".");
  const fileExt = nftFileNameSplit[1];

  const kvProperties = {
    url: nftFileNameSplit[0],
    mimetype: `image/${fileExt}`,
  };
  const pinataMetadata = JSON.stringify({
    name: asset.name,
    keyvalues: kvProperties,
  });

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });

  const resultFile = await pinFileToIPFS(pinataApiKey, pinataApiSecret, nftFile, pinataMetadata, pinataOptions);

  const metadata = config.arc3MetadataJSON;
  const integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash);
  metadata.properties = [...asset.attributes];
  metadata.name = asset.name;
  metadata.description = asset.description;
  metadata.image = `ipfs://${resultFile.IpfsHash}`;
  metadata.image_integrity = `${integrity.base64}`;
  metadata.image_mimetype = `${fileCat}/${fileExt}`;

  const resultMeta = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: asset.name },
  });
  const jsonIntegrity = convertIpfsCidV0ToByte32(resultMeta.IpfsHash);
  return {
    name: asset.name,
    url: `ipfs://${resultMeta.IpfsHash}`,
    metadata: jsonIntegrity.buffer,
    integrity: jsonIntegrity.base64,
  };
};

export const connectAndMint = async (file, metadata, imgName) => {
  try {
    await pinata.testAuthentication();
    return await uploadToIpfs(file, imgName, metadata);
  } catch (error) {
    console.error(error);
    alert("We encountered issues uploading your file. Pease check your network and try again");
  }
};

async function createAsset(asset, account) {
  const params = await algodTxnClient.getTransactionParams().do();

  const defaultFrozen = false;
  const unitName = "nft";
  const assetName = `${asset.name}@arc3`;
  const { url } = asset;

  const managerAddr = process.env.REACT_APP_GENADROP_MANAGER_ADDRESS;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = process.env.REACT_APP_GENADROP_MANAGER_ADDRESS;
  const decimals = 0;
  const total = 1;
  const { metadata } = asset;
  const metadataUint8Array = new Uint8Array(metadata);

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: account,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: url,
    assetMetadataHash: metadataUint8Array,
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  });
  return txn;
}

async function signTx(connector, txns) {
  let assetID;
  const txnsToSign = txns.map((txn) => {
    const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
    return {
      txn: encodedTxn,
      message: "Nft Minting",
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    };
  });
  const requestParams = [txnsToSign];
  let result;
  try {
    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    alert("please check wallet to confirm transaction");
    result = await connector.send(request);
  } catch (error) {
    alert(error);
    throw error;
  }
  const decodedResult = result.map((element) => (element ? new Uint8Array(Buffer.from(element, "base64")) : null));
  const tx = await algodTxnClient.sendRawTransaction(decodedResult).do();
  await waitForConfirmation(tx.txId);
  const ptx = await algodTxnClient.pendingTransactionInformation(tx.txId).do();
  assetID = ptx["asset-index"];
  return assetID;
}
export async function mintSingleToAlgo(algoMintProps) {
  const { file, metadata, account, connector, dispatch, setNotification, price, mainnet } = algoMintProps;
  initAlgoClients(mainnet);
  if (connector.isWalletConnect && connector.chainId === 4160) {
    dispatch(setNotification("uploading to ipfs"));
    // notification: uploading to ipfs
    const asset = await connectAndMint(file, metadata, file.name);
    const txn = await createAsset(asset, account);
    // notification: asset uploaded, minting in progress
    dispatch(setNotification("asset uploaded, minting in progress"));
    const assetID = await signTx(connector, [txn]);
    await write.writeNft(account, undefined, assetID, price, false, null, null, mainnet);
    // notification: asset minted
    dispatch(setNotification("asset minted successfully"));
    return `https://testnet.algoexplorer.io/asset/${assetID}`;
  }
  return {
    message: "connect to alogrand network on your wallet or select a different network",
  };
}

export async function mintSingleToPoly(singleMintProps) {
  const { file, metadata, price, account, connector, dispatch, setLoader, mainnet } = singleMintProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: "not yet implemented" };
    }
    return {
      message: "please connect to polygon network on your wallet or select a different network",
    };
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, file.name);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    wallet
  );
  let txn;
  try {
    txn = await contract.mint(account, id, 1, asset.url, "0x");
    await txn.wait();
    await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://polygonscan.com/tx/${txn.hash}` : `https://mumbai.polygonscan.com/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function mintSingleToCelo(singleMintProps) {
  const { file, metadata, account, connector, dispatch, setLoader, mainnet } = singleMintProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: "not yet implemented" };
    }
    return {
      message: "please connect to polygon network on your wallet or select a different network",
    };
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, file.name);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  const wallet = new ethers.Wallet(
    mainnet ? process.env.REACT_APP_GENADROP_SERVER_KEY : process.env.REACT_APP_GENADROP_SERVER_KEY,
    connector
  );
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
    marketAbi,
    wallet
  );
  let txn;
  try {
    txn = await contract.mint(account, id, 1, asset.url, "0x");
    dispatch(setLoader(""));
    return mainnet
      ? `https://celo-testnet.org/tx/${txn.hash}`
      : `https://alfajores-blockscout.celo-testnet.org/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function mintSingleToNear(singleMintProps) {
  const { file, metadata, price, account, connector, dispatch, setLoader, mainnet } = singleMintProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: "not yet implemented" };
    }
    return {
      message: "please connect to polygon network on your wallet or select a different network",
    };
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, file.name);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  const wallet = new ethers.Wallet(
    mainnet ? process.env.REACT_APP_GENADROP_SERVER_KEY : process.env.REACT_APP_GENADROP_SERVER_KEY,
    connector
  );
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_NEAR_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_NEAR_TESTNET_MARKET_ADDRESS,
    marketAbi,
    wallet
  );
  let txn;
  try {
    txn = await contract.mint(account, id, 1, asset.url, "0x");
    await txn.wait();
    await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://aurorascan.dev/tx/${txn.hash}` : `https://testnet.aurorascan.dev/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function createNFT(createProps) {
  const { file, dispatch, setNotification, setLoader } = createProps;
  const assets = [];
  const zip = new JSZip();
  const data = await zip.loadAsync(file);

  const files = data.files["metadata.json"];
  const metadataString = await files.async("string");
  const metadata = JSON.parse(metadataString);

  dispatch(setNotification("uploading assets, please do not refresh your page."));
  for (let i = 0; i < metadata.length; i += 1) {
    dispatch(setLoader(`uploading ${i + 1} of ${metadata.length}`));
    const imgName = `${metadata[i].name}.png`;
    const imgFile = data.files[imgName];
    const uint8array = await imgFile.async("uint8array");
    const blob = new File([uint8array], imgName, { type: "image/png" });
    const asset = await connectAndMint(blob, metadata[i], imgName);
    assets.push(asset);
  }
  dispatch(setLoader(""));
  dispatch(setNotification("uploaded successfully"));
  return assets;
}

export async function initializeContract(contractProps) {
  const { minterAddress, marketAddress, fileName, connector, account, dispatch, setLoader } = contractProps;
  const name = fileName.split("-")[0];
  const signer = await connector.getSigner();
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  const tx = await collectionContract.createCollection(name, name.substring(0, 3).toUpperCase(), marketAddress);
  dispatch(setLoader("minting"));
  await tx.wait();
  dispatch(setLoader(""));
  const getCollectionAddresses = await collectionContract.collectionsOf(account);
  const collectionAddresses = [...getCollectionAddresses];
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  return contract;
}

export async function mintToAlgo(algoProps) {
  const { price, account, connector, fileName, description, dispatch, setNotification, setLoader, mainnet } = algoProps;
  initAlgoClients(mainnet);
  if (connector.isWalletConnect && connector.chainId === 4160) {
    const ipfsJsonData = await createNFT({ ...algoProps });
    const collection_id = [];
    const txns = [];
    dispatch(setNotification("preparing assets for minting"));
    for (let i = 0; i < ipfsJsonData.length; i += 1) {
      dispatch(setLoader(`minting ${i + 1} of ${ipfsJsonData.length}`));
      const txn = await createAsset(ipfsJsonData[i], account);
      txns.push(txn);
    }

    const txgroup = algosdk.assignGroupID(txns);

    const groupId = txgroup[0].group.toString("base64");
    dispatch(setLoader("finalizing"));
    const assetID = await signTx(connector, txns);
    for (let nfts = 0; nfts < ipfsJsonData.length; nfts += 1) {
      collection_id.push(assetID + nfts);
    }
    const collectionHash = await pinata.pinJSONToIPFS(collection_id, {
      pinataMetadata: { name: "collection" },
    });
    const collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
    await write.writeUserData(account, collectionUrl, fileName, collection_id, price, description, mainnet);
    dispatch(setLoader(""));
    dispatch(setNotification("you have successfully minted your NFTs"));
    return `https://testnet.algoexplorer.io/tx/group/${groupId}`;
  }
  dispatch(setNotification("connect wallet to algorand network or select a different chain"));
}

export async function mintToCelo(celoProps) {
  const { account, connector, fileName, dispatch, setNotification, setLoader, mainnet } = celoProps;
  if (typeof window.ethereum !== "undefined") {
    const ipfsJsonData = await createNFT({ ...celoProps });
    dispatch(setNotification("preparing assets for minting"));
    const contract = await initializeContract({
      minterAddress: mainnet
        ? process.env.REACT_APP_CELO_MAINNET_MINTER_ADDRESS
        : process.env.REACT_APP_CELO_TESTNET_MINTER_ADDRESS,
      marketAddress: mainnet
        ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
      fileName,
      connector,
      account,
      dispatch,
      setLoader,
    });
    const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
    await connector.getSigner();
    const marketContract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
      marketAbi,
      wallet
    );
    const uris = ipfsJsonData.map((asset) => asset.url);
    const ids = ipfsJsonData.map((asset) => {
      const uintArray = asset.metadata.toLocaleString();
      return parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    });

    const amounts = new Array(ids.length).fill(1);
    let tx;
    dispatch(setLoader("finalizing"));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, "0x");
      await tx.wait();
    } catch (error) {
      console.log(error);
      dispatch(setLoader(""));
      return;
    }
    dispatch(setLoader(""));
    dispatch(setNotification("NFTs successfully minted."));
    return mainnet
      ? `https://blockscout.celo.org/tx/${tx.hash}`
      : `https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`;
  }
  dispatch(setNotification("download metamask"));
}

export async function mintToPoly(polyProps) {
  const { price, account, connector, fileName, dispatch, setNotification, setLoader, mainnet } = polyProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: "not yet implemented" };
    }
    return {
      message: "connect wallet to polygon network or select a different chain",
    };
  }
  const ipfsJsonData = await createNFT({ ...polyProps });
  dispatch(setNotification("preparing assets for minting"));
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_POLY_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_POLY_TESTNET_MINTER_ADDRESS,
    marketAddress: mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
  });
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    wallet
  );

  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    return id;
  });

  const amounts = new Array(ids.length).fill(1);
  let tx;

  dispatch(setLoader("finalizing"));
  try {
    tx = await contract.mintBatch(account, ids, amounts, uris, "0x");
    await tx.wait();
    await marketContract.createBulkMarketItem(
      contract.address,
      ids,
      String(price * 10 ** 18),
      amounts,
      "General",
      account
    );
  } catch (error) {
    dispatch(setLoader(""));
    dispatch(setNotification(`${error.message}`));
    return;
  }
  dispatch(setLoader(""));
  dispatch(setNotification("NFTs successfully minted."));
  return mainnet ? `https://polygonscan.com/tx/${tx.hash}` : `https://mumbai.polygonscan.com/tx/${tx.hash}`;
}

export async function PurchaseNft(asset, account, connector, mainnet) {
  initAlgoClients(mainnet);
  if (!connector?.isWalletConnect && !(connector?.chainId === 4160)) {
    alert("connect wallet to algorand network");
    return;
  }
  const params = await algodTxnClient.getTransactionParams().do();
  const enc = new TextEncoder();
  const note = enc.encode("Nft Purchase");
  const note2 = enc.encode("Platform fee");
  const txns = [];
  if (!connector) {
    alert("Please connect your wallet");
    return;
  }

  const userBalance = await algodClient.accountInformation(account).do();
  if (algosdk.microalgosToAlgos(userBalance.account.amount) <= asset.price) {
    alert("insufficent fund to cover cost");
    return false;
  }

  const optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: account,
    to: account,
    closeRemainderTo: undefined,
    amount: 0,
    assetIndex: asset.Id,
    suggestedParams: params,
  });
  txns.push(optTxn);
  const platformFee = (asset.price * 10) / 100;
  const sellerFee = asset.price - platformFee;

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: asset.owner,
    amount: sellerFee * 1000000,
    note,
    suggestedParams: params,
  });
  txns.push(txn);

  const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: process.env.REACT_APP_GENADROP_MANAGER_ADDRESS,
    amount: platformFee * 1000000,
    note: note2,
    suggestedParams: params,
  });
  txns.push(txn2);
  algosdk.assignGroupID(txns);
  try {
    await signTx(connector, txns);
  } catch (error) {
    alert(error.message);
    return;
  }

  const rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    process.env.REACT_APP_GENADROP_MANAGER_ADDRESS,
    account,
    undefined,
    asset.owner,
    1,
    note,
    asset.Id,
    params
  );
  const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MNEMONIC);
  const rawSignedTxn = rtxn.signTxn(manager.sk);
  const tx = await algodTxnClient.sendRawTransaction(rawSignedTxn).do();
  await waitForConfirmation(tx.txId);
  await write.writeNft(asset.owner, asset.collection_name, asset.Id, asset.price, true, account, new Date(), mainnet);
  await write.recordTransaction(asset.Id, "Sale", account, asset.owner, asset.price, tx.txId);
  return `https://testnet.algoexplorer.io/tx/${tx.txId}`;
}

export async function getAlgoData(mainnet, id) {
  initAlgoClients(mainnet);
  const data = await algodClient.getAssetByID(id).do();
  return data;
}

export async function mintToNear(polyProps) {
  const { price, account, connector, fileName, dispatch, setNotification, setLoader, mainnet } = polyProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: "not yet implemented" };
    }
    return {
      message: "connect wallet to polygon network or select a different chain",
    };
  }
  const ipfsJsonData = await createNFT({ ...polyProps });
  dispatch(setNotification("preparing assets for minting"));
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_AURORA_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_AURORA_TESTNET_MINTER_ADDRESS,
    marketAddress: mainnet
      ? process.env.REACT_APP_GENADROP_NEAR_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_NEAR_TESTNET_MARKET_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
  });
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_NEAR_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_NEAR_TESTNET_MARKET_ADDRESS,
    marketAbi,
    wallet
  );

  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    return id;
  });

  const amounts = new Array(ids.length).fill(1);
  let tx;

  dispatch(setLoader("finalizing"));
  try {
    tx = await contract.mintBatch(account, ids, amounts, uris, "0x");
    await tx.wait();
    await marketContract.createBulkMarketItem(
      contract.address,
      ids,
      String(price * 10 ** 18),
      amounts,
      "General",
      account
    );
  } catch (error) {
    dispatch(setLoader(""));
    dispatch(setNotification(`${error.message}`));
    return;
  }
  dispatch(setLoader(""));
  dispatch(setNotification("NFTs successfully minted."));
  return mainnet ? `https://aurorascan.dev/tx/${tx.hash}` : `https://testnet.aurorascan.dev/tx/${tx.hash}`;
}

export async function getPolygonNfts(mainnet) {
  const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.REACT_APP_ALCHEMY_KEY);
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider);
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    wallet
  );
  const art = await contract.getMarketItems();
  return art;
}

export async function getPolygonUserPurchasedNfts(connector, mainnet) {
  if (!connector) {
    return [];
  }
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  const art = await contract.fetchPurchasedNFTs();
  return art;
}

export async function purchasePolygonNfts(connector, mainnet, itemId, price) {
  if (!connector) {
    return;
  }
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    await contract.nftSale(itemId, { value: price });
  } catch (error) {
    console.log(error);
  }
  return true;
}

export { pinata, write };
