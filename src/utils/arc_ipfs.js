import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import JSZip from 'jszip';
import { ethers } from "ethers";

const algosdk = require('algosdk');
const bs58 = require("bs58");
const config = require("./arc_config");
const algoAddress = config.algodClientUrl;
const algodClientPort = config.algodClientPort;
const algoToken = config.algodClientToken;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_SECRET_KEY;
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);
const axios = require('axios');
const FormData = require('form-data');
const write = require('./firebase');


const algodClient = new algosdk.Algodv2(
  algoToken,
  algoAddress,
  algodClientPort
);

let mintCollectionAbi = [
  "function createCollection(string memory _name, string memory _symbol) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)"
];

let mintSingle = [
  "function createToken(string memory tokenURI) public {}"
];

let mintAbi = [
  "function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}"
];

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const pinFileToIPFS = async (pinataApiKey, pinataSecretApiKey, file, metadata, option) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append('file', file);
  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  data.append('pinataMetadata', metadata);
  //pinataOptions are optional
  data.append('pinataOptions', option);
  return axios
    .post(url, data, {
      maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
      headers: {
        // 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey
      }
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      //handle error here
    });
};

const waitForConfirmation = async function (txId) {
  let response = await algodClient.status().do();
  let lastround = response["last-round"];
  while (true) {
    const pendingInfo = await algodClient
      .pendingTransactionInformation(txId)
      .do();
    if (
      pendingInfo["confirmed-round"] !== null &&
      pendingInfo["confirmed-round"] > 0
    ) {
      break;
    }
    lastround++;
    await algodClient.statusAfterBlock(lastround).do();
  }
}

const convertIpfsCidV0ToByte32 = (cid) => {
  let hex = `${bs58.decode(cid).slice(2).toString('hex')}`
  let base64 = `${bs58.decode(cid).slice(2).toString('base64')}`

  const buffer = Buffer.from(bs58.decode(cid).slice(2).toString('base64'), 'base64');

  return { base64, hex, buffer };
};

const uploadToIpfs = async (nftFile, nftFileName, asset) => {
  let fileCat = 'image';

  let nftFileNameSplit = nftFileName.split('.')
  let fileExt = nftFileNameSplit[1];



  let kvProperties = {
    "url": nftFileNameSplit[0],
    "mimetype": `image/${fileExt}`,
  };
  const pinataMetadata = JSON.stringify(
    {
      name: asset.name,
      keyvalues: kvProperties
    });

  const pinataOptions = JSON.stringify(
    {
      cidVersion: 0,
    });

  const resultFile = await pinFileToIPFS(pinataApiKey, pinataApiSecret, nftFile, pinataMetadata, pinataOptions);

  let metadata = config.arc3MetadataJSON;
  let integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash)
  metadata.properties = [...asset.attributes]
  metadata.name = asset.name;
  metadata.description = asset.description;
  metadata.image = `ipfs://${resultFile.IpfsHash}`;
  metadata.image_integrity = `${integrity.base64}`;;
  metadata.image_mimetype = `${fileCat}/${fileExt}`;

  const resultMeta = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: asset.name } });
  let jsonIntegrity = convertIpfsCidV0ToByte32(resultMeta.IpfsHash)
  return {
    name: asset.name,
    url: `ipfs://${resultMeta.IpfsHash}`,
    metadata: jsonIntegrity.buffer,
    integrity: jsonIntegrity.base64,
  }
};

export const connectAndMint = async (file, metadata, imgName) => {
  try {
    await pinata.testAuthentication();
    return await uploadToIpfs(file, imgName, metadata);
  } catch (error) {
    console.error(error)
    alert('We encountered issues uploading your file. Pease check your network and try again')
  }
}

export async function mintSingleToAlgo(algoMintProps) {
  const { file, metadata, account, connector, dispatch, setNotification, price } = algoMintProps;
  console.log(connector.chainId !== 4160)
  if (connector.isWalletConnect && connector.chainId === 4160) {
    dispatch(setNotification('uploading to ipfs'))
    // notification: uploading to ipfs
    const asset = await connectAndMint(file, metadata, file.name)
    const txn = await createAsset(asset, account);
    // notification: asset uploaded, minting in progress
    dispatch(setNotification('asset uploaded, minting in progress'))
    let assetID = await signTx(connector, [txn]);
    await write.writeNft(account, undefined, assetID, price, false, null, null);
    // notification: asset minted
    dispatch(setNotification('asset minted successfully'))
    return `https://testnet.algoexplorer.io/asset/${assetID}`;
  } else {
    return { 'message': "connect to alogrand network on your wallet or select a different network" }
  }
}

export async function mintSingleToPoly(singleMintProps) {
  const { file, metadata, connector, dispatch, setLoader } = singleMintProps;
  if (connector.isWalletConnect) {
    console.log('welcome');
    if (connector.chainId === 137) {
      return { 'message': "not yet implemented" }
    } else {
      return { 'message': "please connect to polygon network on your wallet or select a different network" }
    }
  } else {
    const signer = await connector.getSigner();
    dispatch(setLoader('uploading 1 of 1'))
    const asset = await connectAndMint(file, metadata, file.name);
    dispatch(setLoader('minting 1 of 1'))
    const contract = new ethers.Contract(process.env.REACT_APP_GENA_SINGLE_ADDRESS, mintSingle, signer)
    let txn;
    try {
      txn = await contract.createToken(asset.url);
      dispatch(setLoader(''))
      return `https://mumbai.polygonscan.com/tx/${txn.hash}`;
    } catch (error) {
      dispatch(setLoader(''))
      console.log(error)
      return {error, message: 'something went wrong! please check your connected network and try again.'};
    }
  }
}

async function createAsset(asset, account) {
  const params = await algodClient.getTransactionParams().do();

  const defaultFrozen = false;
  const unitName = 'nft';
  const assetName = `${asset.name}@arc3`;
  const url = asset.url;

  const managerAddr = process.env.REACT_APP_GENADROP_MANAGER_ADDRESS;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = process.env.REACT_APP_GENADROP_MANAGER_ADDRESS;
  const decimals = 0;
  const total = 1;
  const metadata = asset.metadata;
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
  const txnsToSign = txns.map(txn => {
    const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
    return {
      txn: encodedTxn,
      message: 'Nft Minting',
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    };
  });
  const requestParams = [txnsToSign];
  let result;
  try {
    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    alert('please check wallet to confirm transaction')
    result = await connector.send(request);
  } catch (error) {
    alert(error)
    throw error;
  }
  const decodedResult = result.map(element => {
    return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
  });
  let tx = await algodClient.sendRawTransaction(decodedResult).do();
  // const decoded = algosdk.decodeSignedTransaction(decodedResult);
  // const fromdc = decoded.txn.from
  const confirmedTxn = await waitForConfirmation(tx.txId);
  console.log('confam', tx.txId)
  const ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
  assetID = ptx["asset-index"];
  console.log('asset id', Buffer.from(decodedResult[0]).toString('hex'));
  // console.log('Account: ',account,' Has created ASA with ID: ', assetID);
  return assetID;
}

export async function createNFT(createProps) {
  const { file, dispatch, setNotification, setLoader } = createProps;
  let assets = [];
  const zip = new JSZip();
  const data = await zip.loadAsync(file);

  const files = data.files['metadata.json']
  const metadataString = await files.async('string')
  const metadata = JSON.parse(metadataString)

  dispatch(setNotification('uploading assets, please do not refresh your page.'))
  for (let i = 0; i < metadata.length; i++) {
    console.log(`uploading ${i + 1} of ${metadata.length}`);
    dispatch(setLoader(`uploading ${i + 1} of ${metadata.length}`));
    let imgName = `${metadata[i].name}.png`
    let imgFile = data.files[imgName]
    const uint8array = await imgFile.async("uint8array");
    const blob = new File([uint8array], imgName, { type: "image/png" });
    const asset = await connectAndMint(blob, metadata[i], imgName)
    assets.push(asset);
  }
  dispatch(setLoader(''))
  dispatch(setNotification('uploaded successfully'))
  return assets;
};

export async function initializeContract(contractProps) {
  const { minterAddress, fileName, connector, account, dispatch, setLoader } = contractProps;
  let name = fileName.split('-')[0]
  const signer = await connector.getSigner();
  console.log('granted..')
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  console.log('habibi', name, account, collectionContract);
  let tx = await collectionContract.createCollection(name, name.substring(0, 3).toUpperCase())
  // console.log(tx.hash)
  dispatch(setLoader('minting'))
  await tx.wait();
  dispatch(setLoader(''))
  let getCollectionAddresses = await collectionContract.collectionsOf(account);
  // console.log(getCollectionAddresses)
  let collectionAddresses = [...getCollectionAddresses];
  // console.log(collectionAddresses)
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  return contract;
}

export async function mintToAlgo(algoProps) {
  const { ipfsJsonData, price, account, connector, fileName, dispatch, setNotification, setLoader } = algoProps;
  if (connector.isWalletConnect && connector.chainId === 4160) {
    let collection_id = [];
    let txns = [];
    dispatch(setNotification('preparing assets for minting'));
    for (let i = 0; i < ipfsJsonData.length; i++) {
      dispatch(setLoader(`minting ${i + 1} of ${ipfsJsonData.length}`))
      const txn = await createAsset(ipfsJsonData[i], account)
      txns.push(txn)
    }

    let txgroup = algosdk.assignGroupID(txns)

    let groupId = txgroup[0].group.toString("base64")
    dispatch(setLoader('finalizing'))
    let assetID = await signTx(connector, txns)
    for (let nfts = 0; nfts < ipfsJsonData.length; nfts++) {
      collection_id.push(assetID + nfts)
    }
    const collectionHash = await pinata.pinJSONToIPFS(collection_id, { pinataMetadata: { name: `collection` } })
    let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
    await write.writeUserData(account, collectionUrl, fileName, collection_id, price)
    dispatch(setLoader(''))
    dispatch(setNotification('you have successfully minted your NFTs'));
    return `https://testnet.algoexplorer.io/tx/group/${groupId}`
  } else {
    dispatch(setNotification('connect wallet to algorand network or select a different chain'));
  }
}

export async function mintToCelo(celoProps) {
  const { ipfsJsonData, price, account, connector, fileName, dispatch, setNotification, setLoader } = celoProps;
  if (typeof window.ethereum !== 'undefined') {
    dispatch(setNotification('preparing assets for minting'));
    const contract = await initializeContract({ minterAddress: process.env.REACT_APP_CELO_MINTER_ADDRESS, fileName, connector, account, dispatch, setLoader });
    let uris = ipfsJsonData.map((asset) => asset.url);
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.data.toLocaleString();
      return parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
    })

    let amounts = new Array(ids.length).fill(1);
    let tx;
    dispatch(setLoader('finalizing'));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, '0x');
    } catch (error) {
      console.log(error);
      dispatch(setLoader(''))
      return;
    }
    dispatch(setLoader(''))
    dispatch(setNotification('NFTs successfully minted.'))
    return `https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`
  } else {
    dispatch(setNotification('download metamask'));
  }
}

export async function mintToPoly(polyProps) {
  const { ipfsJsonData, price, account, connector, fileName, dispatch, setNotification, setLoader } = polyProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { 'message': "not yet implemented" }
    } else {
      return { 'message': "connect wallet to polygon network or select a different chain" }
    }
  } else {
    dispatch(setNotification('preparing assets for minting'));
    const contract = await initializeContract({ minterAddress: process.env.REACT_APP_POLY_MINTER_ADDRESS, fileName, connector, account, dispatch, setLoader });
    console.log('ipfsJsonData: ', ipfsJsonData);
    // return;
    let uris = ipfsJsonData.map((asset) => asset.url);
    // generate random ids for the nft
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.toLocaleString();
      let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
      return id
    });

    let amounts = new Array(ids.length).fill(1);
    let tx;
    dispatch(setLoader('finalizing'));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, '0x');
      await tx.wait();
    } catch (error) {
      console.log('opolo', error);
      dispatch(setLoader(''))
      dispatch(setNotification(`${error.message}`))
      return;
    }
    dispatch(setLoader(''))
    dispatch(setNotification('NFTs successfully minted.'))
    return `https://polygonscan.com/tx/${tx.hash}`
  }
}

export async function PurchaseNft(asset, account, connector) {
  const params = await algodClient.getTransactionParams().do();
  const enc = new TextEncoder();
  const note = enc.encode("Nft Purchase");
  const note2 = enc.encode("Platform fee");
  let txns = [];
  if (!connector) {
    alert("Please connect your wallet")
    return;
  }

  let userBalance = await algodClient.accountInformation(account).do()
  if (algosdk.microalgosToAlgos(userBalance.amount) <= asset.price) {
    alert("insufficent fund to cover cost")
    return false;
  }
  
  let optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: account,
    to: account,
    closeRemainderTo: undefined,
    amount: 0,
    assetIndex: asset.Id,
    suggestedParams: params,
  })
  txns.push(optTxn);
  let platformFee = asset.price*10/100
  let sellerFee = asset.price - platformFee


  let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: asset.owner,
    amount: sellerFee*1000000,
    note: note,
    suggestedParams: params,
  })
  let txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: process.env.REACT_APP_GENA_MANAGER_ADDRESS,
    amount: platformFee*1000000,
    note: note2,
    suggestedParams: params,
  })
  txns.push(txn);
  txns.push(txn2);
  let signedTxn;
  let txgroup = algosdk.assignGroupID(txns)
  try {
    signedTxn = await signTx(connector, txns)
  } catch (error) {
    alert(error.message)
    return;
  }

  let rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(process.env.REACT_APP_GENA_MANAGER_ADDRESS, account, undefined, asset.owner, 1, note, asset.Id, params);
  let manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MNEMONIC)
  let rawSignedTxn = rtxn.signTxn(manager.sk)
  let tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
  const confirmedTxn = await waitForConfirmation(tx.txId);
  await write.writeNft(asset.owner, asset.collection_name, asset.Id, asset.price, true, account, new Date())
  await write.recordTransaction(asset.Id, "Sale", account, asset.owner, asset.price, tx.txID)
  // const ret = await signTx(connector, txn)
  return `https://testnet.algoexplorer.io/tx/${tx.txId}`
}

// console.log(algodClient.getAssetByID(57861336).do().then(data => {console.log(data)}))
export async function getAlgoData(id) {
  let data = await algodClient.getAssetByID(id).do()
  return data
}


export {
  pinata,
  write
}

