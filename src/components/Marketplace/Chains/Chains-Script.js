import algoIcon from "../../../assets/icon-algo.svg";
import auroraIcon from "../../../assets/icon-aurora.svg";
import celoIcon from "../../../assets/icon-celo.svg";
import polygonIcon from "../../../assets/icon-polygon.svg";
import nearIcon from "../../../assets/icon-near.svg";
import avalancheIcon from "../../../assets/icon-avalanche.svg";
import allChains from "../../../assets/all-chains.svg";

const chains = [
  {
    name: "All Chains",
    icon: allChains,
    color: "#009987",
    border: "#009987",
    bg: "#FFFFFF",
    isComingSoon: false,
  },
  {
    name: "Aurora",
    icon: auroraIcon,
    color: "white",
    border: "transparent",
    bg: "#6CD34B",
    isComingSoon: false,
  },
  {
    name: "Near",
    icon: nearIcon,
    color: "#000000",
    border: "transparent",
    bg: "#E1EBF5",
    isComingSoon: false,
  },
  {
    name: "Celo",
    icon: celoIcon,
    color: "#000000",
    border: "transparent",
    bg: "#FFEA94",
    isComingSoon: false,
  },
  {
    name: "Algorand",
    icon: algoIcon,
    color: "white",
    border: "transparent",
    bg: "#245EC7",
    isComingSoon: false,
  },
  {
    name: "Polygon",
    icon: polygonIcon,
    color: "black",
    border: "transparent",
    bg: "#EEE6FA",
    isComingSoon: false,
  },
  {
    name: "Avalanche",
    icon: avalancheIcon,
    color: "#ffffff",
    border: "transparent",
    bg: "#E84142",
    isComingSoon: true,
  },
];
export default chains;
