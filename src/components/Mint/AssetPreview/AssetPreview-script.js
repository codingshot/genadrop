import { createNFT, mintSingleToAlgo, mintSingleToPoly, mintToAlgo, mintToCelo, mintToPoly } from "../../../utils/arc_ipfs";

export const handleMint = async args => {
  const { account, connector, chain, dispatch, setNotification, setLoader, setClipboard } = args;
  if (!account) return dispatch(setNotification('connect your wallet and try again.'));
  const ipfsJsonData = await createNFT({ ...args });
  let url = null;
  try {
    if (chain.toLowerCase() === 'algo') {
      url = await mintToAlgo({ ...args, ipfsJsonData });
    } else if (chain.toLowerCase() === 'celo') {
      url = await mintToCelo({ ...args, ipfsJsonData })
    } else if (chain.toLowerCase() === 'polygon') {
      url = await mintToPoly({ ...args, ipfsJsonData })
    } else {
      dispatch(setNotification('please, select a chain.'))
    }

    if (typeof url === "object") {
      dispatch(setNotification(url.message))
    } else {
      dispatch(setClipboard(url))
    }
    dispatch(setLoader(''))
  } catch (error) {
    console.error(error)
    dispatch(setLoader(''))
    dispatch(setNotification('ensure that your wallet is connected and try again.'))
  }
}

export const handleSingleMint = async args => {
  const { account, chain, dispatch, setNotification, setLoader, setClipboard } = args;
  if (!account) return dispatch(setNotification('connect your wallet and try again.'));
  let url = null;
  try {
    if (chain.toLowerCase() === 'algo') {
      url = await mintSingleToAlgo({ ...args });
    } else if (chain.toLowerCase() === 'celo') {
      // url = await mintSingleToCelo({ ...args })
      url = { 'message': "not yet implemented" }
    } else if (chain.toLowerCase() === 'polygon') {
      url = await mintSingleToPoly({ ...args })
    } else {
      dispatch(setNotification('please, select a chain.'))
    }

    if (typeof url === "object") {
      dispatch(setNotification(url.message))
    } else {
      dispatch(setNotification('asset minted successfully'))
      dispatch(setClipboard(url))
    }
    dispatch(setLoader(''))
  } catch (error) {
    console.error(error)
    dispatch(setLoader(''))
    dispatch(setNotification('ensure that your wallet is connected and try again.'))
  }
}



