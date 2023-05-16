/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import { breakAddress, getFormatedTxDate } from "../NFTDetail-script";
import classes from "./TransactionHistory.module.css";
import { ReactComponent as TxIcon } from "../../../assets/icon-tx.svg";
import { ReactComponent as MintIcon } from "../../../assets/icon-mint.svg";
import { ReactComponent as SalesIcon } from "../../../assets/icon-sales.svg";
import { ReactComponent as TransferIcon, ReactComponent as ListIcon } from "../../../assets/icon-transfer.svg";
import { ReactComponent as TransactionIcon } from "../../../assets/icon-transaction.svg";
import { ReactComponent as SearchIcon } from "../../../assets/icon-search.svg";

import TransactionCard from "./TransactionCard";

const txIcons = {
  Minting: <MintIcon />,
  Transfers: <TransferIcon />,
  Sale: <SalesIcon />,
  Listing: <ListIcon />,
};

const TransactionHistory = ({ transactionHistory, nftDetails }) => {
  const [state, setState] = useState({
    activeType: "All",
    filterdHistory: [],
    transactionTypes: ["All"],
    transaction: null,
    searchValue: "",
  });

  const { activeType, filterdHistory, transactionTypes, transaction, searchValue } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleActiveType = (activeType) => {
    handleSetState({ activeType });
  };

  const handleShowTxn = (transaction) => {
    handleSetState({ transaction });
  };

  // const handleSearchChange = (e) => {
  //   handleSetState({ searchValue: e.target.value });
  // };

  const handleSearch = (e) => {
    handleSetState({ searchValue: e.target.value });
    if (!e.target.value) return handleSetState({ filterdHistory: transactionHistory });

    const result = filterdHistory.filter(
      (history) =>
        history?.txId.includes(e.target.value) ||
        history.buyer?.includes(e.target.value) ||
        history.seller?.includes(e.target.value) ||
        getFormatedTxDate(history.txDate).includes(e.target.value)
    );

    handleSetState({ filterdHistory: result });
  };

  useEffect(() => {
    if (activeType === "All") {
      handleSetState({ filterdHistory: transactionHistory });
    } else {
      const result = transactionHistory.filter((history) => history.type === activeType);
      handleSetState({ filterdHistory: result });
    }
    handleSetState({ searchValue: "" });
  }, [activeType]);

  useEffect(() => {
    if (!transactionHistory) return;
    const tTypes = transactionHistory.map((txn) => txn.type);
    handleSetState({ transactionTypes: ["All", ...new Set(tTypes)], filterdHistory: transactionHistory });
  }, [transactionHistory]);

  return (
    <div className={classes.container}>
      <TransactionCard txn={transaction} nftDetails={nftDetails} setState={handleSetState} />
      <div className={classes.heading}>
        <TransactionIcon />
        <div>Transaction History</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.tabs}>
          {transactionTypes.map((tab, idx) => (
            <div
              key={idx}
              onClick={() => handleActiveType(tab)}
              className={`${classes.tab} ${activeType === tab && classes.active}`}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className={classes.search}>
          <SearchIcon />
          <input type="text" onChange={handleSearch} value={searchValue} placeholder="Search by Address/TxID" />
          {/* <div className={classes.searchBtn}>Go</div> */}
        </div>
        <div className={classes.listContainer}>
          {filterdHistory &&
            filterdHistory.map((txn, idx) => (
              <div key={idx} onClick={() => handleShowTxn(txn)} className={classes.list}>
                <div className={classes.tag}>
                  {txIcons[txn.type]}
                  <div>{txn.type}</div>
                </div>
                <div className={classes.item}>
                  <div>From</div>
                  <div className={classes.accent}>{txn.seller ? breakAddress(txn.seller) : "--"}</div>
                  <div>To</div>
                  <div className={classes.accent}>{txn.buyer ? breakAddress(txn.buyer) : "--"}</div>
                  <div className={classes.date}>{getFormatedTxDate(txn.txDate)}</div>
                  <div className={classes.txIconContainer}>
                    <TxIcon />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
