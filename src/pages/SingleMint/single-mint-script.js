import { ethers } from "ethers";
import { AlgoSingleMint, connectAndMint } from '../../utils/arc_ipfs';
const minter = require('../../utils/arc_ipfs')

let mintSingle = [
  "function createToken(string memory tokenURI) public {}"
];

export async function mintSingleToPoly(singleMintProps) {
  const { file, metadata, account, connector, dispatch, setLoader } = singleMintProps;
  
  console.log("..mintiti")
  if (connector.isWalletConnect) {
    if (connector.chainId === 137) {
      return { 'message': "not yet implemented" }
    } else {
      return { 'message': "please connect to polygon network on your wallet or select a different network" }
    }
  } else {
    const signer = await connector.getSigner();
    dispatch(setLoader('uploading 1 of 1'))
    const asset = await connectAndMint(file, metadata, file.name)
    dispatch(setLoader('minting 1 of 1'))
    const contract = new ethers.Contract(process.env.REACT_APP_GENA_SINGLE_ADDRESS, mintSingle, signer)
    let txn;
    try {
      txn = await contract.createToken(asset.url);
    } catch (error) {
      console.log(error)
      return;
    }
    dispatch(setLoader(''))
    return `https://mumbai.polygonscan.com/tx/${txn.hash}`;
  }
}

export const handleMint = async props => {
  const {
    dispatch,
    setFeedback,
    setClipboard,
    setLoader,
    file,
    title,
    description,
    account,
    connector,
    selectChain,
    priceValue,
    selectValue,
    attributes } = props;

  const result = /^[0-9]\d*(\.\d+)?$/.test(priceValue);
  if (!result) return dispatch(setFeedback('please add a valid price value'));
  let url = null;
  let metadata = { name: title, description: description, attributes }
  try {
    if (selectValue.toLowerCase() === 'algo') {
      url = await AlgoSingleMint({file, metadata, account, connector, dispatch, setFeedback, setClipboard});
    } else if (selectValue.toLowerCase() === 'celo') {
      url = { 'message': "not yet implemented" } // await mintToCelo({ window,  title, description, celoAccount, setCeloAccount })
    } else if (selectValue.toLowerCase() === 'polygon') {
      url = await mintSingleToPoly({file, metadata, account, connector, dispatch, setFeedback, setLoader})
    }
    if (typeof url === "object") {
      dispatch(setFeedback(url.message))
    } else {
      dispatch(setClipboard(url))
    }
  } catch (error) {
    console.log(error);
    dispatch(setFeedback('connect your wallet and try again'))
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