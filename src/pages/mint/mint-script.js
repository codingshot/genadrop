import { ethers } from "ethers";
import JSZip from 'jszip';
import { mintToAlgo } from '../../components/utils/arc_ipfs';
const minter = require('../../components/utils/arc_ipfs')

let mintCollectionAbi = [
  "function createCollection(string memory _name, string memory _symbol) public {}",
  "function collectionsOf(address user) public view returns (address[] memory)"
];
let mintAbi = [
  "function mintBatch( address to, uint256[] memory ids, uint256[] memory amounts, string[] memory uris,bytes memory data) public {}"
];

async function initializeContract(name, setCeloAccount, celoAccount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  const signer = await provider.getSigner();
  signer.getAddress().then((data) => setCeloAccount(data))
  const collectionContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, mintCollectionAbi, signer);
  let tx = await collectionContract.createCollection(name, name)
  await tx.wait();
  let getCollectionAddresses = await collectionContract.collectionsOf(celoAccount);
  let collectionAddresses = [...getCollectionAddresses];
  const contract = new ethers.Contract(collectionAddresses.pop(), mintAbi, signer);
  return contract;
}

export async function mintToCelo(celoProps) {
  const { window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount } = celoProps;

  if (typeof window.ethereum !== 'undefined') {
    const contract = await initializeContract(mintFileName, setCeloAccount, celoAccount);
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

export const unzip = async zip => {
  let new_zip = new JSZip();
  const unzipped = await new_zip.loadAsync(zip)
  return unzipped
}

export const handleFileChange = async (props) => {
  const { event, handleSetState } = props;
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

export const handleCopy = props => {
  const { navigator, clipboard } = props;
  clipboard.select();
  clipboard.setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(clipboard.value);
}

export const handleMint = async props => {
  const { selectValue, handleSetState, window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount, account, connector, priceValue } = props;
  const result = /^[0-9]\d*(\.\d+)?$/.test(priceValue);
  if(!result) return alert('please add a value price')

  let url = null;
  try {
    if (selectValue.toLowerCase() === 'algo') {
      url = await mintToAlgo(ipfsJsonData, account, connector);
    } else if (selectValue.toLowerCase() === 'celo') {
      url = await mintToCelo({ window, ipfsJsonData, mintFileName, celoAccount, setCeloAccount })
    }
    handleSetState({ showCopy: true })
    handleSetState({ mintUrl: url })
  } catch (error) {
    alert('Please connect your account and try again!'.toUpperCase())
  }
}