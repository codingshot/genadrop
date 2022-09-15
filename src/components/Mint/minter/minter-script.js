import {
  mintSingleToAlgo,
  mintSingleToPoly,
  mintToAlgo,
  mintToCelo,
  mintToPoly,
  mintToAurora,
  mintSingleToCelo,
  mintSingleToAurora,
  mintSingleToNear,
} from "../../../utils/arc_ipfs";

export const handleMint = async (args) => {
  const { account, chain, dispatch, setNotification, setLoader } = args;
  if (!account) {
    return dispatch(
      setNotification({
        message: "connect your wallet and try again.",
        type: "warning",
      })
    );
  }
  let url = null;
  try {
    if (chain.toLowerCase() === "algorand") {
      url = await mintToAlgo({ ...args });
    } else if (chain.toLowerCase() === "celo") {
      url = await mintToCelo({ ...args });
    } else if (chain.toLowerCase() === "polygon") {
      url = await mintToPoly({ ...args });
    } else if (chain.toLowerCase() === "aurora") {
      url = await mintToAurora({ ...args });
    } else {
      dispatch(
        setNotification({
          message: "select a chain and try again.",
          type: "warning",
        })
      );
    }
    dispatch(setLoader(""));
    return url;
  } catch (error) {
    console.error("error: ==========>", error);
    dispatch(setLoader(""));
    return {
      message: "Minting failed. This might be due to poor or no internet connection",
    };
  }
};

export const handleSingleMint = async (args) => {
  const { account, chain, dispatch, setNotification, setLoader, setClipboard } = args;
  if (!account) {
    return dispatch(
      setNotification({
        message: "connect your wallet and try again.",
        type: "warning",
      })
    );
  }
  let url = null;
  try {
    if (chain.toLowerCase() === "algorand") {
      url = await mintSingleToAlgo({ ...args });
    } else if (chain.toLowerCase() === "celo") {
      url = await mintSingleToCelo({ ...args });
    } else if (chain.toLowerCase() === "polygon") {
      url = await mintSingleToPoly({ ...args });
    } else if (chain.toLowerCase() === "aurora") {
      url = await mintSingleToAurora({ ...args });
    } else if (chain.toLowerCase() === "near") {
      url = await mintSingleToNear({ ...args });
    } else {
      dispatch(
        setNotification({
          message: "select a chain and try again.",
          type: "warning",
        })
      );
    }
    dispatch(setLoader(""));
    return url;
  } catch (error) {
    console.error("error: ==========>", error);
    dispatch(setLoader(""));
    return {
      message: "Minting failed. This might be due to poor or no internet connection",
    };
  }
};
