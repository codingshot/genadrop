/* eslint-disable no-alert */
/* eslint-disable no-await-in-loop */
import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { utils } from "near-api-js";
import JSZip from "jszip";
import { ethers } from "ethers";
import { setLoader, setNotification } from "../gen-state/gen.actions";

const BN = require("bn.js");

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
  "function createCollection(string memory _name, string memory _symbol, string memory _description) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)",
];

const mintSingle = [
  "function mint(address to, uint256 id, uint256 amount, string memory uri, bytes memory data) public {}",
  "function setApprovalForAll(address operator, bool approved) public virtual override {}",
  "function isApprovedForAll(address account, address operator) public view returns (bool)",
];

const mintSoul = [
  "function safeMint(address to, string memory uri) public {}",
  "function setApprovalForAll(address operator, bool approved) public virtual override {}",
  "function isApprovedForAll(address account, address operator) public view returns (bool)",
];

// const marketAi = ['function getMarketItems() public view {}'];

const mintAbi = ["function mintBatch( address to, uint256[] memory ids, string[] memory uris) public {}"];

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

const uploadToIpfs = async (nftFile, nftFileName, asset, isIpfsLink) => {
  const fileCat = isIpfsLink ? "*" : nftFile.type.split("/")[0];
  const nftFileNameSplit = nftFileName?.split(".");
  const fileExt = nftFileName ? nftFileNameSplit[1] : "png";

  const kvProperties = {
    url: nftFileName ? nftFileNameSplit[0] : "tweet",
    mimetype: `${fileCat}/${fileExt}`,
  };
  const pinataMetadata = JSON.stringify({
    name: asset.name,
    keyvalues: kvProperties,
  });

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  let resultFile = {};
  if (isIpfsLink) {
    resultFile.IpfsHash = nftFile.split("//")[1];
  } else {
    resultFile = await pinFileToIPFS(pinataApiKey, pinataApiSecret, nftFile, pinataMetadata, pinataOptions);
  }
  const metadata = config.arc3MetadataJSON;
  const integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash);
  if (!Array.isArray(asset.attributes)) {
    asset.attributes = Array(asset.attributes);
  }
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
    media: resultFile.IpfsHash,
  };
};

export const connectAndMint = async (file, metadata, imgName, retryTimes, isIpfsLink) => {
  try {
    await pinata.testAuthentication();
    return await uploadToIpfs(file, imgName, metadata, isIpfsLink);
  } catch (error) {
    console.error(error);
    if (retryTimes === 1) {
      alert("network error while uploading file");
      throw error;
    }
    return connectAndMint(file, metadata, imgName, retryTimes - 1, isIpfsLink);
  }
};

async function createAsset(asset, account) {
  const params = await algodTxnClient.getTransactionParams().do();

  const defaultFrozen = false;
  const unitName = "nft";
  const assetName = `${asset.name}@arc3`;
  const { url } = asset;

  const managerAddr = undefined;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;
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

async function signTx(connector, txns, dispatch) {
  alert("Note: Before closing this modal, ensure that your wallet is open so as to confirm transaction");
  const TxIds = [];
  const assetIds = [];
  // const txnsToSign = [txnsToSign];
  const requestChunkSize = 64;
  for (let index = 0; index < txns.length; index += requestChunkSize) {
    const requestChunk = txns.slice(index, index + requestChunkSize);
    const groupChunkSize = 16;
    // let txgroup;
    if (txns.length > 1) {
      for (let i = 0; i < requestChunk.length; i += groupChunkSize) {
        const chunk = requestChunk.slice(i, i + groupChunkSize);
        algosdk.assignGroupID(chunk);
      }
    }
    const txnsToSign = requestChunk.map((txn) => {
      const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
      return {
        txn: encodedTxn,
        message: "Nft Minting",
        // Note: if the transaction does not need to be signed (because it's part of an atomic group
        // that will be signed by another party), specify an empty singers array like so:
        // signers: [],
      };
    });
    dispatch(
      setLoader(
        txns.length > 64
          ? `Minting batch ${index + 1} - ${index + requestChunk.length} of ${txns.length}`
          : `Minting asset`
      )
    );
    // const chunk = decodedResult.slice(i, i + chunkSize);
    let result;
    try {
      const request = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
      dispatch(
        setNotification({
          message: "please check your wallet to confirm transaction",
          type: "warning",
        })
      );
      result = await connector.send(request);
    } catch (error) {
      dispatch(
        setNotification({
          message: error.message,
          type: "error",
        })
      );
      throw error;
    }
    const decodedResult = result.map((element) => (element ? new Uint8Array(Buffer.from(element, "base64")) : null));
    const chunkSize = 16;
    dispatch(
      setLoader(
        txns.length > 64
          ? `Broadcasting transaction for batch ${index + 1} - ${index + requestChunk.length} of ${txns.length}`
          : `Broadcasting transaction`
      )
    );
    for (let id = 0; id < decodedResult.length; id += chunkSize) {
      const chunk = decodedResult.slice(id, id + chunkSize);
      // should watch for failed transaction sendings on rare occassions and log the signed tx to send later on.
      const tx = await algodTxnClient.sendRawTransaction(chunk).do();
    }
    dispatch(
      setLoader(
        txns.length > 64
          ? `Confirming transaction for batch ${index + 1} - ${index + requestChunk.length} of ${txns.length}`
          : `confirming transaction`
      )
    );
    for (let tIndex = 0; tIndex < requestChunk.length; ++tIndex) {
      const trxId = requestChunk[tIndex].txID();
      TxIds.push(trxId);
      await waitForConfirmation(trxId);
      const ptx = await algodTxnClient.pendingTransactionInformation(trxId).do();
      const assetID = ptx["asset-index"];
      assetIds.push(assetID);
    }
  }
  // const tx = await algodTxnClient.sendRawTransaction(decodedResult).do();
  // await waitForConfirmation(tx.txId);

  return { assetID: assetIds, txId: TxIds };
}
export async function mintSingleToAlgo(algoMintProps) {
  const { file, metadata, account, connector, dispatch, price, mainnet, receiverAddress, isIpfsLink, isAi, fileName } =
    algoMintProps;
  initAlgoClients(mainnet);
  if (connector.isWalletConnect && connector.chainId === 4160) {
    dispatch(setLoader("uploading to ipfs"));
    // notification: uploading to ipfs
    const asset = await connectAndMint(file, metadata, isAi || isIpfsLink ? fileName : file.name, 4, isIpfsLink, isAi);
    const txn = await createAsset(asset, account);
    // notification: asset uploaded, minting in progress
    dispatch(setLoader("asset uploaded, minting in progress"));
    try {
      const { assetID, txId } = await signTx(connector, [txn], dispatch);
      await write.writeNft(receiverAddress, undefined, assetID[0], price || 0, false, null, null, mainnet, txId[0]);
      // notification: asset minted
      return mainnet ? `https://algoexplorer.io/asset/${assetID}` : `https://testnet.algoexplorer.io/asset/${assetID}`;
    } catch (error) {
      console.log(error.message);
      return {
        message: `${"insufficient balance/Min balance not enough to hold assets"}`,
      };
    }
  }
  return {
    message: "Connect to alogrand network on your wallet or select a different network",
  };
}

export async function mintSingleToNear(nearMintProps) {
  const { file, metadata, account, connector, dispatch, price, mainnet, receiverAddress, isIpfsLink, isAi, fileName } =
    nearMintProps;
  const {
    contract: { contractId },
    accounts,
  } = window.selector.store.getState();
  const { accountId } = accounts[0];
  if (accountId) {
    dispatch(setLoader("uploading to ipfs"));
    // notification: uploading to ipfs
    const asset = await connectAndMint(file, metadata, isAi || isIpfsLink ? fileName : file.name, 4, isIpfsLink, isAi);
    // notification: asset uploaded, minting in progress
    dispatch(setLoader("asset uploaded, minting in progress"));
    let response;
    if (window?.near?.accountId) {
      response = await window?.near?.signAndSendTransaction({
        receiverId: contractId,
        actions: [
          {
            methodName: "nft_mint",
            args: {
              token_id: `${Date.now()}`,
              metadata: {
                title: metadata.name,
                description: metadata.description,
                media: `https://ipfs.io/ipfs/${asset.media}`,
                reference: asset.url,
              },
              receiver_id: receiverAddress,
            },
            gas: utils.format.parseNearAmount("0.0000000003"),
            deposit: utils.format.parseNearAmount("0.01"),
          },
        ],
      });
    } else {
      const wallet = await window.selector.wallet();
      response = await wallet.signAndSendTransaction({
        signerId: accountId,
        receiverId: contractId,
        callbackUrl: `http://${window.location.host}/mint/1of1`,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "nft_mint",
              args: {
                token_id: `${Date.now()}`,
                metadata: {
                  title: metadata.name,
                  description: metadata.description,
                  media: `https://ipfs.io/ipfs/${asset.media}`,
                  reference: asset.url,
                },
                receiver_id: receiverAddress,
              },
              gas: 300000000000000,
              deposit: new BN("10000000000000000000000"),
            },
          },
        ],
      });
    }
    // if (window.selector) console.log(window.selector);
    return response;
    // try {
    //   const { assetID, txId } = await signTx(connector, [txn], dispatch);
    //   await write.writeNft(account, undefined, assetID[0], price || 0, false, null, null, mainnet, txId[0]);
    //   // notification: asset minted
    //   return mainnet ? `https://algoexplorer.io/asset/${assetID}` : `https://testnet.algoexplorer.io/asset/${assetID}`;
    // } catch (error) {
    //   console.log(error.message);
    //   return {
    //     message: `${error.message}`,
    //   };
    // }
  }
  return {
    message: "Connect to Near network on your wallet or select a different network",
  };
}

export async function mintSoulBoundPoly(mintprops) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
    isSoulBound,
  } = mintprops;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_SOULBOUND_ADDRESS,
      mintSoul,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: mainnet
        ? process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_SOULBOUND_ADDRESS,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("safeMint", [receiverAddress, asset.url]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet ? `https://polygonscan.com/tx/${result.hash}` : `https://mumbai.polygonscan.com/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isAi || isIpfsLink ? fileName : file.name, dispatch, isAi);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS
      : process.env.REACT_APP_POLY_TESTNET_SOULBOUND_ADDRESS,
    mintSoul,
    signer
  );
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  let txn;
  try {
    txn = await contract.safeMint(receiverAddress, asset.url);
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://polygonscan.com/tx/${txn.hash}` : `https://mumbai.polygonscan.com/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: error.message ? error.message : "something went wrong! check your connected network and try again.",
    };
  }
}

export async function mintSoulBoundAvax(mintprops) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
    isSoulBound,
  } = mintprops;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
    const uintArray = asset.metadata.toLocaleString();
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_AVAX_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_SOULBOUND_ADDRESS,
      mintSoul,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: mainnet
        ? process.env.REACT_APP_AVAX_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_SOULBOUND_ADDRESS,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("safeMint", [receiverAddress, asset.url]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet ? `https://snowtrace.io/tx/${result.hash}` : `https://testnet.snowtrace.io/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isAi || isIpfsLink ? fileName : file.name, 4, dispatch, isAi);
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_AVAX_MAINNET_SOULBOUND_ADDRESS
      : process.env.REACT_APP_AVAX_TESTNET_SOULBOUND_ADDRESS,
    mintSoul,
    signer
  );
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  let txn;
  try {
    txn = await contract.safeMint(receiverAddress, asset.url);
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://snowtrace.io/tx/${txn.hash}` : `https://testnet.snowtrace.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: error.message ? error.message : "something went wrong! check your connected network and try again.",
    };
  }
}

export async function mintSoulBoundCelo(mintprops) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
    isSoulBound,
  } = mintprops;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_CELO_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_CELO_TESTNET_SOULBOUND_ADDRESS,
      mintSoul,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: mainnet
        ? process.env.REACT_APP_CELO_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_CELO_TESTNET_SOULBOUND_ADDRESS,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("safeMint", [receiverAddress, asset.url]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet
        ? `https://explorer.celo.org/mainnet/tx/${result.hash}`
        : `https://explorer.celo.org/alfajores/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isAi || isIpfsLink ? fileName : file.name, 4, dispatch, isAi);
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_CELO_MAINNET_SOULBOUND_ADDRESS
      : process.env.REACT_APP_CELO_TESTNET_SOULBOUND_ADDRESS,
    mintSoul,
    signer
  );
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  let txn;
  try {
    txn = await contract.safeMint(receiverAddress, asset.url);
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet
      ? `https://explorer.celo.org/mainnet/tx/${txn.hash}`
      : `https://explorer.celo.org/alfajores/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: error.message ? error.message : "something went wrong! check your connected network and try again.",
    };
  }
}

export async function mintSingleToPoly(singleMintProps) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    fileName,
    isSoulBound,
  } = singleMintProps;
  if (isSoulBound) {
    return mintSoulBoundPoly(singleMintProps);
  }
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(
      mainnet ? process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS,
      mintSingle,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: mainnet
        ? process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mint", [receiverAddress, id, 1, asset.url, "0x"]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet ? `https://polygonscan.com/tx/${result.hash}` : `https://mumbai.polygonscan.com/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, file.name, dispatch);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  let txn;
  try {
    txn = await contract.mint(receiverAddress, id, 1, asset.url, "0x");
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://polygonscan.com/tx/${txn.hash}` : `https://mumbai.polygonscan.com/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: error.message ? error.message : "something went wrong! check your connected network and try again.",
    };
  }
}

// async function InitiateCeloProvider(mainnet) {
//   const provider = new CeloProvider(mainnet ? "https://forno.celo.org" : "https://alfajores-forno.celo-testnet.org");
//   await provider.ready;
//   const wallet = new CeloWallet(
//     mainnet ? process.env.REACT_APP_GENADROP_SERVER_KEY : process.env.REACT_APP_GENADROP_SERVER_KEY,
//     provider
//   );
//   return wallet;
// }

export async function mintSingleToCelo(singleMintProps) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
    isSoulBound,
  } = singleMintProps;
  if (isSoulBound) {
    return mintSoulBoundCelo(singleMintProps);
  }
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(
      mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
      mintSingle,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: mainnet
        ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS
        : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mint", [receiverAddress, id, 1, asset.url, "0x"]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet
        ? `https://explorer.celo.org/mainnet/tx/${result.hash}`
        : `https://explorer.celo.org/alfajores/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  // const wallet = await InitiateCeloProvider(mainnet);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  let txn;
  try {
    txn = await contract.mint(receiverAddress, id, 1, asset.url, "0x");
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet
      ? `https://explorer.celo.org/mainnet/tx/${txn.hash}`
      : `https://explorer.celo.org/alfajores/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function mintSingleToAvax(singleMintProps) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
    isSoulBound,
  } = singleMintProps;
  if (isSoulBound) {
    return mintSoulBoundAvax(singleMintProps);
  }
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    dispatch(setLoader("uploading 1 of 1"));
    const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    dispatch(setLoader("minting 1 of 1"));
    const contract = new ethers.Contract(
      mainnet ? process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS,
      mintSingle,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: mainnet
        ? process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mint", [receiverAddress, id, 1, asset.url, "0x"]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet
        ? `https://explorer.celo.org/mainnet/tx/${result.hash}`
        : `https://explorer.celo.org/alfajores/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  let txn;
  try {
    txn = await contract.mint(receiverAddress, id, 1, asset.url, "0x");
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://snowtrace.io/tx/${txn.hash}` : `https://testnet.snowtrace.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function mintSingleToAurora(singleMintProps) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
  } = singleMintProps;
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_AURORA_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  // const wallet = new ethers.Wallet(
  //   mainnet ? process.env.REACT_APP_GENADROP_SERVER_KEY : process.env.REACT_APP_GENADROP_SERVER_KEY,
  //   connector
  // );
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  try {
    const txn = await contract.mint(receiverAddress, id, 1, asset.url, "0x");
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
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

export async function mintSingleToAbitrum(singleMintProps) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
  } = singleMintProps;
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_ARBITRUM_MAINNET_SINGLE_ADDRESS
      : process.env.REACT_APP_ARBITRUM_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  try {
    const txn = await contract.mint(receiverAddress, id, 1, asset.url, "0x");
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet ? `https://arbiscan.io/tx/${txn.hash}` : `https://goerli.arbiscan.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function mintSingleToOptimism(singleMintProps) {
  const {
    file,
    metadata,
    price,
    account,
    connector,
    dispatch,
    setLoader,
    mainnet,
    receiverAddress,
    isIpfsLink,
    isAi,
    fileName,
  } = singleMintProps;
  const signer = await connector.getSigner();
  dispatch(setLoader("uploading 1 of 1"));
  const asset = await connectAndMint(file, metadata, isIpfsLink || isAi ? fileName : file.name, 4, isIpfsLink, isAi);
  const uintArray = asset.metadata.toLocaleString();
  const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  dispatch(setLoader("minting 1 of 1"));
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_OPTIMISM_MAINNET_SINGLE_ADDRESS
      : process.env.REACT_APP_OPTIMISM_TESTNET_SINGLE_ADDRESS,
    mintSingle,
    signer
  );
  try {
    const txn = await contract.mint(receiverAddress, id, 1, asset.url, "0x");
    await txn.wait();
    // await marketContract.createMarketplaceItem(contract.address, id, String(price * 10 ** 18), "General", account);
    dispatch(setLoader(""));
    return mainnet
      ? `https://optimistic.etherscan.io/tx/${txn.hash}`
      : `https://goerli-optimism.etherscan.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "something went wrong! please check your connected network and try again.",
    };
  }
}

export async function createNFT(createProps, doAccountCheck) {
  const { file, dispatch, account, setNotification, setLoader } = createProps;
  const assets = [];
  const zip = new JSZip();
  const data = await zip.loadAsync(file);
  const files = data.files["metadata.json"];
  const metadataString = await files.async("string");
  const metadata = JSON.parse(metadataString);
  try {
    if (doAccountCheck) {
      // alert("doing checkings");
      try {
        const userInfo = await algodClient.accountInformation(account).exclude("all").do();
        const assetBalance = userInfo["total-assets-opted-in"];
        const userBalance = algosdk.microalgosToAlgos(userInfo.amount);
        // alert(userBalance);
        const estimateTxFee = 0.001 * metadata.length;
        // alert((assetBalance + metadata.length) * 0.1 + estimateTxFee > userBalance);
        if ((assetBalance + metadata.length) * 0.1 + estimateTxFee > userBalance) {
          // alert("returning false");
          return false;
        }
      } catch (error) {
        console.log("SUS", error);
      }
    }
  } catch (error) {
    console.log("this is the error", error);
    // alert(error);
  }
  dispatch(
    setNotification({
      message: "uploading assets, do not refresh your page.",
      type: "warning",
    })
  );
  for (let i = 0; i < metadata.length; i += 1) {
    dispatch(setLoader(`uploading ${i + 1} of ${metadata.length}`));
    const imgName = metadata[i].image;
    const imgFile = data.files[imgName];
    const uint8array = await imgFile.async("uint8array");
    const blob = new File([uint8array], imgName, { type: imgName.split(".")[1] });
    const asset = await connectAndMint(blob, metadata[i], imgName, 4);
    assets.push(asset);
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "uploaded successfully",
      type: "success",
    })
  );
  return assets;
}

export async function listCeloNft(nftProps) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
      marketAbi,
      signer
    );
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    // const contract = new ethers.Contract(
    //   mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
    //   mintSingle,
    //   signer
    // );
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);

    try {
      // only pop approval equest if unapproved
      if (!approvalCheck) {
        dispatch(setLoader("Approve marketplace to list nft"));
        const ethNonce = await signer.getTransactionCount();
        const approvalTx = {
          from: account,
          to: contract.address,
          // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
          // gasPrice: ethers.utils.parseUnits('5', "gwei"),
          data: contract.interface.encodeFunctionData("setApprovalForAll", [marketContract.address, true]),
          nonce: ethNonce,
        };
        const result = await signer.sendTransaction(approvalTx);
        await result.wait();
      }
      const ethNonce = await signer.getTransactionCount();
      const listingTx = {
        from: account,
        to: marketContract.address,
        // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
        // gasPrice: ethers.utils.parseUnits('5', "gwei"),
        data: marketContract.interface.encodeFunctionData("createMarketplaceItem", [
          nftContract,
          id,
          String(price * 10 ** 18),
          "General",
          account,
        ]),
        nonce: ethNonce,
      };
      const result = await signer.sendTransaction(listingTx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet
        ? `https://blockscout.celo.org/tx/${result.hash}`
        : `https://alfajores-blockscout.celo-testnet.org/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
    marketAbi,
    signer
  );
  try {
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);
    if (!approvalCheck) {
      dispatch(setLoader("Approve marketplace to list nft"));
      const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
      await approvalTxn.wait();
    }
    dispatch(setLoader("Listing Nft to marketplace"));
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    return mainnet
      ? `https://explorer.celo.org/mainnet/tx/${txn.hash}`
      : `https://explorer.celo.org/alfajores/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function listAvaxNft(nftProps) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_AVAX_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_AVAX_TESTNET_MARKET_ADDRESS,
    marketAbi,
    signer
  );
  try {
    dispatch(setLoader("Approve marketplace to list nft"));
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
    await approvalTxn.wait();
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    return mainnet ? `https://snowtrace.io/tx/${txn.hash}` : `hhttps://testnet.snowtrace.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function listAuroraNft(nftProps) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
      marketAbi,
      signer
    );
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    // const contract = new ethers.Contract(
    //   mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
    //   mintSingle,
    //   signer
    // );
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);

    try {
      // only pop approval equest if unapproved
      if (!approvalCheck) {
        dispatch(setLoader("Approve marketplace to list nft"));
        const ethNonce = await signer.getTransactionCount();
        const approvalTx = {
          from: account,
          to: contract.address,
          // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
          // gasPrice: ethers.utils.parseUnits('5', "gwei"),
          data: contract.interface.encodeFunctionData("setApprovalForAll", [marketContract.address, true]),
          nonce: ethNonce,
        };
        const result = await signer.sendTransaction(approvalTx);
        await result.wait();
      }
      const ethNonce = await signer.getTransactionCount();
      const listingTx = {
        from: account,
        to: marketContract.address,
        // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
        // gasPrice: ethers.utils.parseUnits('5', "gwei"),
        data: marketContract.interface.encodeFunctionData("createMarketplaceItem", [
          nftContract,
          id,
          String(price * 10 ** 18),
          "General",
          account,
        ]),
        nonce: ethNonce,
      };
      const result = await signer.sendTransaction(listingTx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet ? `https://aurorascan.dev/tx/${result.hash}` : `https://testnet.aurorascan.dev/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
    marketAbi,
    signer
  );
  try {
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);
    if (!approvalCheck) {
      dispatch(setLoader("Approve marketplace to list nft"));
      const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
      await approvalTxn.wait();
    }
    dispatch(setLoader("Listing Nft to marketplace"));
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    return mainnet ? `https://aurorascan.dev/tx/${txn.hash}` : `https://testnet.aurorascan.dev/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function listArbitrumNft(nftProps) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_ARBITRUM_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_ARBITRUM_TESTNET_MARKET_ADDRESS,
    marketAbi,
    signer
  );
  try {
    dispatch(setLoader("Approve marketplace to list nft"));
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
    await approvalTxn.wait();
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    return mainnet ? `https://arbiscan.io/tx/${txn.hash}` : `https://goerli.arbiscan.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function listOptimismNft(nftProps) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_OPTIMISM_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_OPTIMISM_TESTNET_MARKET_ADDRESS,
    marketAbi,
    signer
  );
  try {
    dispatch(setLoader("Approve marketplace to list nft"));
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
    await approvalTxn.wait();
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    return mainnet
      ? `https://optimistic.etherscan.io/tx/${txn.hash}`
      : `https://goerli-optimism.etherscan.io/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function listPolygonNft(nftProps) {
  const { account, connector, id, nftContract, dispatch, price, mainnet } = nftProps;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
      marketAbi,
      signer
    );
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    // const contract = new ethers.Contract(
    //   mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_TESTNET_SINGLE_ADDRESS,
    //   mintSingle,
    //   signer
    // );
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);

    try {
      // only pop approval equest if unapproved
      if (!approvalCheck) {
        dispatch(setLoader("Approve marketplace to list nft"));
        const ethNonce = await signer.getTransactionCount();
        const approvalTx = {
          from: account,
          to: contract.address,
          // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
          // gasPrice: ethers.utils.parseUnits('5', "gwei"),
          data: contract.interface.encodeFunctionData("setApprovalForAll", [marketContract.address, true]),
          nonce: ethNonce,
        };
        const result = await signer.sendTransaction(approvalTx);
        await result.wait();
      }
      const ethNonce = await signer.getTransactionCount();
      const listingTx = {
        from: account,
        to: marketContract.address,
        // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
        // gasPrice: ethers.utils.parseUnits('5', "gwei"),
        data: marketContract.interface.encodeFunctionData("createMarketplaceItem", [
          nftContract,
          id,
          String(price * 10 ** 18),
          "General",
          account,
        ]),
        nonce: ethNonce,
      };
      const result = await signer.sendTransaction(listingTx);
      await result.wait();
      dispatch(setLoader(""));
      return mainnet ? `https://polygonscan.com/tx/${result.hash}` : `https://mumbai.polygonscan.com/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  const signer = await connector.getSigner();
  const marketContract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    signer
  );
  try {
    const contract = new ethers.Contract(nftContract, mintSingle, signer);
    const approvalCheck = await contract.isApprovedForAll(account, marketContract.address);
    if (!approvalCheck) {
      dispatch(setLoader("Approve marketplace to list nft"));
      const approvalTxn = await contract.setApprovalForAll(marketContract.address, true);
      await approvalTxn.wait();
    }
    dispatch(setLoader("Listing Nft to marketplace"));
    const txn = await marketContract.createMarketplaceItem(
      nftContract,
      id,
      String(price * 10 ** 18),
      "General",
      account
    );
    await txn.wait();
    dispatch(setLoader(""));
    return mainnet ? `https://polygonscan.com/tx/${txn.hash}` : `https://mumbai.polygonscan.com/tx/${txn.hash}`;
  } catch (error) {
    dispatch(setLoader(""));
    console.log(error);
    return {
      error,
      message: "Error listing nft, please try again or reavhout to support.",
    };
  }
}

export async function listAlgoNft(nftProps) {
  const { dispatch, nftDetails, account, connector, price, mainnet } = nftProps;
  const newAccount = await algosdk.generateAccount();
  const new_acct = newAccount.addr;
  const new_key = newAccount.sk;
  dispatch(setLoader("Building transactions...."));
  initAlgoClients(mainnet);
  const params = await algodTxnClient.getTransactionParams().do();
  const enc = new TextEncoder();
  let note = enc.encode("Storage fund");
  const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: new_acct,
    amount: 411000,
    note,
    suggestedParams: params,
  });

  const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: new_acct,
    to: new_acct,
    amount: 0,
    assetIndex: nftDetails.Id,
    suggestedParams: params,
  });

  note = enc.encode("List to Genadrop");

  const Transfertxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    nftDetails.owner,
    new_acct,
    undefined,
    undefined,
    1,
    note,
    nftDetails.Id,
    params
  );

  note = enc.encode("rk to sc");
  const appId = mainnet ? 939259299 : 121305178;
  const rekeyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: new_acct,
    to: new_acct,
    amount: 0,
    note,
    suggestedParams: params,
    rekeyTo: mainnet
      ? "26DE4TXZOPFLBAJYGTOXCFTXQEUJ5ZQO6KDNZKIH2YOGLALP2QMS6JQX3I"
      : "PN5Q5SLJYMX2W5O4SASR76SY6AEZDCN2Q532M3FLUDKEIJ6ROGIBTF7JOY",
  });

  const arg_price = Number(price) * 1000000;

  const app_args = [
    new Uint8Array(Buffer.from("initializeSale")),
    new Uint8Array(Buffer.from(nftDetails.owner)),
    new Uint8Array(Buffer.from(algosdk.encodeUint64(arg_price))),
    new Uint8Array(Buffer.from(nftDetails.Id.toString())),
  ];

  console.log(app_args, arg_price, price, nftDetails.Id);

  const appOptinTx = algosdk.makeApplicationOptInTxn(new_acct, params, appId);

  const listTxn = algosdk.makeApplicationCallTxnFromObject({
    from: new_acct,
    suggestedParams: params,
    appIndex: appId,
    appArgs: app_args,
    accounts: [account],
    foreignAssets: [nftDetails.Id],
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  });

  const txList = [fundTxn, optInTxn, Transfertxn, appOptinTx, listTxn, rekeyTxn];
  const groupedTx = algosdk.assignGroupID(txList);

  console.log("two kind", txList, groupedTx);
  const txnsToSignByUser = [fundTxn, Transfertxn];
  const txToSignByNewAcct = [optInTxn, appOptinTx, listTxn, rekeyTxn];
  // const tx = await algodTxnClient.sendRawTransaction(rawSignedTxn).do();
  console.log("Louis", txToSignByNewAcct);
  const txnsToSign = txList.map((txn) => {
    const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
    if (txnsToSignByUser.includes(txn)) {
      console.log("Louis", txn);
      return {
        txn: encodedTxn,
        message: "Nft Listing",
        // Note: if the transaction does not need to be signed (because it's part of an atomic group
        // that will be signed by another party), specify an empty singers array like so:
        // signers: [],
      };
    }
    console.log("lane", txn);
    return {
      txn: encodedTxn,
      message: "Nft Listing",
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      signers: [],
    };
  });

  // const newArray = txToSignByNewAcct.map((txn) => {
  //   const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
  //   return {
  //     txn: encodedTxn,
  //     message: "Nft Listing",
  //     // Note: if the transaction does not need to be signed (because it's part of an atomic group
  //     // that will be signed by another party), specify an empty singers array like so:
  //     signers: [],
  //   };
  // });

  // const combinedTx = txnsToSign.concat(newArray)

  // console.log("rihanna go girl alone", combinedTx, [...newArray, ...txnsToSign])

  let result;
  try {
    const request = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
    dispatch(
      setNotification({
        message: "please check your wallet to confirm transaction",
        type: "warning",
      })
    );
    result = await connector.send(request);
  } catch (error) {
    dispatch(
      setNotification({
        message: error.message,
        type: "error",
      })
    );
    throw error;
  }
  const optInTxnSigned = optInTxn.signTxn(new_key);
  const appOptinTxSigned = appOptinTx.signTxn(new_key);
  const listTxnSigned = listTxn.signTxn(new_key);
  const rekeyTxnSigned = rekeyTxn.signTxn(new_key);

  const decodedResult = result.map((element) => (element ? new Uint8Array(Buffer.from(element, "base64")) : null));
  const new_tx_list = [
    decodedResult[0],
    optInTxnSigned,
    decodedResult[2],
    appOptinTxSigned,
    listTxnSigned,
    rekeyTxnSigned,
  ];

  dispatch(setLoader("Broadcasting transaction....."));

  const tx = await algodTxnClient.sendRawTransaction(new_tx_list).do();

  console.log("final tx", tx.txId);

  await write.listNft(nftDetails.Id, price, nftDetails.owner, new_acct, tx.txId, true);
  dispatch(setLoader(""));
  return mainnet ? `https://algoexplorer.io/tx/${tx.txId}` : `https://testnet.algoexplorer.io/tx/${tx.txId}`;
}

export async function initializeContract(contractProps) {
  const { minterAddress, fileName, connector, account, dispatch, setLoader, description } = contractProps;
  const name = fileName.split("-")[0];
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
    const ethNonce = await signer.getTransactionCount();
    const tx = {
      from: account,
      to: minterAddress,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: collectionContract.interface.encodeFunctionData("createCollection", [
        name,
        name.substring(0, 3).toUpperCase(),
        description,
      ]),
      nonce: ethNonce,
    };
    const result = await signer.sendTransaction(tx);
    await result.wait();
    dispatch(setLoader("minting"));
    dispatch(setLoader(""));
    const getCollectionAddresses = await collectionContract.collectionsOf(account);
    const collectionAddresses = [...getCollectionAddresses];
    const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
    return contract;
  }
  const signer = await connector.getSigner();
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  const tx = await collectionContract.createCollection(name, name.substring(0, 3).toUpperCase(), description);
  dispatch(setLoader("minting"));
  await tx.wait();
  dispatch(setLoader(""));
  const getCollectionAddresses = await collectionContract.collectionsOf(account);
  const collectionAddresses = [...getCollectionAddresses];
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  return contract;
}

export async function mintToAlgo(algoProps) {
  const {
    price,
    account,
    connector,
    fileName,
    description,
    dispatch,
    setNotification,
    setLoader,
    receiverAddress,
    mainnet,
  } = algoProps;
  initAlgoClients(mainnet);
  if (connector.isWalletConnect && connector.chainId === 4160) {
    const ipfsJsonData = await createNFT({ ...algoProps }, true);
    if (!ipfsJsonData) {
      return {
        message: "insufficient balance/Min balance not enough to hold assets",
        type: "warning",
      };
    }
    const txns = [];
    dispatch(
      setNotification({
        message: "preparing assets for minting",
        type: "default",
      })
    );
    for (let i = 0; i < ipfsJsonData.length; ++i) {
      dispatch(setLoader(`constructing assets ${i + 1} of ${ipfsJsonData.length}`));
      const txn = await createAsset(ipfsJsonData[i], account);
      txns.push(txn);
    }
    dispatch(setLoader("finalizing"));

    try {
      const { assetID, txId } = await signTx(connector, txns, dispatch);
      const collectionHash = await pinata.pinJSONToIPFS(assetID, {
        pinataMetadata: { name: "collection" },
      });
      const collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
      await write.writeUserData(
        receiverAddress,
        collectionUrl,
        fileName,
        assetID,
        price || 0,
        description,
        mainnet,
        txId
      );
      dispatch(setLoader(""));
      return mainnet ? `https://algoexplorer.io/tx/${txId[0]}` : `https://testnet.algoexplorer.io/tx/${txId[0]}`;
    } catch (error) {
      console.log("===> ", error);
      return {
        message: `${"insufficient balance/Min balance not enough to hold assets"}`,
      };
    }
  }
  return { message: "connect wallet to algorand network or select a different chain" };
}

export async function mintToCelo(celoProps) {
  const {
    price,
    account,
    connector,
    fileName,
    description,
    dispatch,
    setNotification,
    setLoader,
    mainnet,
    receiverAddress,
  } = celoProps;
  const ipfsJsonData = await createNFT({ ...celoProps });
  dispatch(setLoader("preparing assets for minting"));
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_CELO_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_CELO_TESTNET_MINTER_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  // const wallet = await InitiateCeloProvider(mainnet);
  await connector.getSigner();
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );
  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    return parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  });

  // const amounts = new Array(ids.length).fill(1);
  let tx;
  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [receiverAddress, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      return mainnet
        ? `https://explorer.celo.org/mainnet/tx/${result.hash}`
        : `https://explorer.celo.org/alfajores/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  try {
    tx = await contract.mintBatch(receiverAddress, ids, uris);
    await tx.wait();
    // await marketContract.createBulkMarketItem(
    //   contract.address,
    //   ids,
    //   String(price * 10 ** 18),
    //   amounts,
    //   "General",
    //   account,
    //   description
    // );
  } catch (error) {
    console.log(error);
    dispatch(setLoader(""));
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs minted successfully",
      type: "success",
    })
  );
  return mainnet
    ? `https://explorer.celo.org/mainnet/tx/${tx.hash}`
    : `https://explorer.celo.org/alfajores/tx/${tx.hash}`;
}

export async function mintToAvax(celoProps) {
  const {
    price,
    account,
    connector,
    fileName,
    description,
    dispatch,
    setNotification,
    setLoader,
    mainnet,
    receiverAddress,
  } = celoProps;
  const ipfsJsonData = await createNFT({ ...celoProps });
  dispatch(setLoader("preparing assets for minting"));
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_AVAX_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_AVAX_TESTNET_MINTER_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  await connector.getSigner();
  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    return parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
  });

  // const amounts = new Array(ids.length).fill(1);
  let tx;
  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [receiverAddress, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      return mainnet ? `https://snowtrace.io/tx/${result.hash}` : `https://testnet.snowtrace.io/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  try {
    tx = await contract.mintBatch(receiverAddress, ids, uris);
    await tx.wait();
    // await marketContract.createBulkMarketItem(
    //   contract.address,
    //   ids,
    //   String(price * 10 ** 18),
    //   amounts,
    //   "General",
    //   account,
    //   description
    // );
  } catch (error) {
    console.log(error);
    dispatch(setLoader(""));
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs minted successfully",
      type: "success",
    })
  );
  return mainnet ? `https://snowtrace.io/tx/${tx.hash}` : `https://testnet.snowtrace.io/tx/${tx.hash}`;
}

export async function mintToPoly(polyProps) {
  const {
    price,
    account,
    connector,
    fileName,
    description,
    dispatch,
    setNotification,
    receiverAddress,
    setLoader,
    mainnet,
  } = polyProps;
  const ipfsJsonData = await createNFT({ ...polyProps });
  dispatch(setLoader("preparing assets for minting"));
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_POLY_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_POLY_TESTNET_MINTER_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );

  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    return id;
  });

  // const amounts = new Array(ids.length).fill(1);
  let tx;

  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [receiverAddress, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      return mainnet ? `https://polygonscan.com/tx/${result.hash}` : `https://mumbai.polygonscan.com/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }
  try {
    tx = await contract.mintBatch(receiverAddress, ids, uris);
    await tx.wait();
    // await marketContract.createBulkMarketItem(
    //   contract.address,
    //   ids,
    //   String(price * 10 ** 18),
    //   amounts,
    //   "General",
    //   account,
    //   description
    // );
  } catch (error) {
    dispatch(setLoader(""));
    dispatch(
      setNotification({
        message: `${error.message}`,
        type: "error",
      })
    );
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs minted successfully.",
      type: "success",
    })
  );
  return mainnet ? `https://polygonscan.com/tx/${tx.hash}` : `https://mumbai.polygonscan.com/tx/${tx.hash}`;
}

export async function PurchaseANft(args) {
  const { dispatch, nftDetails, account, connector, mainnet } = args;
  dispatch(setLoader("executing transaction..."));
  initAlgoClients(mainnet);
  const params = await algodTxnClient.getTransactionParams().do();
  const enc = new TextEncoder();
  const note = enc.encode("Nft Purchase");
  const note2 = enc.encode("Platform fee");
  const txns = [];
  const userBalance = await algodClient.accountInformation(account).do();
  if (algosdk.microalgosToAlgos(userBalance.amount) <= nftDetails.price) {
    dispatch(
      setNotification({
        message: "insufficent fund to cover cost",
        type: "warning",
      })
    );
    return false;
  }

  const optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: account,
    to: account,
    closeRemainderTo: undefined,
    amount: 0,
    assetIndex: nftDetails.Id,
    suggestedParams: params,
  });
  txns.push(optTxn);
  const platformFee = (nftDetails.price * 10) / 100;
  const sellerFee = nftDetails.price - platformFee;

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: nftDetails.owner,
    amount: sellerFee * 1000000,
    note,
    suggestedParams: params,
  });
  txns.push(txn);

  const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: mainnet ? process.env.REACT_APP_GENADROP_ALGO_TAX_ADDRESS : process.env.REACT_APP_GENADROP_MANAGER_ADDRESS,
    amount: platformFee * 1000000,
    note: note2,
    suggestedParams: params,
  });
  txns.push(txn2);
  try {
    await signTx(connector, txns, dispatch);
  } catch (error) {
    dispatch(
      setNotification({
        message: error.message,
        type: "error",
      })
    );
    return;
  }

  const rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    process.env.REACT_APP_GENADROP_MANAGER_ADDRESS,
    account,
    undefined,
    nftDetails.owner,
    1,
    note,
    nftDetails.Id,
    params
  );
  const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MNEMONIC);
  const rawSignedTxn = rtxn.signTxn(manager.sk);
  const tx = await algodTxnClient.sendRawTransaction(rawSignedTxn).do();
  await waitForConfirmation(tx.txId);
  await write.writeNft(
    nftDetails.owner,
    nftDetails.collection_name,
    nftDetails.Id,
    nftDetails.price,
    true,
    account,
    new Date(),
    mainnet
  );
  dispatch(setLoader(""));
  await write.recordTransaction(nftDetails.Id, "Sale", account, nftDetails.owner, nftDetails.price, tx.txId);
  return mainnet ? `https://algoexplorer.io/tx/${tx.txId}` : `https://testnet.algoexplorer.io/tx/${tx.txId}`;
}

export async function getAlgoData(mainnet, id) {
  initAlgoClients(mainnet);
  const data = await algodClient.getAssetByID(id).do();
  return data;
}

export async function mintToAurora(polyProps) {
  const { price, account, connector, fileName, description, dispatch, setNotification, setLoader, mainnet } = polyProps;
  const ipfsJsonData = await createNFT({ ...polyProps });
  dispatch(
    setNotification({
      message: "preparing assets for minting",
      type: "default",
    })
  );
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_AURORA_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_AURORA_TESTNET_MINTER_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );

  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    return id;
  });

  let tx;

  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [account, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      return mainnet ? `https://aurorascan.dev/tx/${result.hash}` : `https://testnet.aurorascan.dev/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }

  try {
    tx = await contract.mintBatch(account, ids, uris);
    await tx.wait();
    // await marketContract.createBulkMarketItem(
    //   contract.address,
    //   ids,
    //   String(price * 10 ** 18),
    //   amounts,
    //   "General",
    //   account,
    //   description
    // );
  } catch (error) {
    dispatch(setLoader(""));
    dispatch(
      setNotification({
        message: `${error.message}`,
        type: "error",
      })
    );
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs successfully minted.",
      type: "success",
    })
  );
  return mainnet ? `https://aurorascan.dev/tx/${tx.hash}` : `https://testnet.aurorascan.dev/tx/${tx.hash}`;
}

export async function mintToArbitrum(polyProps) {
  const { price, account, connector, fileName, description, dispatch, setNotification, setLoader, mainnet } = polyProps;
  const ipfsJsonData = await createNFT({ ...polyProps });
  dispatch(
    setNotification({
      message: "preparing assets for minting",
      type: "default",
    })
  );
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_ARBITRUM_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_ARBITRUM_TESTNET_MINTER_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );

  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    return id;
  });

  let tx;

  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [account, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      return mainnet ? `https://arbiscan.io/tx/${result.hash}` : `https://goerli.arbiscan.io/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }

  try {
    tx = await contract.mintBatch(account, ids, uris);
    await tx.wait();
    // await marketContract.createBulkMarketItem(
    //   contract.address,
    //   ids,
    //   String(price * 10 ** 18),
    //   amounts,
    //   "General",
    //   account,
    //   description
    // );
  } catch (error) {
    dispatch(setLoader(""));
    dispatch(
      setNotification({
        message: `${error.message}`,
        type: "error",
      })
    );
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs successfully minted.",
      type: "success",
    })
  );
  return mainnet ? `https://arbiscan.io/tx/${tx.hash}` : `https://goerli.arbiscan.io/tx/${tx.hash}`;
}

export async function mintToOptimism(polyProps) {
  const { price, account, connector, fileName, description, dispatch, setNotification, setLoader, mainnet } = polyProps;
  const ipfsJsonData = await createNFT({ ...polyProps });
  dispatch(
    setNotification({
      message: "preparing assets for minting",
      type: "default",
    })
  );
  const contract = await initializeContract({
    minterAddress: mainnet
      ? process.env.REACT_APP_OPTIMISM_MAINNET_MINTER_ADDRESS
      : process.env.REACT_APP_OPTIMISM_TESTNET_MINTER_ADDRESS,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
    description,
  });
  // const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  // const marketContract = new ethers.Contract(
  //   mainnet
  //     ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
  //     : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
  //   marketAbi,
  //   wallet
  // );

  const uris = ipfsJsonData.map((asset) => asset.url);
  const ids = ipfsJsonData.map((asset) => {
    const uintArray = asset.metadata.toLocaleString();
    const id = parseInt(uintArray.slice(0, 7).replace(/,/g, ""));
    return id;
  });

  let tx;

  dispatch(setLoader("finalizing"));
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const ethNonce = await signer.getTransactionCount();
    tx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("mintBatch", [account, ids, uris]),
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(tx);
      await result.wait();
      dispatch(setLoader(""));
      dispatch(
        setNotification({
          message: "NFTs minted successfully.",
          type: "success",
        })
      );
      return mainnet
        ? `https://optimistic.etherscan.io/tx/${result.hash}`
        : `https://goerli-optimism.etherscan.io/tx/${result.hash}`;
    } catch (error) {
      dispatch(setLoader(""));
      return {
        error,
        message: error.message ? error.message : "something went wrong! check your connected network and try again.",
      };
    }
  }

  try {
    tx = await contract.mintBatch(account, ids, uris);
    await tx.wait();
  } catch (error) {
    dispatch(setLoader(""));
    dispatch(
      setNotification({
        message: `${error.message}`,
        type: "error",
      })
    );
    return;
  }
  dispatch(setLoader(""));
  dispatch(
    setNotification({
      message: "NFTs successfully minted.",
      type: "success",
    })
  );
  return mainnet ? `https://aurorascan.dev/tx/${tx.hash}` : `https://testnet.aurorascan.dev/tx/${tx.hash}`;
}

export async function PurchaseNft(buyProps) {
  const { dispatch, nftDetails, account, connector, mainnet } = buyProps;
  dispatch(setLoader("executing transaction..."));
  initAlgoClients(mainnet);
  const params = await algodTxnClient.getTransactionParams().do();
  const enc = new TextEncoder();
  const note = enc.encode("Nft Purchase");
  const note2 = enc.encode("Platform fee");
  const txns = [];
  const userBalance = await algodClient.accountInformation(account).do();
  if (algosdk.microalgosToAlgos(userBalance.amount) <= nftDetails.price) {
    dispatch(
      setNotification({
        message: "insufficent fund to cover cost",
        type: "warning",
      })
    );
    return false;
  }
  const appId = mainnet ? 939259299 : 121305178;

  const optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: account,
    to: account,
    closeRemainderTo: undefined,
    amount: 0,
    assetIndex: nftDetails.Id,
    suggestedParams: params,
  });

  const platformFee = (nftDetails.price * 10) / 100;
  const sellerFee = nftDetails.price - platformFee;

  const paySeller = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: nftDetails.owner,
    amount: sellerFee * 1000000,
    note,
    suggestedParams: params,
  });
  txns.push(paySeller);

  const payTax = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: "AUF2C2IRJQMBXEG6CMB4EOKXQPNDEMCLZT7UJ4KYZAMIAFBNFCCBHG6KNQ",
    amount: platformFee * 1000000,
    note: note2,
    suggestedParams: params,
  });
  txns.push(payTax);

  // const appOptinTx = algosdk.makeApplicationOptInTxn(account, params, appId);

  const app_args = [new Uint8Array(Buffer.from("buy")), new Uint8Array(Buffer.from(nftDetails.owner))];

  const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MNEMONIC);
  const buyTxn = algosdk.makeApplicationCallTxnFromObject({
    from: account,
    suggestedParams: params,
    appIndex: appId,
    appArgs: app_args,
    accounts: [nftDetails.manager, manager.addr],
    foreignAssets: [nftDetails.Id],
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  });
  const appCloseTxn = algosdk.makeApplicationCloseOutTxn(nftDetails.manager, params, appId);
  const refundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: nftDetails.manager,
    to: nftDetails.manager,
    amount: 0,
    note,
    suggestedParams: params,
    closeRemainderTo: nftDetails.owner,
  });

  console.log("txes", appCloseTxn, refundTxn, params);

  const txList = [payTax, paySeller, optTxn, buyTxn, appCloseTxn, refundTxn];
  const groupedTx = algosdk.assignGroupID(txList);
  const txnsFromManager = [appCloseTxn, refundTxn];

  const txnsToSign = txList.map((txn) => {
    const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
    if (txnsFromManager.includes(txn)) {
      return {
        txn: encodedTxn,
        message: "Nft Sale",
        // Note: if the transaction does not need to be signed (because it's part of an atomic group
        // that will be signed by another party), specify an empty singers array like so:
        signers: [],
      };
    }
    return {
      txn: encodedTxn,
      message: "Nft Sale",
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    };
  });

  let result;
  try {
    console.log("To Soung??", txnsToSign);
    const request = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
    dispatch(
      setNotification({
        message: "please check your wallet to confirm transaction",
        type: "warning",
      })
    );
    result = await connector.send(request);
  } catch (error) {
    dispatch(
      setNotification({
        message: error.message,
        type: "error",
      })
    );
    throw error;
  }

  console.log("rihanna go girl X Fenty", result, manager.addr);
  const appCloseTxnSigned = appCloseTxn.signTxn(manager.sk);
  const refundTxnSigned = refundTxn.signTxn(manager.sk);

  const decodedResult = result.map((element) => (element ? new Uint8Array(Buffer.from(element, "base64")) : null));
  console.log("dcoded", decodedResult);
  decodedResult[4] = appCloseTxnSigned;
  decodedResult[5] = refundTxnSigned;
  console.log("dcoded 2", decodedResult);
  const tx = await algodTxnClient.sendRawTransaction(decodedResult).do();

  console.log("final tx", tx.txId);

  dispatch(setLoader(""));
  await write.writeNftSale(nftDetails.Id, nftDetails.price, account, tx.txId, nftDetails.owner);
  return mainnet ? `https://algoexplorer.io/tx/${tx.txId}` : `https://testnet.algoexplorer.io/tx/${tx.txId}`;
}

export async function purchasePolygonNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  let wallet;
  let chainId;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider);
    ({ chainId } = provider._network);
  } else {
    wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
    ({ chainId } = connector._network);
  }
  price = ethers.utils.parseEther(price.toString()).toString();
  const signature = await wallet._signTypedData(
    // Domain
    {
      name: "GenaDrop",
      version: "1.0.0",
      chainId,
      verifyingContract: mainnet
        ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    },
    // Types
    {
      NFT: [
        { name: "tokenId", type: "uint256" },
        { name: "account", type: "address" },
        { name: "price", type: "uint256" },
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
      ],
    },
    // Value
    { tokenId, account, price, seller, nftContract }
  );
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
      marketAbi,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const saleTx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("nftSale", [price, tokenId, seller, nftContract, signature]),
      value: price,
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(saleTx);
      await result.wait();
      return mainnet ? `https://polygonscan.com/tx/${result.hash}` : `https://mumbai.polygonscan.com/tx/${result.hash}`;
    } catch (error) {
      console.log("erooric data", error, error.data);
      return dispatch(
        setNotification({
          message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
          type: "warning",
        })
      );
    }
  }
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_POLY_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, signature, { value: price });
    await tx.wait();
    return mainnet ? `https://polygonscan.com/tx/${tx.hash}` : `https://mumbai.polygonscan.com/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export async function purchaseAuroraNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  let wallet;
  let chainId;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider);
    ({ chainId } = provider._network);
  } else {
    wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
    ({ chainId } = connector._network);
  }
  price = ethers.utils.parseEther(price.toString()).toString();
  const signature = await wallet._signTypedData(
    // Domain
    {
      name: "GenaDrop",
      version: "1.0.0",
      chainId,
      verifyingContract: mainnet
        ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
    },
    // Types
    {
      NFT: [
        { name: "tokenId", type: "uint256" },
        { name: "account", type: "address" },
        { name: "price", type: "uint256" },
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
      ],
    },
    // Value
    { tokenId, account, price, seller, nftContract }
  );
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
      marketAbi,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const saleTx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("nftSale", [price, tokenId, seller, nftContract, signature]),
      value: price,
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(saleTx);
      await result.wait();
      return mainnet ? `https://aurorascan.dev/tx/${result.hash}` : `https://testnet.aurorascan.dev/tx/${result.hash}`;
    } catch (error) {
      console.log("erooric data", error, error.data);
      return dispatch(
        setNotification({
          message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
          type: "warning",
        })
      );
    }
  }
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_AURORA_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_AURORA_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, signature, { value: price });
    await tx.wait();
    return mainnet ? `https://aurorascan.dev/tx/${tx.hash}` : `https://testnet.aurorascan.dev/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export async function purchaseArbitrumNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  const { chainId } = connector._network;
  price = ethers.utils.parseEther(price.toString()).toString();
  const signature = await wallet._signTypedData(
    // Domain
    {
      name: "GenaDrop",
      version: "1.0.0",
      chainId,
      verifyingContract: mainnet
        ? process.env.REACT_APP_GENADROP_ARBITRUM_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_ARBITRUM_TESTNET_MARKET_ADDRESS,
    },
    // Types
    {
      NFT: [
        { name: "tokenId", type: "uint256" },
        { name: "account", type: "address" },
        { name: "price", type: "uint256" },
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
      ],
    },
    // Value
    { tokenId, account, price, seller, nftContract }
  );
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_ARBITRUM_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_ARBITRUM_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, signature, { value: price });
    await tx.wait();
    return mainnet ? `https://arbiscan.io/tx/${tx.hash}` : `https://goerli.arbiscan.io/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export async function purchaseOptimismNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  const { chainId } = connector._network;
  price = ethers.utils.parseEther(price.toString()).toString();
  const signature = await wallet._signTypedData(
    // Domain
    {
      name: "GenaDrop",
      version: "1.0.0",
      chainId,
      verifyingContract: mainnet
        ? process.env.REACT_APP_GENADROP_OPTIMISM_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_OPTIMISM_TESTNET_MARKET_ADDRESS,
    },
    // Types
    {
      NFT: [
        { name: "tokenId", type: "uint256" },
        { name: "account", type: "address" },
        { name: "price", type: "uint256" },
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
      ],
    },
    // Value
    { tokenId, account, price, seller, nftContract }
  );
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_OPTIMISM_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_OPTIMISM_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, signature, { value: price });
    await tx.wait();
    return mainnet
      ? `https://optimistic.etherscan.io/tx/${tx.hash}`
      : `https://goerli-optimism.etherscan.io/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export async function purchaseCeloNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  console.log(buyProps);
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  let wallet;
  let chainId;
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider);
    ({ chainId } = provider._network);
  } else {
    wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
    ({ chainId } = connector._network);
  }
  price = ethers.utils.parseEther(price.toString()).toString();
  const signature = await wallet._signTypedData(
    // Domain
    {
      name: "GenaDrop",
      version: "1.0.0",
      chainId,
      verifyingContract: mainnet
        ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
    },
    // Types
    {
      NFT: [
        { name: "tokenId", type: "uint256" },
        { name: "account", type: "address" },
        { name: "price", type: "uint256" },
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
      ],
    },
    // Value
    { tokenId, account, price, seller, nftContract }
  );
  if (connector.isWalletConnect) {
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      mainnet
        ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
      marketAbi,
      signer
    );
    const ethNonce = await signer.getTransactionCount();
    const saleTx = {
      from: account,
      to: contract.address,
      // gasLimit: ethers.utils.hexlify(250000), change tx from legacy later
      // gasPrice: ethers.utils.parseUnits('5', "gwei"),
      data: contract.interface.encodeFunctionData("nftSale", [price, tokenId, seller, nftContract, signature]),
      value: price,
      nonce: ethNonce,
    };
    try {
      const result = await signer.sendTransaction(saleTx);
      await result.wait();
      return mainnet
        ? `https://blockscout.celo.org/tx/${result.hash}`
        : `https://alfajores-blockscout.celo-testnet.org/tx/${result.hash}`;
    } catch (error) {
      console.log("erooric data", error, error.data);
      return dispatch(
        setNotification({
          message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
          type: "warning",
        })
      );
    }
  }
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_CELO_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, signature, { value: price });
    await tx.wait();
    return mainnet
      ? `https://explorer.celo.org/mainnet/tx/${tx.hash}`
      : `https://explorer.celo.org/alfajores/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export async function purchaseAvaxNfts(buyProps) {
  const { dispatch, account, connector, mainnet, nftDetails } = buyProps;
  let { tokenID: tokenId, price, owner: seller, collection_contract: nftContract } = nftDetails;
  if (!connector) {
    return dispatch(
      setNotification({
        message: "connect wallet",
        type: "warning",
      })
    );
  }
  const wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector);
  const { chainId } = connector._network;
  price = ethers.utils.parseEther(price.toString()).toString();
  const signature = await wallet._signTypedData(
    // Domain
    {
      name: "GenaDrop",
      version: "1.0.0",
      chainId,
      verifyingContract: mainnet
        ? process.env.REACT_APP_GENADROP_AVAX_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_GENADROP_AVAX_TESTNET_MARKET_ADDRESS,
    },
    // Types
    {
      NFT: [
        { name: "tokenId", type: "uint256" },
        { name: "account", type: "address" },
        { name: "price", type: "uint256" },
        { name: "seller", type: "address" },
        { name: "nftContract", type: "address" },
      ],
    },
    // Value
    { tokenId, account, price, seller, nftContract }
  );
  const contract = new ethers.Contract(
    mainnet
      ? process.env.REACT_APP_GENADROP_AVAX_MAINNET_MARKET_ADDRESS
      : process.env.REACT_APP_GENADROP_AVAX_TESTNET_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  );
  try {
    const tx = await contract.nftSale(price, tokenId, seller, nftContract, signature, { value: price });
    await tx.wait();
    return mainnet ? `https://snowtrace.io/tx/${tx.hash}` : `https://testnet.snowtrace.io/tx/${tx.hash}`;
  } catch (error) {
    console.log("erooric data", error, error.data);
    return dispatch(
      setNotification({
        message: error.data ? error.data.message.substring(0, 48) : error.message.substring(0, 48),
        type: "warning",
      })
    );
  }
}

export { pinata, write };
