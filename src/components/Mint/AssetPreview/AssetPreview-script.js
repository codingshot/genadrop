import {
  mintSingleToAlgo,
  mintSingleToPoly,
  mintToAlgo,
  mintToCelo,
  mintToPoly,
  mintToNear,
  mintSingleToCelo,
  mintSingleToNear,
} from "../../../utils/arc_ipfs";

export const handleMint = async (args) => {
  const { account, chain, dispatch, setNotification, setLoader, setClipboard } = args;
  if (!account) {
    return dispatch(setNotification("connect your wallet and try again."));
  }
  let url = null;
  try {
    if (chain.toLowerCase() === "algorand") {
      url = await mintToAlgo({ ...args });
    } else if (chain.toLowerCase() === "celo") {
      url = await mintToCelo({ ...args });
    } else if (chain.toLowerCase() === "polygon") {
      url = await mintToPoly({ ...args });
    } else if (chain.toLowerCase() === "near") {
      url = await mintToNear({ ...args });
    } else {
      dispatch(setNotification("please, select a chain."));
    }

    if (typeof url === "object") {
      dispatch(setNotification(url.message));
    } else {
      dispatch(setClipboard(url));
    }
    dispatch(setLoader(""));
  } catch (error) {
    console.error(error);
    dispatch(setLoader(""));
    dispatch(setNotification("ensure that your wallet is connected and try again."));
  }
};

export const handleSingleMint = async (args) => {
  const { account, chain, dispatch, setNotification, setLoader, setClipboard } = args;
  if (!account) {
    return dispatch(setNotification("connect your wallet and try again."));
  }
  let url = null;
  try {
    if (chain.toLowerCase() === "algorand") {
      url = await mintSingleToAlgo({ ...args });
    } else if (chain.toLowerCase() === "celo") {
      url = await mintSingleToCelo({ ...args });
    } else if (chain.toLowerCase() === "polygon") {
      url = await mintSingleToPoly({ ...args });
    } else if (chain.toLowerCase() === "near") {
      url = await mintSingleToNear({ ...args });
    } else {
      dispatch(setNotification("please, select a chain."));
    }

    if (typeof url === "object") {
      dispatch(setNotification(url.message));
    } else {
      dispatch(setNotification("asset minted successfully"));
      dispatch(setClipboard(url));
    }
    dispatch(setLoader(""));
  } catch (error) {
    console.error(error);
    dispatch(setLoader(""));
    dispatch(setNotification("ensure that your wallet is connected and try again."));
  }
};
