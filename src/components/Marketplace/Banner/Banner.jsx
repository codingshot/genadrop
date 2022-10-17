import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./Banner.module.css";
import Search from "../../Search/Search";
import Chains from "../Chains/Chains";
import image_url from "../../../assets/banner-marketplace.svg";
import { GenContext } from "../../../gen-state/gen.context";

const Banner = () => {
  const history = useHistory();

  return (
    <div className={classes.container} style={{ backgroundImage: `url(${image_url})` }}>
      <div className={classes.wrapper}>
        <div className={classes.heading}>
          <div className={classes.title}>
            Find, Buy and Sell NFTs across <br /> blockchains
          </div>
          <div className={classes.searchContainer}>
            <Search searchPlaceholder="Search collections, and 1 of 1s" type={""} />
          </div>
          <div className={classes.category}>
            <span onClick={() => history.push("/marketplace/1of1")}>1 of 1s</span>
            <span onClick={() => history.push("/marketplace/collections")}>Collections</span>
            {/* <span onClick={() => {}}>Photographs</span>
            <span onClick={() => {}}>Creators</span> */}
          </div>
        </div>
        <Chains />
      </div>
    </div>
  );
};

export default Banner;
