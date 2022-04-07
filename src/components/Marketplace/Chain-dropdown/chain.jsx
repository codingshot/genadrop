import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./chainDropdown.module.css";
import polygonIcon from "../../../assets/icon-polygon.svg";
import algoIcon from "../../../assets/icon-algo.svg";
import nearIcon from "../../../assets/icon-near.svg";
import celoIcon from "../../../assets/icon-celo.svg";
import dropdownIcon from "../../../assets/icon-dropdown.svg";

const chainIcon = {
  polygon: polygonIcon,
  algorand: algoIcon,
  near: nearIcon,
  celo: celoIcon,
};

const ChainDropdown = ({ onChainFilter }) => {
  const [state, setState] = useState({
    toggleChainFilter: false,
    chain: "all",
  });

  const { toggleChainFilter, chain } = state;

  const location = useLocation();

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("chain");
    if (name) {
      handleSetState({ chain: name });
    }
  }, []);

  const chains = [
    {
      id: 1,
      name: "Algorand",
      img: algoIcon,
    },
    {
      id: 2,
      name: "Polygon",
      img: polygonIcon,
    },
    {
      id: 3,
      name: "Near",
      img: nearIcon,
    },
    {
      id: 4,
      name: "Celo",
      img: celoIcon,
    },
  ];
  const chainHandler = (name) => {
    onChainFilter(name);
    handleSetState({ chain: name, toggleChainFilter: false });
  };
  return (
    <div className={classes.chainDropdown}>
      <div onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter })} className={classes.selectedChain}>
        <div>
          {chainIcon[chain.toLowerCase()] && <img src={chainIcon[chain.toLowerCase()]} alt={chain.toLowerCase()} />}
          <span>{chain === "all" ? "All Blockchains" : chain}</span>
        </div>
        <img
          src={dropdownIcon}
          alt="dropdown-indicator"
          className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`}
        />
      </div>
      <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
        <div onClick={() => chainHandler("all")}>
          <span>All Blockchains</span>
        </div>
        {chains.map((chainE) => (
          <div id={chainE.id} onClick={() => chainHandler(chainE.name)}>
            <img src={chainE.img} alt={chainE.name} />
            <span>{chainE.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChainDropdown;
