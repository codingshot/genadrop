import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./chainDropdown.module.css";
import polygonIcon from "../../../assets/icon-polygon.svg";
import algoIcon from "../../../assets/icon-algo.svg";
import auroraIcon from "../../../assets/icon-aurora.svg";
import celoIcon from "../../../assets/icon-celo.svg";
import { ReactComponent as DropdownIcon } from "../../../assets/icon-caret-down.svg";
import { ReactComponent as AllChainsIcon } from "../../../assets/all-chains.svg";
import supportedChains from "../../../utils/supportedChains";
import { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";

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
  const { mainnet } = useContext(GenContext);
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

  const chainHandler = (name) => {
    onChainFilter(name);
    handleSetState({ chain: name, toggleChainFilter: false });
  };
  return (
    <div className={classes.chainDropdown}>
      <div onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter })} className={classes.selectedChain}>
        <div>
          {chainIcon[chain.toLowerCase()] ? (
            <img className={classes.chainImg} src={chainIcon[chain.toLowerCase()]} alt={chain} />
          ) : (
            <AllChainsIcon className={classes.chainImg} alt={chain} />
          )}
          <span className={classes.chainName}>{chain}</span>
        </div>
        <DropdownIcon
          alt="dropdown-indicator"
          className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`}
        />
      </div>
      <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
        {[
          <div onClick={() => chainHandler("All Chains")} className={classes.chain}>
            <AllChainsIcon alt="All Chains" /> <span>All Chains</span>
          </div>,
          ...Object.values(supportedChains)
            .filter((chainE) => mainnet === chainE.isMainnet)
            .map((chainE) => (
              <div
                key={chainE.id}
                onClick={() => {
                  !chainE.comingSoon ? chainHandler(chainE.chain) : {};
                }}
                className={`${classes.chain} ${chainE.comingSoon && classes.inActive}`}
              >
                {chainE.icon ? <img src={chainE.icon} alt={chainE.chain} /> : <p />} <span>{chainE.chain}</span>
              </div>
            )),
        ]}
      </div>
    </div>
  );
};

export default ChainDropdown;
