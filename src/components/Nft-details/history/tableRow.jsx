import React, { useState, useRef, useEffect } from "react";
import classes from "./tableRow.module.css";
import saleIcon from "../../../assets/sale-icon.png";
import mintIcon from "../../../assets/mint-icon.png";
import Transaction from "../../transactionDetails/TransactionDetails";
import { readUserProfile } from "../../../utils/firebase";

const TableRow = (data) => {
  const [state, setState] = useState({
    showTransaction: false,
    to: "",
    from: "",
    userDetails: "",
  });
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { showTransaction, to, from, userDetails } = state;

  function breakAddress(address = "", width = 6) {
    if (!address) return "--";
    return `${address.slice(0, width)}...${address.slice(-width)}`;
  }

  useEffect(() => {
    (async function getUsername() {
      const data = await readUserProfile(to);

      handleSetState({ userDetails: data });
      readUserProfile(to).then((data) => {
        if (data) setState({ to: data.username });
      });

      readUserProfile(from).then((data) => {
        if (data) setState({ from: data.username });
      });
    })();
  }, []);
  const icons = [saleIcon, mintIcon, mintIcon];
  const getDate = () => {
    let newDate = data.date.seconds;
    if (!newDate) {
      newDate = data.date;
    }
    const now = new Date();
    const date = new Date(newDate * 1000);
    const diff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    if (diff < 0.04) return `${parseInt(diff * 24 * 60)} mins ago`;
    if (diff < 1) return `${parseInt(diff * 24)} hours ago`;
    if (diff < 31) return `${parseInt(diff)} days ago`;
    if (diff < 356) return `${parseInt(diff / 30)} months ago`;
    return `${diff / 30 / 12} years ago`;
  };

  const icon = () => {
    let icon = "";
    switch (data.event) {
      case "Sale":
        icon = icons[0];
        break;
      case "Transfer":
        icon = icons[1];
        break;
      case "Minting":
        icon = icons[2];
        break;
      case "Listing":
        icon = icons[1];
        break;
      default:
        break;
    }
    return icon;
  };

  const handleClick = () => {
    handleSetState({ showTransaction: true });
  };

  const wrapperRef = useRef(null);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          handleSetState({ showTransaction: false });
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
  return (
    <>
      {showTransaction ? (
        <div ref={wrapperRef}>
          <Transaction data={data} date={getDate(data.date)} chain={data.chain} />
        </div>
      ) : null}
      <tr className={classes.transaction} onClick={handleClick}>
        <td>
          <span className={classes.icon}>
            <img src={icon()} alt="" />
          </span>
          {data.event}
        </td>
        <td>{userDetails?.username ? userDetails?.username : breakAddress(data.to)}</td>

        <td>{!data.txId ? "--" : breakAddress(data.txId)}</td>
        <td>{getDate(data.date)}</td>
        <td>{!data.price ? "--" : data.price}</td>
        <td>{to || breakAddress(data.to)}</td>
        <td>{from || breakAddress(data.from)}</td>
      </tr>
    </>
  );
};

export default TableRow;
