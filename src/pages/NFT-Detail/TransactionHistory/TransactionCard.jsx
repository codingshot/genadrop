/* eslint-disable no-lonely-if */
import React, { useContext, useState } from "react";
import { GenContext } from "../../../gen-state/gen.context";
import { chainIdToParams } from "../../../utils/chainConnect";
import supportedChains from "../../../utils/supportedChains";
import { breakAddress, getFormatedTxDate } from "../NFTDetail-script";
import classes from "./TransactionCard.module.css";

const TransactionCard = ({ txn, nftDetails, setState }) => {
  if (!txn) return null;
  const [click, setClick] = useState(true);
  const { mainnet } = useContext(GenContext);
  const algoexplorer = mainnet ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/";

  const handleExplorer = (id, type) => {
    if (!id) return;
    if (supportedChains[nftDetails.chain]?.chain === "Algorand") {
      window.open(`${algoexplorer}${type}/${id}`);
    } else {
      if (supportedChains[nftDetails?.chain]?.chain === "Near") {
        window.open(`${chainIdToParams[nftDetails.chain]?.blockExplorerUrls}${id}`);
      } else {
        window.open(`${chainIdToParams[nftDetails.chain]?.blockExplorerUrls}${type}/${id}`);
      }
    }
  };

  const handleClose = () => {
    if (click) {
      setState({ transaction: null });
    }
  };

  return (
    <div onClick={handleClose} className={`${classes.container} ${txn && classes.active}`}>
      <div onMouseEnter={() => setClick(false)} onMouseLeave={() => setClick(true)} className={classes.wrapper}>
        <div className={classes.type}>{txn.type}</div>
        <div className={classes.title}>Transaction Detail Preview</div>
        <div className={classes.details}>
          <div className={classes.list}>
            <div className={classes.key}>Transaction ID</div>

            <div onClick={() => handleExplorer(txn.txId, "tx")} className={`${classes.value} ${classes.link}`}>
              {txn.txId ? breakAddress(txn.txId) : "--"}
            </div>
          </div>
          <div className={classes.list}>
            <div className={classes.key}>Date</div>
            <div className={classes.value}>{getFormatedTxDate(txn.txDate)}</div>
          </div>
          <div className={classes.list}>
            <div className={classes.key}>From</div>
            <div onClick={() => handleExplorer(txn.seller, "address")} className={`${classes.value} ${classes.link}`}>
              {txn.seller ? breakAddress(txn.seller) : "--"}
            </div>
          </div>
          <div className={classes.list}>
            <div className={classes.key}>To</div>
            <div onClick={() => handleExplorer(txn.buyer, "address")} className={`${classes.value} ${classes.link}`}>
              {txn.buyer ? breakAddress(txn.buyer) : "--"}
            </div>
          </div>
          <div className={`${classes.list} ${classes.amount}`}>
            <div className={classes.key}>Amount ID</div>
            <div className={classes.value}>
              <div>{Number(txn.price).toFixed(2)}</div>
              <img src={supportedChains[nftDetails.chain]?.icon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
