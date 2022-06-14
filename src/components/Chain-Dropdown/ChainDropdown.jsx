import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./ChainDropdown.module.css";
import polygonIcon from "../../assets/icon-polygon.svg";
import algoIcon from "../../assets/icon-algo.svg";
import auroraIcon from "../../assets/icon-aurora.svg";
import celoIcon from "../../assets/icon-celo.svg";
import dropdownIcon from "../../assets/icon-dropdown.svg";

const chainIcon = {
  polygon: polygonIcon,
  algorand: algoIcon,
  aurora: auroraIcon,
  celo: celoIcon,
};

const ChainDropdown = ({ onChainFilter }) => {
  const [state, setState] = useState({
    toggleChainFilter: false,
    chain: "All Chains",
  });
  const location = useLocation();

  const { toggleChainFilter, chain } = state;

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
      id: 0,
      name: "All Chains",
    },
    {
      id: 2,
      name: "Algorand",
      img: algoIcon,
    },
    {
      id: 3,
      name: "Polygon",
      img: polygonIcon,
    },
    {
      id: 4,
      name: "Aurora",
      img: auroraIcon,
    },
    {
      id: 5,
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
          {chainIcon[chain.toLowerCase()] && (
            <img className={classes.chainImg} src={chainIcon[chain.toLowerCase()]} alt={chain} />
          )}
          <span>{chain}</span>
        </div>
        <img
          src={dropdownIcon}
          alt="dropdown-indicator"
          className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`}
        />
      </div>
      <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
        {chains.map((chainE) => (
          <div key={chainE.id} onClick={() => chainHandler(chainE.name)}>
            {chainE.img ? <img src={chainE.img} alt={chainE.name} /> : <p />} <span>{chainE.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChainDropdown;
