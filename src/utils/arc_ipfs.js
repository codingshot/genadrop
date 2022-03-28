import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import JSZip from 'jszip';
import { ethers } from 'ethers';

const algosdk = require('algosdk');
const bs58 = require('bs58');
const config = require('./arc_config');
const algoAddress = config.algodClientUrl;
const algoNode = config.algodNodeUrl;
const algoMainAddress = config.algodMainClientUrl;
const algoMainNode = config.algodMainNodeUrl;
const algodClientPort = config.algodClientPort;
const algoToken = config.algodClientToken;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_SECRET_KEY;
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);
const axios = require('axios');
const FormData = require('form-data');
const write = require('./firebase');
const marketAbi = require('./marketAbi.json');

/*
TODO: change conditional addresses once mainnet address is ready!
*/


let algodClient;

let algodTxnClient;

function initAlgoClients(mainnet) {
  algodClient = new algosdk.Algodv2(
    algoToken,
    mainnet ? algoMainAddress : algoAddress,
    algodClientPort
  );
  
  algodTxnClient = new algosdk.Algodv2(
    algoToken,
    mainnet ? algoMainNode : algoNode,
    algodClientPort
  );
}

let mintCollectionAbi = [
  'function createCollection(string memory _name, string memory _symbol, address manager) public {}',
  'function collectionsOf(address user) public view returns (address[] memory)',
];

let mintSingle = [
  'function mint(address to, uint256 id, uint256 amount, string memory uri, bytes memory data) public {}',
];

let marketAi = ['function getMarketItems() public view {}'];

let mintAbi = [
  'function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}',
];

const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const pinFileToIPFS = async (
  pinataApiKey,
  pinataSecretApiKey,
  file,
  metadata,
  option
) => {
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
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      //handle error here
    });
};

const waitForConfirmation = async function (txId) {
  let response = await algodTxnClient.status().do();
  let lastround = response['last-round'];
  while (true) {
    const pendingInfo = await algodTxnClient
      .pendingTransactionInformation(txId)
      .do();
    if (
      pendingInfo['confirmed-round'] !== null &&
      pendingInfo['confirmed-round'] > 0
    ) {
      break;
    }
    lastround++;
    await algodTxnClient.statusAfterBlock(lastround).do();
  }
};

const convertIpfsCidV0ToByte32 = (cid) => {
  let hex = `${bs58.decode(cid).slice(2).toString('hex')}`;
  let base64 = `${bs58.decode(cid).slice(2).toString('base64')}`;

  const buffer = Buffer.from(
    bs58.decode(cid).slice(2).toString('base64'),
    'base64'
  );

  return { base64, hex, buffer };
};

const uploadToIpfs = async (nftFile, nftFileName, asset) => {
  let fileCat = 'image';

  let nftFileNameSplit = nftFileName.split('.');
  let fileExt = nftFileNameSplit[1];

  let kvProperties = {
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

  const resultFile = await pinFileToIPFS(
    pinataApiKey,
    pinataApiSecret,
    nftFile,
    pinataMetadata,
    pinataOptions
  );

  let metadata = config.arc3MetadataJSON;
  let integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash);
  metadata.properties = [...asset.attributes];
  metadata.name = asset.name;
  metadata.description = asset.description;
  metadata.image = `ipfs://${resultFile.IpfsHash}`;
  metadata.image_integrity = `${integrity.base64}`;
  metadata.image_mimetype = `${fileCat}/${fileExt}`;

  const resultMeta = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: { name: asset.name },
  });
  let jsonIntegrity = convertIpfsCidV0ToByte32(resultMeta.IpfsHash);
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
    alert(
      'We encountered issues uploading your file. Pease check your network and try again'
    );
  }
};

export async function mintSingleToAlgo(algoMintProps) {
  const {
    file,
    metadata,
    account,
    connector,
    dispatch,
    setNotification,
    price,
  } = algoMintProps;
  initAlgoClients(mainnet);
  if (connector.isWalletConnect && connector.chainId === 4160) {
    dispatch(setNotification('uploading to ipfs'));
    // notification: uploading to ipfs
    const asset = await connectAndMint(file, metadata, file.name);
    const txn = await createAsset(asset, account);
    // notification: asset uploaded, minting in progress
    dispatch(setNotification('asset uploaded, minting in progress'));
    console.log('prtxn', txn);
    let assetID = await signTx(connector, [txn]);
    await write.writeNft(account, undefined, assetID, price, false, null, null, mainnet);
    // notification: asset minted
    dispatch(setNotification('asset minted successfully'));
    return `https://testnet.algoexplorer.io/asset/${assetID}`;
  } else {
    return {
      message:
        'connect to alogrand network on your wallet or select a different network',
    };
  }
}

export async function mintSingleToPoly(singleMintProps) {
  const { file, metadata, price, account, connector, dispatch, setLoader, mainnet } = singleMintProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: 'not yet implemented' };
    } else {
      return {
        message:
          'please connect to polygon network on your wallet or select a different network',
      };
    }
  } else {
    const signer = await connector.getSigner();
    dispatch(setLoader('uploading 1 of 1'));
    const asset = await connectAndMint(file, metadata, file.name);
    let uintArray = asset.metadata.toLocaleString();
    let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
    dispatch(setLoader('minting 1 of 1'))
    const contract = new ethers.Contract(
      mainnet ? process.env.REACT_APP_GENA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_GENA_SINGLE_ADDRESS,
      mintSingle,
      signer
    )
    let wallet = new ethers.Wallet(
      process.env.REACT_APP_GENADROP_SERVER_KEY,
      connector
    )
    const marketContract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_POLY_MARKET_ADDRESS, marketAbi, wallet)
    let txn;
    console.log(id, account)
    try {
      txn = await contract.mint(account, id, 1, asset.url, '0x');
      await txn.wait();
      console.log(id, account, txn)
      let listingTx = await marketContract.createMarketplaceItem(contract.address, id, String(price*10**18), 'General', account)
      dispatch(setLoader(''))
      return mainnet ? `https://polygonscan.com/tx/${txn.hash}` : `https://mumbai.polygonscan.com/tx/${txn.hash}`;
    } catch (error) {
      dispatch(setLoader(''));
      console.log(error);
      return {
        error,
        message:
          'something went wrong! please check your connected network and try again.',
      };
    }
  }
}

export async function mintSingleToCelo(singleMintProps) {
  const { file, metadata, price, account, connector, dispatch, setLoader, mainnet } = singleMintProps;
  if (connector.isWalletConnect) {
    console.log('welcome');
    if (connector.chainId === 137) {
      return { message: 'not yet implemented' };
    } else {
      return {
        message:
          'please connect to polygon network on your wallet or select a different network',
      };
    }
  } else {
    console.log('cnt', connector, connector.network.chainId);
    const signer = await connector.getSigner();
    dispatch(setLoader('uploading 1 of 1'));
    const asset = await connectAndMint(file, metadata, file.name);
    let uintArray = asset.metadata.toLocaleString();
    let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
    dispatch(setLoader('minting 1 of 1'))
    const contract = new ethers.Contract(mainnet ? process.env.REACT_APP_CELO_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_CELO_SINGLE_ADDRESS, mintSingle, signer)
    let wallet = new ethers.Wallet(mainnet ? process.env.REACT_APP_GENADROP_SERVER_KEY : process.env.REACT_APP_GENADROP_SERVER_KEY, connector)
    const marketContract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_CELO_MARKET_ADDRESS, marketAbi, wallet)
    let txn;
    try {
      txn = await contract.mint(account, id, 1, asset.url, '0x');
      // let listingTx = await marketContract.createMarketplaceItem(contract.address, id, String(price*10**18), 'General', account)
      dispatch(setLoader(''))
      return mainnet ? `https://celo-testnet.org/tx/${txn.hash}` : `https://alfajores-blockscout.celo-testnet.org/tx/${txn.hash}`;
    } catch (error) {
      dispatch(setLoader(''));
      console.log(error);
      return {
        error,
        message:
          'something went wrong! please check your connected network and try again.',
      };
    }
  }
}

export async function mintSingleToNear(singleMintProps) {
  const { file, metadata, price, account, connector, dispatch, setLoader, mainnet } = singleMintProps;
  if (connector.isWalletConnect) {
    console.log('welcome');
    if (connector.chainId === 137) {
      return { message: 'not yet implemented' };
    } else {
      return {
        message:
          'please connect to polygon network on your wallet or select a different network',
      };
    }
  } else {
    console.log('cnt', connector);
    const signer = await connector.getSigner();
    dispatch(setLoader('uploading 1 of 1'));
    const asset = await connectAndMint(file, metadata, file.name);
    let uintArray = asset.metadata.toLocaleString();
    let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
    dispatch(setLoader('minting 1 of 1'))
    const contract = new ethers.Contract(mainnet ? process.env.REACT_APP_AURORA_MAINNET_SINGLE_ADDRESS : process.env.REACT_APP_AURORA_SINGLE_ADDRESS, mintSingle, signer)
    let wallet = new ethers.Wallet(mainnet ? process.env.REACT_APP_GENADROP_SERVER_KEY : process.env.REACT_APP_GENADROP_SERVER_KEY, connector)
    const marketContract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_NEAR_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_NEAR_MARKET_ADDRESS, marketAbi, wallet)
    let txn;
    try {
      txn = await contract.mint(account, id, 1, asset.url, '0x');
      await txn.wait();
      let listingTx = await marketContract.createMarketplaceItem(contract.address, id, String(price*10**18), 'General', account)
      dispatch(setLoader(''))
      return mainnet ? `https://aurorascan.dev/tx/${txn.hash}` : `https://testnet.aurorascan.dev/tx/${txn.hash}`;
    } catch (error) {
      dispatch(setLoader(''));
      console.log(error);
      return {
        error,
        message:
          'something went wrong! please check your connected network and try again.',
      };
    }
  }
}

async function createAsset(asset, account) {
  const params = await algodTxnClient.getTransactionParams().do();

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
  console.log('aigning...', txns);
  let assetID;
  const txnsToSign = txns.map((txn) => {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString('base64');
    return {
      txn: encodedTxn,
      message: 'Nft Minting',
      // Note: if the transaction does not need to be signed (because it's part of an atomic group
      // that will be signed by another party), specify an empty singers array like so:
      // signers: [],
    };
  });
  const requestParams = [txnsToSign];
  console.log(requestParams);
  let result;
  try {
    const request = formatJsonRpcRequest('algo_signTxn', requestParams);
    alert('please check wallet to confirm transaction');
    console.log(request);
    result = await connector.send(request);
  } catch (error) {
    console.log('signature error', error);
    alert(error);
    throw error;
  }
  console.log('Signed');
  const decodedResult = result.map((element) => {
    return element ? new Uint8Array(Buffer.from(element, 'base64')) : null;
  });
  console.log('afeter decoding');
  let tx = await algodTxnClient.sendRawTransaction(decodedResult).do();
  // const decoded = algosdk.decodeSignedTransaction(decodedResult);
  // const fromdc = decoded.txn.from
  console.log('afeter tx', tx);
  const confirmedTxn = await waitForConfirmation(tx.txId);
  const ptx = await algodTxnClient.pendingTransactionInformation(tx.txId).do();
  assetID = ptx['asset-index'];
  console.log('final', ptx, assetID);
  // console.log('Account: ',account,' Has created ASA with ID: ', assetID);
  return assetID;
}

export async function createNFT(createProps) {
  const { file, dispatch, setNotification, setLoader } = createProps;
  let assets = [];
  const zip = new JSZip();
  const data = await zip.loadAsync(file);

  const files = data.files['metadata.json'];
  const metadataString = await files.async('string');
  const metadata = JSON.parse(metadataString);

  dispatch(
    setNotification('uploading assets, please do not refresh your page.')
  );
  for (let i = 0; i < metadata.length; i++) {
    dispatch(setLoader(`uploading ${i + 1} of ${metadata.length}`));
    let imgName = `${metadata[i].name}.png`;
    let imgFile = data.files[imgName];
    const uint8array = await imgFile.async('uint8array');
    const blob = new File([uint8array], imgName, { type: 'image/png' });
    const asset = await connectAndMint(blob, metadata[i], imgName);
    assets.push(asset);
  }
  dispatch(setLoader(''));
  dispatch(setNotification('uploaded successfully'));
  return assets;
}

export async function initializeContract(contractProps) {
  const {
    minterAddress,
    marketAddress,
    fileName,
    connector,
    account,
    dispatch,
    setLoader,
  } = contractProps;
  let name = fileName.split('-')[0];
  const signer = await connector.getSigner();
  const collectionContract = new ethers.Contract(
    minterAddress,
    mintCollectionAbi,
    signer
  );
  let tx = await collectionContract.createCollection(
    name,
    name.substring(0, 3).toUpperCase(),
    marketAddress
  );
  // console.log(tx.hash)
  dispatch(setLoader('minting'));
  await tx.wait();
  dispatch(setLoader(''));
  let getCollectionAddresses = await collectionContract.collectionsOf(account);
  // console.log(getCollectionAddresses)
  let collectionAddresses = [...getCollectionAddresses];
  // console.log(collectionAddresses)
  const contract = new ethers.Contract(
    collectionAddresses.pop(),
    mintAbi,
    signer
  );
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
  } = algoProps;
  initAlgoClients(mainnet);
  if (connector.isWalletConnect && connector.chainId === 4160) {
    const ipfsJsonData = await createNFT({ ...algoProps });
    let collection_id = [];
    let txns = [];
    dispatch(setNotification('preparing assets for minting'));
    for (let i = 0; i < ipfsJsonData.length; i++) {
      dispatch(setLoader(`minting ${i + 1} of ${ipfsJsonData.length}`));
      const txn = await createAsset(ipfsJsonData[i], account);
      txns.push(txn);
    }

    let txgroup = algosdk.assignGroupID(txns);


    let groupId = txgroup[0].group.toString('base64');
    dispatch(setLoader('finalizing'));
    let assetID = await signTx(connector, txns);
    for (let nfts = 0; nfts < ipfsJsonData.length; nfts++) {
      collection_id.push(assetID + nfts);
    }
    const collectionHash = await pinata.pinJSONToIPFS(collection_id, {
      pinataMetadata: { name: `collection` },
    });
    let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
    await write.writeUserData(
      account,
      collectionUrl,
      fileName,
      collection_id,
      price,
      description,
      mainnet
    );
    dispatch(setLoader(''));
    dispatch(setNotification('you have successfully minted your NFTs'));
    return `https://testnet.algoexplorer.io/tx/group/${groupId}`;
  } else {
    dispatch(
      setNotification(
        'connect wallet to algorand network or select a different chain'
      )
    );
  }
}

export async function mintToCelo(celoProps) {
  const { price, account, connector, fileName, dispatch, setNotification, setLoader, mainnet } = celoProps;
  if (typeof window.ethereum !== 'undefined') {
    const ipfsJsonData = await createNFT({ ...celoProps });
    dispatch(setNotification('preparing assets for minting'));
    // yet to deploy evms on mainnet, so still using testnet addresses for now
    const contract = await initializeContract({ minterAddress: mainnet ? process.env.REACT_APP_CELO_MAINNET_MINTER_ADDRESS : process.env.REACT_APP_CELO_MINTER_ADDRESS, marketAddress: mainnet ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_CELO_MARKET_ADDRESS, fileName, connector, account, dispatch, setLoader });
    let wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector)
    const signer = await connector.getSigner();
    const marketContract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_CELO_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_CELO_MARKET_ADDRESS, marketAbi, wallet)
    let uris = ipfsJsonData.map((asset) => asset.url);
    console.log(ipfsJsonData);
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.toLocaleString();
      return parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
    });

    let amounts = new Array(ids.length).fill(1);
    let tx;
    dispatch(setLoader('finalizing'));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, '0x');
      await tx.wait();
      console.log(ids, amounts, account, contract.address, price)
      // let listingTx = await marketContract.createBulkMarketItem("0x008EeeDFa0B9310960818e94C8Bf1879f1c5da18", ["46169"], "100000", ["1"], 'General', "0xB4bE310666D2f909789Fb1a2FD09a9bEB0Edd99D")
    } catch (error) {
      console.log(error);
      dispatch(setLoader(''));
      return;
    }
    dispatch(setLoader(''))
    dispatch(setNotification('NFTs successfully minted.'))
    return mainnet ? `https://blockscout.celo.org/tx/${tx.hash}` : `https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`
  } else {
    dispatch(setNotification('download metamask'));
  }
}

export async function mintToPoly(polyProps) {
  const {
    price,
    account,
    connector,
    fileName,
    dispatch,
    setNotification,
    setLoader,
    mainnet
  } = polyProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: 'not yet implemented' };
    } else {
      return {
        message:
          'connect wallet to polygon network or select a different chain',
      };
    }
  } else {
    const ipfsJsonData = await createNFT({ ...polyProps });
    dispatch(setNotification('preparing assets for minting'));
    const contract = await initializeContract({ minterAddress: mainnet ? process.env.REACT_APP_POLY_MAINNET_MINTER_ADDRESS : process.env.REACT_APP_POLY_MINTER_ADDRESS, marketAddress: mainnet ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_POLY_MARKET_ADDRESS, fileName, connector, account, dispatch, setLoader });
    let wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector)
    const marketContract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_POLY_MARKET_ADDRESS, marketAbi, wallet)
    
    // return;
    let uris = ipfsJsonData.map((asset) => asset.url);
    // generate random ids for the nft
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.toLocaleString();
      let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
      return id;
    });

    let amounts = new Array(ids.length).fill(1);
    let tx;

    dispatch(setLoader('finalizing'));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, '0x');
      await tx.wait();
      let listingTx = await marketContract.createBulkMarketItem(
        contract.address,
        ids,
        String(price * 10 ** 18),
        amounts,
        'General',
        account
      );
    } catch (error) {
      console.log('opolo', error);
      dispatch(setLoader(''));
      dispatch(setNotification(`${error.message}`));
      return;
    }
    dispatch(setLoader(''))
    dispatch(setNotification('NFTs successfully minted.'))
    return mainnet ? `https://polygonscan.com/tx/${tx.hash}` : `https://mumbai.polygonscan.com/tx/${tx.hash}`
  }
}

export async function PurchaseNft(asset, account, connector, mainnet) {
  initAlgoClients(mainnet)
  if (!connector.isWalletConnect && !(connector.chainId === 4160)) {
    alert('connect wallet to algorand network');
    return;
  }
  const params = await algodTxnClient.getTransactionParams().do();
  console.log('parag', asset)
  const enc = new TextEncoder();
  const note = enc.encode('Nft Purchase');
  const note2 = enc.encode('Platform fee');
  console.log(note2);
  let txns = [];
  if (!connector) {
    alert('Please connect your wallet');
    return;
  }

  let userBalance = await algodClient.accountInformation(account).do();
  console.log(userBalance);
  if (algosdk.microalgosToAlgos(userBalance.account.amount) <= asset.price) {
    alert('insufficent fund to cover cost');
    return false;
  }

  let optTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: account,
    to: account,
    closeRemainderTo: undefined,
    amount: 0,
    assetIndex: asset.Id,
    suggestedParams: params,
  });
  txns.push(optTxn);
  let platformFee = (asset.price * 10) / 100;
  let sellerFee = asset.price - platformFee;

  let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: asset.owner,
    amount: sellerFee * 1000000,
    note: note,
    suggestedParams: params,
  });
  txns.push(txn);

  let txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account,
    to: process.env.REACT_APP_GENADROP_MANAGER_ADDRESS,
    amount: platformFee * 1000000,
    note: note2,
    suggestedParams: params,
  });
  txns.push(txn2);
  let signedTxn;
  let txgroup = algosdk.assignGroupID(txns);
  console.log('opp', txgroup);
  try {
    signedTxn = await signTx(connector, txns);
  } catch (error) {
    alert(error.message);
    return;
  }

  let rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    process.env.REACT_APP_GENADROP_MANAGER_ADDRESS,
    account,
    undefined,
    asset.owner,
    1,
    note,
    asset.Id,
    params
  );
  let manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MNEMONIC);
  let rawSignedTxn = rtxn.signTxn(manager.sk);
  let tx = await algodTxnClient.sendRawTransaction(rawSignedTxn).do();
  console.log('sent')
  const confirmedTxn = await waitForConfirmation(tx.txId);
  await write.writeNft(
    asset.owner,
    asset.collection_name,
    asset.Id,
    asset.price,
    true,
    account,
    new Date(),
    mainnet
  );
  await write.recordTransaction(
    asset.Id,
    'Sale',
    account,
    asset.owner,
    asset.price,
    tx.txId
  );
  // const ret = await signTx(connector, txn)
  return `https://testnet.algoexplorer.io/tx/${tx.txId}`;
}

// console.log(algodClient.getAssetByID(57861336).do().then(data => {console.log(data)}))
export async function getAlgoData(id) {
  initAlgoClients(mainnet);
  let data = await algodClient.getAssetByID(id).do();
  return data;
}

export async function mintToNear(polyProps) {
  const {
    price,
    account,
    connector,
    fileName,
    dispatch,
    setNotification,
    setLoader,
    mainnet
  } = polyProps;
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { message: 'not yet implemented' };
    } else {
      return {
        message:
          'connect wallet to polygon network or select a different chain',
      };
    }
  } else {
    const ipfsJsonData = await createNFT({ ...polyProps });
    dispatch(setNotification('preparing assets for minting'));
    const contract = await initializeContract({ minterAddress: mainnet ? process.env.REACT_APP_AURORA_MAINNET_MINTER_ADDRESS : process.env.REACT_APP_AURORA_MINTER_ADDRESS, marketAddress: mainnet ? process.env.REACT_APP_GENADROP_NEAR_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_NEAR_MARKET_ADDRESS, fileName, connector, account, dispatch, setLoader,  });
    let wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, connector)
    const marketContract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_NEAR_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_NEAR_MARKET_ADDRESS, marketAbi, wallet)
    
    // return;
    let uris = ipfsJsonData.map((asset) => asset.url);
    // generate random ids for the nft
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.toLocaleString();
      let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
      return id;
    });

    let amounts = new Array(ids.length).fill(1);
    let tx;

    dispatch(setLoader('finalizing'));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, '0x');
      await tx.wait();
      let listingTx = await marketContract.createBulkMarketItem(
        contract.address,
        ids,
        String(price * 10 ** 18),
        amounts,
        'General',
        account
      );
    } catch (error) {
      console.log('opolo', error);
      dispatch(setLoader(''));
      dispatch(setNotification(`${error.message}`));
      return;
    }
    dispatch(setLoader(''))
    dispatch(setNotification('NFTs successfully minted.'))
    return mainnet ? `https://aurorascan.dev/tx/${tx.hash}` : `https://testnet.aurorascan.dev/tx/${tx.hash}`;
  }
}

export async function getPolygonNfts(mainnet) {
  let provider = new ethers.providers.AlchemyProvider("maticmum", process.env.REACT_APP_ALCHEMY_KEY)
  let wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider)
  const contract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_POLY_MARKET_ADDRESS, marketAbi, wallet)
  let art = await contract.getMarketItems()
  return art;
}

export async function getPolygonUserPurchasedNfts(connector, mainnet) {
  //let provider = new ethers.providers.AlchemyProvider("maticmum", process.env.REACT_APP_ALCHEMY_KEY)
  // let wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider)
  if (!connector) {
    return [];
  }
  const contract = new ethers.Contract(mainnet ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_POLY_MARKET_ADDRESS, marketAbi, connector.getSigner())
  let art = await contract.fetchPurchasedNFTs()
  return art;
}

export async function purchasePolygonNfts(connector, mainnet,  itemId, price) {
  //let provider = new ethers.providers.AlchemyProvider("maticmum", process.env.REACT_APP_ALCHEMY_KEY)
  // let wallet = new ethers.Wallet(process.env.REACT_APP_GENADROP_SERVER_KEY, provider)
  if (!connector) {
    return;
  }
  const contract = new ethers.Contract(
    mainnet ? process.env.REACT_APP_GENADROP_POLY_MAINNET_MARKET_ADDRESS : process.env.REACT_APP_GENADROP_POLY_MARKET_ADDRESS,
    marketAbi,
    connector.getSigner()
  )
  try {
    let art = await contract.nftSale(itemId, { value: price });
  } catch (error) {
    console.log(error);
  }
  return true;
}

export { pinata, write };
