import React from "react";
import Graph from "../../../components/Nft-details/graph/graph";
import classes from "./PriceHistory.module.css";
import { ReactComponent as HistoryIcon } from "../../../assets/icon-history.svg";

const PriceHistory = ({ transactionHistory }) => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <HistoryIcon />
        <div>Price History</div>
      </div>
      <div className={classes.history}>{transactionHistory && <Graph details={transactionHistory} />}</div>
    </div>
  );
};

export default PriceHistory;
