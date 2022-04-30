import {
  mintSingleToAlgo,
  mintSingleToPoly,
  mintToAlgo,
  mintToCelo,
  mintToPoly,
  mintToAurora,
  mintSingleToCelo,
  mintSingleToAurora,
} from "../../../utils/arc_ipfs";

export const handleMint = async (args) => {
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

    if (typeof url === "object") {
      dispatch(
        setNotification({
          message: url.message,
          type: "error",
        })
      );
    } else {
      dispatch(setClipboard(url));
    }
    dispatch(setLoader(""));
  } catch (error) {
    console.error(error);
    dispatch(setLoader(""));
    dispatch(
      setNotification({
        message: "connect your wallet and try again.",
        type: "warning",
      })
    );
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
    } else {
      dispatch(
        setNotification({
          message: "select a chain and try again.",
          type: "warning",
        })
      );
    }

    if (typeof url === "object") {
      dispatch(setNotification(url.message));
    } else {
      dispatch(
        setNotification({
          message: "asset minted successfully",
          type: "success",
        })
      );
      dispatch(setClipboard(url));
    }
    dispatch(setLoader(""));
  } catch (error) {
    console.error(error);
    dispatch(setLoader(""));
    dispatch(
      setNotification({
        message: "connect your wallet and try again.",
        type: "warning",
      })
    );
  }
};
