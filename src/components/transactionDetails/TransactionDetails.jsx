import React, { useState, useRef, useEffect } from "react";
import classes from "./transaction.module.css";
import CopyToClipboard from "react-copy-to-clipboard";
import algoIcon from "../../assets/icon-algo.svg";
import supportedChains from "../../utils/supportedChains";
import { chainIdToParams } from "../../utils/chainConnect";
const Transaction = (data) => {
  function breakAddress(address = "", width = 6) {
    if (!address) return "--";
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  const [state, setState] = useState({
    explorer:
      process.env.REACT_APP_ENV_STAGING === "false" ? "https://algoexplorer.io/" : "https://testnet.algoexplorer.io/",
    isCopied: false,
    showDrop: false,
    clicked: "",
  });
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    if (chainIdToParams[data?.chain]) {
      handleSetState({ explorer: chainIdToParams[data.chain].blockExplorerUrls });
    }
  }, [data]);

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

  const { explorer, isCopied, clicked } = state;

  const onCopyText = () => {
    handleSetState({ isCopied: true });

    setTimeout(() => {
      handleSetState({ isCopied: false, showDrop: false, clicked: "" });
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
            <td
              className={classes.txId}
              onClick={() => {
                handleSetState({ clicked: "txId" });
              }}
              ref={wrapperRef}
            >
              {breakAddress(data.data.txId)}
              {data.data.txId && clicked == "txId" ? (
                isCopied ? (
                  <div className={classes.copied}>Copied!</div>
                ) : (
                  <div className={classes.clickable}>
                    <CopyToClipboard text={data.data.txId}>
                      <span className={classes.copy} onClick={onCopyText}>
                        Copy
                      </span>
                    </CopyToClipboard>
                    {supportedChains[data?.chain]?.chain === "Near" ? (
                      <a href={explorer + data.data.txId} target="_blank">
                        <span className={classes.explore}>Go to Explorer</span>
                      </a>
                    ) : (
                      <a href={explorer + "tx/" + data.data.txId} target="_blank">
                        <span className={classes.explore}>Go to Explorer</span>
                      </a>
                    )}
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
            <td
              className={classes.txId}
              onClick={() => {
                handleSetState({ clicked: "from" });
              }}
              ref={wrapperRef}
            >
              {breakAddress(data.data.from)}
              {data.data.from && clicked === "from" ? (
                isCopied ? (
                  <div className={classes.copied}>Copied!</div>
                ) : (
                  <div className={classes.clickable}>
                    <CopyToClipboard text={data.data.from}>
                      <span className={classes.copy} onClick={onCopyText}>
                        Copy
                      </span>
                    </CopyToClipboard>
                    <a href={explorer + "address/" + data.data.from} target="_blank">
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
            <td>To</td>
            <td
              className={classes.txId}
              onClick={() => {
                handleSetState({ clicked: "to" });
              }}
              ref={wrapperRef}
            >
              {breakAddress(data.data.to)}
              {data.data.to && clicked === "to" ? (
                isCopied ? (
                  <div className={classes.copied}>Copied!</div>
                ) : (
                  <div className={classes.clickable}>
                    <CopyToClipboard text={data.data.to}>
                      <span className={classes.copy} onClick={onCopyText}>
                        Copy
                      </span>
                    </CopyToClipboard>
                    <a href={explorer + "address/" + data.data.to} target="_blank">
                      <span className={classes.explore}>Go to Explorer</span>
                    </a>
                  </div>
                )
              ) : (
                ""
              )}
            </td>
          </tr>
          {data.data.price ? (
            <tr>
              <td>Amount ID</td>
              <td className={classes.icon}>
                {" "}
                {data.data.price}
                <img src={data.chain ? supportedChains[data.chain].icon : algoIcon} alt="" />{" "}
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
