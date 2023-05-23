import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./navbar.module.css";
import { ReactComponent as BackIcon } from "../../../assets/icon-arrow-left.svg";

const Navbar = ({ navbarProps }) => {
  const history = useHistory();
  const { gifShow, gifs, handleSetState, mintInfo, combinations, nftLayers } = navbarProps;

  return (
    <div className={classes.container}>
      <div onClick={() => history.goBack()} className={classes.btnContainer}>
        <BackIcon className={classes.btnIcon} />
      </div>
      <div className={classes.detailsWrapper}>
        {(gifShow || gifs.length > 0) && (
          <div
            onClick={() => (gifs.length > 0 ? handleSetState({ toggleGuide: true }) : "")}
            className={classes.gifDetail}
          >
            <p>GIF</p>
            <span>{gifs.length}</span>
          </div>
        )}
        <div className={classes.detail}>
          <span>Number of Generative Arts</span>
          <span>{nftLayers.length}</span>
        </div>
        <div className={`${classes.detail} ${mintInfo && classes.active}`}>
          <span>Unused Combinations</span>
          <span>{combinations - nftLayers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
