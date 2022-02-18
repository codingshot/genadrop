import { ethers } from "ethers";
import JSZip from 'jszip';
import { mintToAlgo } from '../../utils/arc_ipfs';
const minter = require('../../utils/arc_ipfs')

let mintCollectionAbi = [
  "function createCollection(string memory _name, string memory _symbol) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)"
];
let mintAbi = [
  "function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}"
];

async function initializeContract(contractProps) {
  const { minterAddress, mintFileName, connector, account, dispatch, setLoader} = contractProps;
  let name = mintFileName.split('-')[0]
  const signer = await connector.getSigner();
  console.log('granted..')
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  console.log('habibi', name, account, collectionContract)
  let tx = await collectionContract.createCollection(name, name.toUpperCase())
  console.log(tx.hash)
  dispatch(setLoader('minting'))
  await tx.wait();
  let getCollectionAddresses = await collectionContract.collectionsOf(account);
  console.log(getCollectionAddresses)
  let collectionAddresses = [...getCollectionAddresses];
  console.log(collectionAddresses)
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  return contract;
}

export async function mintToCelo(celoProps) {
  const { window, ipfsJsonData, account, connector, mintFileName, dispatch, setNotification, setLoader } = celoProps;
  if (typeof window.ethereum !== 'undefined') {
    dispatch(setNotification('preparing your assets for minting'));
    const contract = await initializeContract({minterAddress:process.env.REACT_APP_CELO_MINTER_ADDRESS, mintFileName, connector, account, dispatch, setLoader});
    let collection_id = {};
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
    for (let nfts = 0; nfts < ids.length; nfts++) {
      collection_id[ids[nfts]] = ipfsJsonData[nfts]['url']
    }
    const collectionHash = await minter.pinata.pinJSONToIPFS(collection_id, { pinataMetadata: { name: `collection${ids[0]}` } })
    let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
    console.log(`collection${ids[0]}`)
    await minter.write.writeUserData(`collection${ids[0]}`, collectionUrl)
    return `https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`
  } else {
    dispatch(setNotification('download metamask'));
  }
}

export async function mintToPoly(polyProps) {
  const { ipfsJsonData, account, connector, mintFileName, dispatch, setNotification, setLoader } = polyProps;
  console.log('ipfsJsonData: ', ipfsJsonData);
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { 'message': "not yet implemented" }
    } else {
      return { 'message': "please connect to polygon network on your wallet" }
    }
  } else {
    dispatch(setNotification('preparing your assets for minting'));
    const contract = await initializeContract({minterAddress: process.env.REACT_APP_POLY_MINTER_ADDRESS, mintFileName, connector, account, dispatch, setLoader});
    let uris = ipfsJsonData.map((asset) => asset.url);
    // generate random ids for the nft
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.data.toLocaleString();
      let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
      return id
    })
    let amounts = new Array(ids.length).fill(1);
    let tx;
    dispatch(setLoader('finalizing'));
    try {
      tx = await contract.mintBatch(account, ids, amounts, uris, '0x');
    } catch (error) {
      console.log('opolo', error);
      dispatch(setLoader(''))
      return;
    }
    dispatch(setLoader(''))
    dispatch(setNotification('you have successfully minted your NFTs.'))
    return `https://mumbai.polygonscan.com/tx/${tx.hash}`
  }
}

export const unzip = async zip => {
  let new_zip = new JSZip();
  const unzipped = await new_zip.loadAsync(zip)
  return unzipped
}

export const handleFileChange = async (props) => {
  const { event, handleSetState } = props;
  try {
    if (!event.target.files[0]) return;
    let content = event.target.files[0];
    handleSetState({ zip: event.target.files[0] })
    handleSetState({ loading: true })
    handleSetState({ collectionName: content.name })
    let col = [];
    let unzipped = await unzip(content);
    for (let file in unzipped.files) {
      let uint8array = unzipped.files[file]["_data"]["compressedContent"]
      let string = new TextDecoder().decode(uint8array);
      let blob = new Blob([new Uint8Array(uint8array).buffer], { type: 'image/png' });
      try {
        const meta = JSON.parse(string)
        handleSetState({ metadata: meta })
      } catch (error) {
        let imageFile = new File([blob], file, {
          type: "image/png"
        });
        col.push(imageFile)
      }
    }
    handleSetState({ collections: col })
    handleSetState({ loading: false })
  } catch (error) {
    console.log(error);
  }
}

export const handleMintFileChange = props => {
  const { event, handleSetState } = props;
  try {
    if (!event?.target?.files[0]) return;
    let content = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = function (evt) {
      handleSetState({ ipfsJsonData: JSON.parse(evt.target.result) })
    };
    fileReader.readAsText(content);
    handleSetState({ mintFileName: content.name })
  } catch (error) {
    console.log(error);
  }
}

export const handleMint = async props => {
  const { selectValue, ipfsJsonData, mintFileName, account, connector, priceValue, dispatch, setNotification, setClipboard, setLoader, window } = props;
  const result = /^[0-9]\d*(\.\d+)?$/.test(priceValue);
  if (!result) return dispatch(setNotification('please add a valid price value'));
  let url = null;
  try {
    if (selectValue.toLowerCase() === 'algo') {
      url = await mintToAlgo({ window, ipfsJsonData, account, connector, mintFileName, dispatch, setNotification, setLoader });
    } else if (selectValue.toLowerCase() === 'celo') {
      url = await mintToCelo({ window, ipfsJsonData, account, connector, mintFileName, dispatch, setNotification, setLoader })
    } else if (selectValue.toLowerCase() === 'polygon') {
      url = await mintToPoly({ window, ipfsJsonData, account, connector, mintFileName, dispatch, setNotification, setLoader })
    }
    if (typeof url === "object") {
      dispatch(setNotification(url.message))
    } else {
      dispatch(setClipboard(url))
    }
  } catch (error) {
    console.error(error)
    dispatch(setLoader(''))
    dispatch(setNotification('Please ensure that your wallet is connected and try again.'))
  }
}