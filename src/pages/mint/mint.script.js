import { ethers } from "ethers";
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
  const {window, assets, name, setCeloAccount, celoAccount} = celoProps;

  if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeContract(name, setCeloAccount);
      let collection_id = {};
      let uris = assets.map((asset) => asset.url);
      let ids = assets.map((asset) => {
          let uintArray = asset.metadata.toLocaleString();
          return parseInt(uintArray.slice(0,7).replace(/,/g, ''));
      })
      let amounts = new Array(ids.length).fill(1);
      let tx;
      try {
          tx = await contract.mintBatch(celoAccount, ids, amounts, uris, '0x');
          console.log(tx)
      } catch (error) {
          console.log(error);
          return;
      }
      for (let nfts = 0; nfts < ids.length; nfts++) {
          collection_id[ids[nfts]] = assets[nfts]['url']
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
