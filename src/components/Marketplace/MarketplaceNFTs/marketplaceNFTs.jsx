import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import classes from "./marketplaceNFTs.module.css";
import redCircle from "../../../assets/circle.svg";
import Collections from "../../../pages/collections/collections";
import SingleNftCollection from "../../../pages/singleNftCollection/singleNftCollection";
import NewNFTs from "../../../pages/newNFTs/newNFTs";

const MarketplaceNFTs = ({ ones, collections }) => {
  const [state, setState] = useState({
    seleted: "new",
    firstClick: false,
    destination: "1of1",
  });

  const { seleted, firstClick, destination } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const history = useHistory();

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <div
          className={`${classes.tab} && ${seleted == "new" ? classes.tabActive : ""}`}
          onClick={() => handleSetState({ seleted: "new", destination: "1of1" })}
        >
          New {!firstClick ? <img className={classes.circle} src={redCircle} alt="" /> : ""}
        </div>
        <div
          className={`${classes.tab} && ${seleted == "ones" ? classes.tabActive : ""}`}
          onClick={() => handleSetState({ seleted: "ones", firstClick: true, destination: "1of1" })}
        >
          1 of 1s
        </div>
        <div
          className={`${classes.tab} && ${seleted == "collection" ? classes.tabActive : ""}`}
          onClick={() => handleSetState({ seleted: "collection", firstClick: true, destination: "collections" })}
        >
          Top Collections
        </div>
      </div>
      <div className={classes.renderAll}>
        {seleted === "new" ? (
          <NewNFTs len={true} />
        ) : seleted === "collection" ? (
          <Collections len={true} />
        ) : (
          <SingleNftCollection len={true} />
        )}
      </div>
      <div className={classes.more}>
        <span className={classes.more} onClick={() => history.push(`marketplace/${destination}`)}>
          See All
        </span>
      </div>
    </div>
  );
};

export default MarketplaceNFTs;
