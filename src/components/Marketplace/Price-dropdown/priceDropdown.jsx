import React, { useState } from "react";
import classes from "./priceDropdown.module.css";
import dropdownIcon from "../../../assets/down-arrow.svg";
import arrowDown from "../../../assets/icon-arrow-down-long.svg";
import arrowUp from "../../../assets/icon-arrow-up-long.svg";

const PriceDropdown = ({ onPriceFilter }) => {
  const [state, setState] = useState({
    togglePriceFilter: false,
    filter: "low",
  });

  const { filter, togglePriceFilter } = state;

  const filters = {
    low: "Low to High",
    high: "High to Low",
    // txVolume: "Transaction Volume",
    newest: "Newest",
    oldest: "Oldest",
    descAlphabet: "Z-A",
    ascAlphabet: "A-Z",
  };

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const filterPropertyUpdate = (filterProp) => {
    handleSetState({ filter: filterProp, togglePriceFilter: false });
    onPriceFilter(filter);
  };
  return (
    <div className={classes.priceDropdown}>
      <div onClick={() => handleSetState({ togglePriceFilter: !togglePriceFilter })} className={classes.selectedPrice}>
        Filter
        <div className={classes.priceInfo}>
          <span>{filters[filter]}</span>
          <img src={dropdownIcon} alt="" className={`${classes.dropdownIcon} ${togglePriceFilter && classes.active}`} />
        </div>
      </div>
      <div className={`${classes.dropdown} ${togglePriceFilter && classes.active}`}>
        {filter != "low" && (
          <div onClick={() => filterPropertyUpdate("low")}>
            price
            <div className={classes.priceInfo}>
              <span>Low to High</span> <img src={arrowUp} alt="" />
            </div>
          </div>
        )}
        {filter != "high" && (
          <div onClick={() => filterPropertyUpdate("high")}>
            price
            <div className={classes.priceInfo}>
              <span>High to Low</span>
              <img src={arrowDown} alt="" />
            </div>
          </div>
        )}

        {filter != "newest" && (
          <div onClick={() => filterPropertyUpdate("newest")}>
            Added
            <div className={classes.priceInfo}>
              <span>Newest</span>
              <img src={arrowUp} alt="" />
            </div>
          </div>
        )}
        {filter != "oldest" && (
          <div onClick={() => filterPropertyUpdate("oldest")}>
            Added
            <div className={classes.priceInfo}>
              <span>Oldest</span>
              <img src={arrowDown} alt="" />
            </div>
          </div>
        )}
        {filter != "ascAlphabet" && (
          <div onClick={() => filterPropertyUpdate("ascAlphabet")}>
            Alphabet
            <div className={classes.priceInfo}>
              <span>A-Z </span>
              <img src={arrowUp} alt="" />
            </div>
          </div>
        )}

        {filter != "descAlphabet" && (
          <div onClick={() => filterPropertyUpdate("descAlphabet")}>
            Alphabet
            <div className={classes.priceInfo}>
              <span>Z-A</span>
              <img src={arrowDown} alt="" />
            </div>
          </div>
        )}

        {/* {filter != "txVolume" && (
          <div onClick={() => filterPropertyUpdate("txVolume")}>
            <div className={classes.priceInfo}>
              <span>Transaction Volume</span>
              <img src={arrowDown} alt="" />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PriceDropdown;
