import React, { useContext } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { chainIdToParams } from "../../../utils/chainConnect";
import supportedChains from "../../../utils/supportedChains";
import { breakAddress } from "../NFTDetail-script";
import { ReactComponent as LinkIcon } from "../../../assets/icon-link.svg";
import classes from "./Details.module.css";

const Details = ({ nftDetails }) => {
  const { owner, chain, isListed } = nftDetails;
  const { mainnet } = useContext(GenContext);
  const algoexplorer = mainnet ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/";

  const handleExplorer = () => {
    if (supportedChains[chain]?.chain === "Algorand") {
      window.open(`${algoexplorer}address/${owner}`);
    } else if (supportedChains[chain]?.chain === "Near") {
      window.open(`${chainIdToParams[chain]?.blockExplorerUrls}${owner}`);
    } else {
      window.open(`${chainIdToParams[chain]?.blockExplorerUrls}address/${owner}`);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Details</div>
      <div className={classes.list}>
        <div>Mint address</div>
        <div onClick={handleExplorer} className={classes.value}>
          <div>{breakAddress(owner, 4)}</div>
          <LinkIcon />
        </div>
      </div>
      {/* <div className={classes.list}>
        <div>Minted</div>
        <div>date</div>
      </div> */}
      {/* <div className={classes.list}>
        <div>Creator Royalty</div>
        <div>0%</div>
      </div> */}
      {isListed && (
        <>
          <div className={classes.list}>
            <div>Marketplace Fee</div>
            <div>10%</div>
          </div>
          <div className={`${classes.list} ${classes.total}`}>
            <div>Total</div>
            <div>10%</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
