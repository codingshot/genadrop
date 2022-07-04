import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  setNotification,
  setProposedChain,
  setConnector,
  setChainId,
  setAccount,
  setMainnet,
  setClipboard,
  setToggleWalletPopup,
  setSwitchWalletNotification,
} from "../../gen-state/gen.actions";
import { chainIdToParams } from "../../utils/chainConnect";
import blankImage from "../../assets/blank.png";
import supportedChains from "../../utils/supportedChains";
import * as WS from "./wallet-script";

export const breakAddress = (address = "", width = 6) => {
  if (address) return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const getConnectedChain = (chainId) => {
  const c = supportedChains[chainId];
  if (!c) return blankImage;
  return c.icon;
};

export const getNetworkID = () => {
  return new Promise(async (resolve) => {
    const networkId = await window.ethereum.networkVersion;
    resolve(Number(networkId));
  });
};

export const initializeConnection = (walletProps) => {
  const { dispatch, handleSetState, rpc } = walletProps;
  const walletConnectProvider = new WalletConnectProvider({
    rpc,
  });

  if (window.localStorage.walletconnect) {
    let storedProvider = JSON.parse(window.localStorage.walletconnect);
    dispatch(setProposedChain(storedProvider.chainId));
    dispatch(setConnector(walletConnectProvider));
    handleSetState({ overrideWalletConnect: true });
  }

  // Subscribe to accounts change
  walletConnectProvider.on("accountsChanged", (accounts) => {
    dispatch(setAccount(accounts[0]));
    dispatch(setChainId(walletConnectProvider.chainId));
  });

  // Subscribe to chainId change
  walletConnectProvider.on("chainChanged", (chainId) => {
    dispatch(setChainId(chainId));
  });

  // Subscribe to session disconnection
  walletConnectProvider.on("disconnect", (code, reason) => {
    WS.disconnectWallet(walletProps);
  });

  if (window.ethereum !== undefined) {
    const { ethereum } = window;

    if (!window.localStorage.walletconnect) {
      WS.updateAccount(walletProps);
      const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch(setConnector(ethereumProvider));
    }

    // Subscribe to accounts change
    ethereum.on("accountsChanged", function (accounts) {
      WS.updateAccount(walletProps);
    });

    // Subscribe to chainId change
    ethereum.on("chainChanged", (chainId) => {
      const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch(setConnector(ethereumProvider));
      WS.updateAccount(walletProps);
    });
    handleSetState({ isMetamask: true });
    handleSetState({ walletConnectProvider });
  } else {
    handleSetState({ isMetamask: false });
  }
};

export const setNetworkType = ({ dispatch, handleSetState }) => {
  dispatch(setMainnet(process.env.REACT_APP_ENV_STAGING === "false"));
  handleSetState({ network: process.env.REACT_APP_ENV_STAGING === "false" ? "mainnet" : "testnet" });
};

export const connectWithQRCode = async ({ walletConnectProvider, dispatch, rpc, supportedChains }) => {
  let proposedChain = Object.keys(rpc)[0];
  try {
    await walletConnectProvider.enable();
    if (proposedChain !== String(walletConnectProvider.chainId)) {
      walletConnectProvider.disconnect();
      setTimeout(() => {
        alert(
          `Invalid connection! Please ensure that ${supportedChains[proposedChain].label} network is selected on your scanning wallet`
        );
        window.location.reload();
      }, 100);
    }
    dispatch(setConnector(walletConnectProvider));
  } catch (error) {
    console.log("error: ", error);
    dispatch(
      setNotification({
        message: "Connection failed",
        type: "error",
      })
    );
    dispatch(setProposedChain(null));
  }
};

export const connectWithMetamask = async (walletProps) => {
  const { dispatch, walletConnectProvider, supportedChains, proposedChain } = walletProps;
  let res;
  res = await supportedChains[proposedChain].switch(proposedChain);
  if (!res) {
    await WS.disconnectWalletConnectProvider(walletConnectProvider);
    const activeChain = await WS.getNetworkID();
    if (activeChain === proposedChain) {
      WS.updateAccount(walletProps);
    }
  } else if (res.message.includes("Unrecognized")) {
    res = await supportedChains[proposedChain].add(proposedChain);
    if (!res) {
      await WS.disconnectWalletConnectProvider(walletConnectProvider);
    } else {
      dispatch(
        setNotification({
          message: "Failed to add network",
          type: "error",
        })
      );
      dispatch(setProposedChain(null));
    }
  } else {
    dispatch(
      setNotification({
        message: "Connection failed",
        type: "error",
      })
    );
    dispatch(setProposedChain(null));
  }
};

export const initConnectWallet = (walletProps) => {
  const { dispatch } = walletProps;
  if (window?.ethereum !== undefined) {
    dispatch(setToggleWalletPopup(true));
  } else {
    dispatch(setToggleWalletPopup(false));
    dispatch(
      setNotification({
        message: "You need to install metamask to continue",
        type: "error",
      })
    );
    dispatch(setClipboard("https://metamask.io/"));
  }
};

export const connectWallet = async (walletProps) => {
  const { dispatch, proposedChain, connectionMethod, walletProviderRef, handleSetState, mainnet } = walletProps;
  if (connectionMethod === "metamask") {
    await WS.connectWithMetamask(walletProps);
    const ethereumProvider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(setConnector(ethereumProvider));
  } else if (connectionMethod === "walletConnect") {
    walletProviderRef.current = 2;
    if (proposedChain === 4160) {
      handleSetState({
        rpc: {
          4160: mainnet ? "https://node.algoexplorerapi.io" : "https://node.testnet.algoexplorerapi.io",
        },
      });
    } else {
      handleSetState({
        rpc: {
          [proposedChain]: chainIdToParams[proposedChain].rpcUrls[0],
        },
      });
    }
  }
};

export const disconnectWalletConnectProvider = async (walletConnectProvider) => {
  if (walletConnectProvider?.connected) {
    try {
      await walletConnectProvider.disconnect();
    } catch (error) {
      console.log("error disconneting: ", error);
    }
  }
};

export const updateAccount = async (walletProps) => {
  const { dispatch, walletConnectProvider, mainnet } = walletProps;
  const { ethereum } = window;
  const [accounts] = await ethereum.request({
    method: "eth_accounts", //eth_accounts should not allow metamask to popup on page load //eth_requestAccounts
  });
  const networkId = await ethereum.networkVersion;
  await WS.disconnectWalletConnectProvider(walletConnectProvider);
  const getEnv = mainnet === supportedChains[networkId].isMainnet;

  if (!getEnv) {
    WS.disconnectWallet(walletProps);
    dispatch(setSwitchWalletNotification(true));
    return;
  }
  dispatch(setSwitchWalletNotification(false));
  const isSupported = Object.keys(supportedChains).includes(networkId);
  if (!isSupported) {
    WS.disconnectWallet(walletProps);
    dispatch(setToggleWalletPopup(true));
  } else {
    dispatch(setToggleWalletPopup(false));
    if (!accounts) {
      WS.disconnectWallet(walletProps);
      dispatch(
        setNotification({
          message: "Please connect your site manually from your wallet extension.",
          type: "warning",
        })
      );
    } else {
      dispatch(setChainId(Number(networkId)));
      dispatch(setAccount(accounts));
      dispatch(
        setNotification({
          message: `Your site is connected to ${supportedChains[networkId].label}`,
          type: "success",
        })
      );
    }
  }
};

export const disconnectWallet = async ({ walletConnectProvider, dispatch, history, pathname, handleSetState }) => {
  await WS.disconnectWalletConnectProvider(walletConnectProvider);
  dispatch(setAccount(null));
  dispatch(setProposedChain(null));
  dispatch(setChainId(null));
  handleSetState({ toggleDropdown: false });
  if (pathname.includes("/me")) {
    history.push("/marketplace");
  }
};
