import React, { useState, useEffect, useContext } from "react";
import classes from "./mintDropdown.module.css";
import polygonIcon from "../../../assets/icon-polygon.svg";
import algoIcon from "../../../assets/icon-algo.svg";
import auroraIcon from "../../../assets/icon-aurora.svg";
import celoIcon from "../../../assets/icon-celo.svg";
import supportedChains from "../../../utils/supportedChains";
import { ReactComponent as DropdownIcon } from "../../../assets/down-arrow.svg";
import { GenContext } from "../../../gen-state/gen.context";

const chainIcon = {
  polygon: polygonIcon,
  algorand: algoIcon,
  aurora: auroraIcon,
  celo: celoIcon,
};

const MintDropdown = ({ onChainFilter }) => {
  const { dispatch, connector, account, chainId, mainnet } = useContext(GenContext);
  const [state, setState] = useState({
    toggleChainFilter: false,
    chain: "Select blockchain",
  });

  const { toggleChainFilter, chain } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const chainHandler = (name) => {
    onChainFilter(name);
    handleSetState({ chain: name, toggleChainFilter: false });
  };
  useEffect(() => {
    if (chainId) {
      const { label } = Object.values(supportedChains).filter((chainE) => chainE.networkId === chainId)[0];
      handleSetState({ chain: label });
    }
  }, []);
  return (
    <div className={classes.chainDropdown}>
      <div onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter })} className={classes.selectedChain}>
        <div>
          {chainIcon[chain.toLowerCase()] ? (
            <img className={classes.chainImg} src={chainIcon[chain.toLowerCase()]} alt={chain} />
          ) : (
            ""
          )}

          <span className={classes.chainName}>{chain}</span>
        </div>
        <DropdownIcon className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`} />
      </div>
      <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
        {[
          ...Object.values(supportedChains)
            .filter((chainE) => !chainE.comingSoon && (chainE.isMainnet === true || chainE.networkId === 4160))
            .map((chainE) => (
              <div
                key={chainE.id}
                onClick={() => {
                  chainHandler(chainE.label);
                }}
                className={`${classes.chain} ${chainE.comingSoon && classes.inActive}`}
              >
                {chainE.icon ? <img src={chainE.icon} alt={chainE.label} /> : <p />} <span>{chainE.label}</span>
              </div>
            )),
        ]}
      </div>
    </div>
  );
};

export default MintDropdown;
