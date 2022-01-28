import { ethers } from "ethers";
import { mintToAlgo } from '../../components/utils/arc_ipfs';
const minter = require('../../components/utils/arc_ipfs')

let mintCollectionAbi = [
  "function createCollection(string memory _name, string memory _symbol) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)"
];
let mintAbi = [
  "function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}"
];

async function initializeContract(minterAddress, name, setCeloAccount, celoAccount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(celoAccount)
  name = name.split('-')[0]
  await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  const signer = await provider.getSigner();
  console.log('granted..')
  signer.getAddress().then((data) => setCeloAccount(data))
  const collectionContract = new ethers.Contract(minterAddress, mintCollectionAbi, signer);
  console.log('habibi', name, celoAccount)
  let tx = await collectionContract.createCollection(name, name.toUpperCase())
  console.log(tx.hash)
  await tx.wait();
  let getCollectionAddresses = await collectionContract.collectionsOf(celoAccount);
  console.log(getCollectionAddresses)
  let collectionAddresses = [...getCollectionAddresses];
  console.log(collectionAddresses)
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  return contract;
}

export async function mintToCelo(celoProps) {
  const { window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount } = celoProps;

  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeContract(process.env.REACT_APP_CELO_MINTER_ADDRESS, mintFileName, setCeloAccount, celoAccount);
    let collection_id = {};
    let uris = ipfsJsonData.map((asset) => asset.url);
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.data.toLocaleString();
      return parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
    })

    let amounts = new Array(ids.length).fill(1);
    let tx;
    try {
      tx = await contract.mintBatch(celoAccount, ids, amounts, uris, '0x');
    } catch (error) {
      console.log(error);
      return;
    }
    for (let nfts = 0; nfts < ids.length; nfts++) {
      collection_id[ids[nfts]] = ipfsJsonData[nfts]['url']
    }
    const collectionHash = await minter.pinata.pinJSONToIPFS(collection_id, { pinataMetadata: { name: `collection${ids[0]}` } })
    let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
    console.log(`collection${ids[0]}`)
    await minter.write.writeUserData(`collection${ids[0]}`, collectionUrl)
    // alert(`https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`)
    return `https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`
  } else {
    alert('download metamask');
  }
}

export async function mintToPoly(polyProps) {
  console.log("..mintiti")
  const { window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount } = polyProps;
  
  if (typeof window.ethereum !== 'undefined') {
    console.log('defined....')
    const contract = await initializeContract(process.env.REACT_APP_POLY_MINTER_ADDRESS, mintFileName, setCeloAccount, celoAccount);
    console.log('inited..')
    let uris = ipfsJsonData.map((asset) => asset.url);
    // generate random ids for the nft
    let ids = ipfsJsonData.map((asset) => {
      let uintArray = asset.metadata.data.toLocaleString();
      let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
      return id
    })

    let amounts = new Array(ids.length).fill(1);
    let tx;
    try {
      tx = await contract.mintBatch(celoAccount, ids, amounts, uris, '0x');
    } catch (error) {
      console.log('opolo', error);
      return;
    }
    // for (let nfts = 0; nfts < ids.length; nfts++) {
    //   collection_id[ids[nfts]] = ipfsJsonData[nfts]['url']
    // }
    // const collectionHash = await minter.pinata.pinJSONToIPFS(collection_id, { pinataMetadata: { name: `collection${ids[0]}` } })
    // let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
    // await minter.write.writeUserData(celoAccount, collectionUrl, mintFileName, collection_id)
    return `https://mumbai.polygonscan.com/tx/${tx.hash}`
  } else {
    alert('download metamask');
  }
}

export const handleCopy = props => {
  const { navigator, clipboard } = props;
  clipboard.select();
  clipboard.setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(clipboard.value);
}

export const handleMint = async props => {
  const { handleSetState, window, title, description, celoAccount, setCeloAccount, account, connector, selectChain, priceValue } = props;
  console.log(props);
  return
  const result = /^[0-9]\d*(\.\d+)?$/.test(priceValue);
  if(!result) return alert('please add a value price')

  let url = null;
  try {
    if (selectChain.toLowerCase() === 'algo') {
      url = await mintToAlgo( account, connector, title, description);
    } else if (selectChain.toLowerCase() === 'celo') {
      url = await mintToCelo({ window,  title, description, celoAccount, setCeloAccount })
    } else if (selectChain.toLowerCase() === 'polygon') {
      url = await mintToPoly({ window,  title, description, celoAccount, setCeloAccount })
    }
    handleSetState({ showCopy: true })
    handleSetState({ mintUrl: url })
  } catch (error) {
    console.log(error)
    alert('Please connect your account and try again!'.toUpperCase())
  }
}