import algoIcon from "../assets/icon-algo.svg";
import auroraIcon from "../assets/icon-aurora.svg";
import celoIcon from "../assets/icon-celo.svg";
import polygonIcon from "../assets/icon-polygon.svg";
import { addChain, switchChain } from "./chainConnect";

const supportedChains = {
  4160: {
    id: "algorand",
    label: "Algorand",
    icon: algoIcon,
    sybmol: "ALGO",
    networkId: 4160,
    add: null,
    switch: null,
  },
  1313161554: {
    id: "aurora-near",
    label: "Aurora",
    icon: auroraIcon,
    sybmol: "AURORA",
    networkId: 1313161554,
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "ethereum",
  },
  137: {
    id: "matic-network",
    label: "Polygon",
    icon: polygonIcon,
    sybmol: "MATIC",
    networkId: 137,
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "matic",
  },
  42220: {
    id: "celo",
    label: "Celo",
    icon: celoIcon,
    sybmol: "CGLD",
    networkId: 42220,
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "celo",
  },
  80001: {
    id: "matic-network",
    label: "Polygon Testnet",
    icon: polygonIcon,
    sybmol: "MATIC",
    explorer: "https://mumbai.polygonscan.com/address",
    networkId: 80001,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  44787: {
    label: "Celo Alfajores",
    icon: celoIcon,
    sybmol: "CGLD",
    networkId: 44787,
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "celo",
  },
  62320: {
    label: "Celo Baklava",
    icon: celoIcon,
    sybmol: "CGLD",
    networkId: 62320,
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "celo",
  },
  1313161555: {
    id: "ethereum",
    label: "Aurora Testnet",
    icon: auroraIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    sybmol: "ETH",
    networkId: 1313161555,
    add: addChain,
    switch: switchChain,
    coinGeckoLabel: "ethereum",
  },
};

export default supportedChains;
