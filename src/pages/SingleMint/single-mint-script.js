import { ethers } from "ethers";
import { AlgoSingleMint, connectAndMint} from '../../components/utils/arc_ipfs';
const minter = require('../../components/utils/arc_ipfs')


let mintSingle = [
  "function createToken(string memory tokenURI) public {}"
];


// export async function mintToCelo(celoProps) {
//   const { window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount } = celoProps;

//   if (typeof window.ethereum !== 'undefined') {
//     const contract = await initializeContract(process.env.REACT_APP_CELO_MINTER_ADDRESS, mintFileName, setCeloAccount, celoAccount);
//     let collection_id = {};
//     let uris = ipfsJsonData.map((asset) => asset.url);
//     let ids = ipfsJsonData.map((asset) => {
//       let uintArray = asset.metadata.data.toLocaleString();
//       return parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
//     })

//     let amounts = new Array(ids.length).fill(1);
//     let tx;
//     try {
//       tx = await contract.mintBatch(celoAccount, ids, amounts, uris, '0x');
//     } catch (error) {
//       console.log(error);
//       return;
//     }
//     for (let nfts = 0; nfts < ids.length; nfts++) {
//       collection_id[ids[nfts]] = ipfsJsonData[nfts]['url']
//     }
//     const collectionHash = await minter.pinata.pinJSONToIPFS(collection_id, { pinataMetadata: { name: `collection${ids[0]}` } })
//     let collectionUrl = `ipfs://${collectionHash.IpfsHash}`;
//     console.log(`collection${ids[0]}`)
//     await minter.write.writeUserData(`collection${ids[0]}`, collectionUrl)
//     // alert(`https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`)
//     return `https://alfajores-blockscout.celo-testnet.org/tx/${tx.hash}`
//   } else {
//     alert('download metamask');
//   }
// }

// export async function mintToPoly(polyProps) {
//   console.log("..mintiti")
//   const { window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount } = polyProps;
  
//   if (typeof window.ethereum !== 'undefined') {
//     console.log('defined....')
//     const contract = await initializeContract(process.env.REACT_APP_POLY_MINTER_ADDRESS, mintFileName, setCeloAccount, celoAccount);
//     console.log('inited..')
//     let uris = ipfsJsonData.map((asset) => asset.url);
//     // generate random ids for the nft
//     let ids = ipfsJsonData.map((asset) => {
//       let uintArray = asset.metadata.data.toLocaleString();
//       let id = parseInt(uintArray.slice(0, 7).replace(/,/g, ''));
//       return id
//     })

//     let amounts = new Array(ids.length).fill(1);
//     let tx;
//     try {
//       tx = await contract.mintBatch(celoAccount, ids, amounts, uris, '0x');
//     } catch (error) {
//       console.log('opolo', error);
//       return;
//     }
//     return `https://mumbai.polygonscan.com/tx/${tx.hash}`
//   } else {
//     alert('download metamask');
//   }
// }

export async function mintSingleToPoly(imageFile, metadata, account, connector) {
  console.log("..mintiti")
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return {'message': "not yet implemented"}
    } else {
      return {'message': "please connect to polygon network on your wallet"}
    }
  } else {
    const signer = await connector.getSigner();
    // FEEDBACK: uploading asset to ipfs
    const asset =  await connectAndMint(imageFile, metadata, imageFile.name)
    const contract = await new ethers.Contract(process.env.REACT_APP_GENA_SINGLE_ADDRESS, mintSingle, signer)
    let txn;
    try {
      // minting asset, please confirm transaction
      txn = await contract.createToken(asset.url);
      console.log('ttttorium', txn)
    } catch (error) {
      console.log(error)
      return;
    }
    
    // console.log('transacton', txn);
    // let assetID = await signTx(connector, [txn]);
    // await write.writeNft(account, assetID);
    return `https://mumbai.polygonscan.com/tx/${txn.hash}`;
  }
    
  }

export const handleCopy = props => {
  const { navigator, clipboard } = props;
  clipboard.select();
  clipboard.setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(clipboard.value);
}

export const handleMint = async props => {
  const { handleSetState, file, title, description, account, connector, selectChain, priceValue, selectValue, attributes } = props;
  console.log(props);
  
  const result = /^[0-9]\d*(\.\d+)?$/.test(priceValue);
  if (!result) return alert('please add a value price')

  let url = null;
  let metadata = {name:title, description:description, attributes}
  console.log('opium', attributes)
  try {
    if (selectValue.toLowerCase() === 'algo') {
      url = await AlgoSingleMint( file, metadata, account, connector, priceValue);
    } else if (selectValue.toLowerCase() === 'celo') {
      url = {'message': "not yet implemented"} // await mintToCelo({ window,  title, description, celoAccount, setCeloAccount })
    } else if (selectValue.toLowerCase() === 'polygon') {
      url = await mintSingleToPoly(file, metadata, account, connector)
    }
    if (typeof url === "object") {
      alert(`${url.message}`)
      return;
    }
    handleSetState({ showCopy: true })
    handleSetState({ mintUrl: url })
  } catch (error) {
    console.log(error)
    alert('Please connect your account and try again!'.toUpperCase())
  }
}

export const handleMintFileChange = props => {
  const { event, handleSetState } = props;
  if (!event?.target?.files[0]) return;
  let content = event.target.files[0];
  let fileReader = new FileReader();
  fileReader.onload = function (evt) {
    handleSetState({ ipfsJsonData: JSON.parse(evt.target.result) })
  };
  fileReader.readAsText(content);
  handleSetState({ mintFileName: content.name })
}