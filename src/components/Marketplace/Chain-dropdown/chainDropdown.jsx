import React, { useEffect, useState } from "react";
import classes from "./chainDropdown.module.css";
import polygonIcon from "../../../assets/icon-polygon.svg";
import algoIcon from "../../../assets/icon-algo.svg";
import nearIcon from "../../../assets/icon-near.svg";
import celoIcon from "../../../assets/icon-celo.svg";
import dropdownIcon from "../../../assets/icon-dropdown.svg";

const chainIcon = {
  Polygon: polygonIcon,
  Algorand: algoIcon,
  Near: nearIcon,
  Celo: celoIcon,
};

const ChainDropdown = ({ onChainFilter }) => {
  const [state, setState] = useState({
    toggleChainFilter: false,
    chain: "Algorand",
  });

  const { toggleChainFilter, chain } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  useEffect(() => {
    onChainFilter(chain);
  }, [chain]);

  return (
    <div className={classes.chainDropdown}>
      <div
        onClick={() =>
          handleSetState({ toggleChainFilter: !toggleChainFilter })
        }
        className={classes.selectedChain}
      >
        <div>
          <img src={chainIcon[chain]} alt="" />
          <span>{chain}</span>
        </div>
        <img
          src={dropdownIcon}
          alt=""
          className={`${classes.dropdownIcon} ${
            toggleChainFilter && classes.active
          }`}
        />
      </div>
      <div
        className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}
      >
        <div
          onClick={() =>
            handleSetState({ chain: "Algorand", toggleChainFilter: false })
          }
        >
          <img src={chainIcon.Algorand} alt="" />
          <span>Algorand</span>
        </div>
        <div
          onClick={() =>
            handleSetState({ chain: "Polygon", toggleChainFilter: false })
          }
        >
          <img src={chainIcon.Polygon} alt="" />
          <span>Polygon</span>
        </div>
        <div
          onClick={() =>
            handleSetState({ chain: "Near", toggleChainFilter: false })
          }
        >
          <img src={chainIcon.Near} alt="" />
          <span>Near</span>
        </div>
        <div
          onClick={() =>
            handleSetState({ chain: "Celo", toggleChainFilter: false })
          }
        >
          <img src={chainIcon.Celo} alt="" />
          <span>Celo</span>
        </div>
      </div>
    </div>
  );
};

export default ChainDropdown;
