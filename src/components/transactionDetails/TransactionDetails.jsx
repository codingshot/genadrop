import React, { useState, useRef, useEffect } from "react";
import classes from "./transaction.module.css";
import CopyToClipboard from "react-copy-to-clipboard";
import algoIcon from "../../assets/icon-algo.svg";

const Transaction = (data, date) => {
  function breakAddress(address = "", width = 6) {
    if (!address) return "--";
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  const [state, setState] = useState({
    explorer: "https://testnet.algoexplorer.io/tx/",
    isCopied: false,
    showDrop: false,
  });
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleSetState({ showDrop: false });
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(wrapperRef);

  const { explorer, isCopied, showDrop } = state;

  const onCopyText = () => {
    handleSetState({ isCopied: true });

    setTimeout(() => {
      handleSetState({ isCopied: false, showDrop: false });
    }, 1000);
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>{data.data.event}</div>
      <div className={classes.subTitle}>Transaction Detail Preview</div>
      <table className={classes.table}>
        <tbody>
          <tr>
            <td>Transaction ID</td>
            <td className={classes.txId} onClick={() => handleSetState({ showDrop: true })} ref={wrapperRef}>
              {" "}
              {breakAddress(data.data.txId)}
              {showDrop && data.data.txId ? (
                isCopied ? (
                  <div className={classes.copied}>Copied!</div>
                ) : (
                  <div className={classes.clickable}>
                    <CopyToClipboard text={data.data.txId}>
                      <span className={classes.copy} onClick={onCopyText}>
                        Copy
                      </span>
                    </CopyToClipboard>
                    <a href={explorer + data.data.txId} target="_blank">
                      <span className={classes.explore}>Go to Explorer</span>
                    </a>
                  </div>
                )
              ) : (
                ""
              )}
            </td>
          </tr>
          <tr>
            <td>Date</td>
            <td> {data.date}</td>
          </tr>

          <tr>
            <td>From</td>
            <td> {breakAddress(data.data.from)}</td>
          </tr>
          <tr>
            <td>To</td>
            <td> {breakAddress(data.data.to)}</td>
          </tr>
          {data.data.price ? (
            <tr>
              <td>Amount ID</td>
              <td className={classes.icon}>
                {" "}
                {data.data.price}
                <img src={algoIcon} alt="" />{" "}
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
