import { async } from "regenerator-runtime";
import {
  mintSingleToAlgo,
  mintSingleToPoly,
  mintToAlgo,
  mintToCelo,
  mintToPoly,
  mintToAurora,
  mintToAvax,
  mintSingleToCelo,
  mintSingleToAurora,
  mintSingleToNear,
  mintSingleToAvax,
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
    } else if (chain.toLowerCase() === "Avalanche") {
      url = await mintToAvax({ ...args });
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
    } else if (chain.toLowerCase() === "avalanche") {
      url = await mintSingleToAvax({ ...args });
    } else {
      dispatch(
        setNotification({
          message: "select a chain and try again.",
          type: "warning",
        })
      );
    }
    dispatch(setLoader(""));
    console.log("__________________this is the final url________________", url);
    return url;
  } catch (error) {
    console.error("error: ==========>", error);
    dispatch(setLoader(""));
    return {
      message: "Minting failed. This might be due to poor or no internet connection",
    };
  }
};

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve({ name: file.name, url: fr.result });
    };
    fr.readAsDataURL(file);
  });
}

export function getFileFromBase64(string64, fileName) {
  const type = string64.split(",")[0]?.replace(";base64", "")?.replace("data:", "");
  const trimmedString = string64.split(",")[1];
  const imageContent = atob(trimmedString);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);
  for (let n = 0; n < imageContent.length; n += 1) {
    view[n] = imageContent.charCodeAt(n);
  }
  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}
