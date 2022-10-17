import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import classes from "./chainDropdown.module.css";
import polygonIcon from "../../../assets/icon-polygon.svg";
import algoIcon from "../../../assets/icon-algo.svg";
import auroraIcon from "../../../assets/icon-aurora.svg";
import celoIcon from "../../../assets/icon-celo.svg";
import nearIcon from "../../../assets/icon-near.svg";
import avalancheIcon from "../../../assets/icon-avalanche.svg";
import { ReactComponent as DropdownIcon } from "../../../assets/icon-chevron-down.svg";
import allChainsIcon from "../../../assets/all-chains.svg";
import supportedChains from "../../../utils/supportedChains";
import { GenContext } from "../../../gen-state/gen.context";

const chainIcon = {
  polygon: polygonIcon,
  algorand: algoIcon,
  aurora: auroraIcon,
  near: nearIcon,
  celo: celoIcon,
  avalanche: avalancheIcon,
};

const ChainDropdown = ({ onChainFilter, data }) => {
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

  useEffect(() => {
    if (data) {
      onChainFilter(chain);
    }
  }, [data]);

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
            <img className={classes.chainImg} src={allChainsIcon} alt={chain} />
          )}
          <span className={classes.chainName}>{chain}</span>
        </div>
        <DropdownIcon className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`} />
      </div>
      <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
        {[
          <div key={0} onClick={() => chainHandler("All Chains")} className={classes.chain}>
            <img src={allChainsIcon} alt="All Chains" /> <span>All Chains</span>
          </div>,
          ...Object.values(supportedChains)
            .filter((_chain) => mainnet === _chain.isMainnet)
            .map((_chain, idx) => (
              <div
                key={idx + 1}
                onClick={() => {
                  !_chain.comingSoon ? chainHandler(_chain.chain) : {};
                }}
                className={`${classes.chain} ${_chain.comingSoon && classes.inActive}`}
              >
                {_chain.icon ? <img src={_chain.icon} alt={_chain.chain} /> : <p />} <span>{_chain.chain}</span>
              </div>
            )),
        ]}
      </div>
    </div>
  );
};

export default ChainDropdown;
