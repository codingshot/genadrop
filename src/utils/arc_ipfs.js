import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import JSZip from 'jszip';
const algosdk = require('algosdk');
const bs58 = require("bs58");
const config = require("./arc_config")
const algoAddress = config.algodClientUrl;
const algodClientPort = config.algodClientPort;
const algoToken = config.algodClientToken;
const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
const pinataApiSecret = process.env.REACT_APP_PINATA_SECRET_KEY;
console.log('pins', pinataApiKey, pinataApiSecret);
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);
const axios = require('axios');
const FormData = require('form-data');
const write = require('./firebase');
const zip = new JSZip();

const algodClient = new algosdk.Algodv2(
  algoToken,
  algoAddress,
  algodClientPort
);

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
      console.log('goal', response, response.data)
      return response.data;
    })
    .catch(function (error) {
      //handle error here
      console.log('error', error)
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
      console.log(
        "Transaction " +
        txId +
        " confirmed in round " +
        pendingInfo["confirmed-round"]
      );
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


  const resultFile = await pinFileToIPFS(pinataApiKey, pinataApiSecret, nftFile, pinataMetadata, pinataOptions)

  let metadata = config.arc3MetadataJSON;

  let integrity = convertIpfsCidV0ToByte32(resultFile.IpfsHash)
  metadata.properties = [...asset.attributes]
  metadata.name = asset.name;
  metadata.description = asset.description;
  metadata.image = `ipfs://${resultFile.IpfsHash}`;
  metadata.image_integrity = `${integrity.base64}`;;
  metadata.image_mimetype = `${fileCat}/${fileExt}`;

  console.log(metadata)

  const resultMeta = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: asset.name } });
  let jsonIntegrity = convertIpfsCidV0ToByte32(resultMeta.IpfsHash)
  return {
    name: asset.name,
    url: `ipfs://${resultMeta.IpfsHash}`,
    metadata: jsonIntegrity.buffer,
    integrity: jsonIntegrity.base64,
  }

};

const AlgoSingleMint = async (algoMintProps) => {
  const {file, metadata, account, connector, dispatch, setFeedback, setClipboard} = algoMintProps;
  console.log(connector.chainId !== 4160)
  if (connector.isWalletConnect && connector.chainId === 4160) {
    dispatch(setFeedback('uploading to ipfs'))
    // feedback: uploading to ipfs
    const asset = await connectAndMint(file, metadata, file.name)
    const txn = await createAsset(asset, account);
    console.log('transacton', txn);
    // feedback: asset uploaded, minting in progress
    dispatch(setFeedback('asset uploaded, minting in progress'))
    let assetID = await signTx(connector, [txn]);
    await write.writeNft(account, assetID);
    // feedback: asset minted
    dispatch(setFeedback('asset minted'))
    return `https://testnet.algoexplorer.io/asset/${assetID}`;
  } else {
    return { 'message': "connect to alogrand network on your wallet or select a different network" }
  }


}

const connectAndMint = async (sampleFile, metadata, imgName) => {
  return pinata.testAuthentication().then((res) => {
    return uploadToIpfs(sampleFile, imgName, metadata)

  }).catch((err) => {
    console.log(err);
    alert('We encountered issues uploading your file. Pease check your network and try again')
  });
}


async function createAsset(asset, account) {
  const params = await algodClient.getTransactionParams().do();

  const defaultFrozen = false;
  const unitName = 'nft';
  const assetName = `${asset.name}@arc3`;
  const url = asset.url;

  const managerAddr = process.env.REACT_APP_GENA_MANAGER_ADDRESS;
  const reserveAddr = undefined;
  const freezeAddr = undefined;
  const clawbackAddr = undefined;
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
  console.log('s there?')
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
    console.log(connector, request)
    result = await connector.send(request);
    console.log('result', result)
  } catch (error) {
    console.log('four');
    alert(error)
    throw error;
  }



  const decodedResult = result.map(element => {
    return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
  });
  console.log(decodedResult)
  let tx = await algodClient.sendRawTransaction(decodedResult).do();
  console.log('transaction', tx);
  // const decoded = algosdk.decodeSignedTransaction(decodedResult);
  // console.log('decoded', decoded);
  // const fromdc = decoded.txn.from
  // console.log('fromdc', fromdc);
  // console.log('address', algosdk.encodeAddress(fromdc.publicKey))
  const confirmedTxn = await waitForConfirmation(tx.txId);

  console.log('confam', tx.txId)


  const ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
  assetID = ptx["asset-index"];
  console.log('asset id', Buffer.from(decodedResult[0]).toString('hex'));



  // console.log('Account: ',account,' Has created ASA with ID: ', assetID);


  return assetID;
}


async function createNFT(props) {
  const { zip: fileData, dispatch, setFeedback, setLoader } = props;
  let assets = [];
  const data = await zip.loadAsync(fileData)
  const files = data.files['metadata.json']
  const metadataString = await files.async('string')
  const metadata = JSON.parse(metadataString)
  dispatch(setFeedback('uploading your assets, please do not refresh your page.'))
  for (let i = 0; i < metadata.length; i++) {
    // feedback: minting i of metadata.length
    dispatch(setLoader(`uploading ${i+1} of ${metadata.length}`))
    let imgName = `${metadata[i].name}.png`
    console.log(imgName, '-------')
    let imgFile = data.files[imgName]
    console.log(imgFile, data.files)
    const uint8array = await imgFile.async("uint8array");
    const blob = new File([uint8array], imgName, { type: "image/png" });
    const asset = await connectAndMint(blob, metadata[i], imgName)
    assets.push(asset);
  }
  dispatch(setLoader(''))
  dispatch(setFeedback('uploaded successfully'))
  return assets;
};


async function mintToAlgo(algoProps) {
  const {window, ipfsJsonData, account, connector, mintFileName, dispatch, setFeedback, setLoader} = algoProps;
  if (connector.isWalletConnect && connector.chainId === 4160) {
    let collection_id = [];
    let txns = [];
    dispatch(setFeedback('preparing your assets for minting'))
    for (let i = 0; i < ipfsJsonData.length; i++) {
      dispatch(setLoader(`minting ${i+1} of ${ipfsJsonData.length}`))
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
    await write.writeUserData(account, collectionUrl, mintFileName, collection_id)
    dispatch(setLoader(''))
    dispatch(setFeedback('you have successfully minted your NFTs'));
    return `https://testnet.algoexplorer.io/tx/group/${groupId}`
  } else {
    dispatch(setFeedback('please connect to algorand network on your wallet or select a different network'));
  }
}
// console.log(algodClient.getAssetByID(57861336).do().then(data => {console.log(data)}))

async function getAlgoData(id) {
  let data = await algodClient.getAssetByID(id).do()
  return data
}

export {
  getAlgoData,
  createNFT,
  mintToAlgo,
  AlgoSingleMint,
  connectAndMint,
  pinata,
  write
}

