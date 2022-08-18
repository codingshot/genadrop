import React from "react";
import { useRef, useEffect, useState } from "react";
import classes from "./Banner.module.css";
import img1 from "../../../assets/banner-1.png";
import img2 from "../../../assets/banner-2.png";
import img3 from "../../../assets/banner-3.png";
import bannerImg from "../../../assets/explore-banner.svg";
import Search from "../../Search/Search";
import Chains from "../Chains/Chains";

const Banner = () => {
  const [image, setImage] = useState([img1, img2, img3]);
  const [animate, setAnimate] = useState(false);
  const [counter, setCounter] = useState(0);
  const cardRef = useRef();
  const bannerRef = useRef();

  const handleSet = () => {
    const img = [...image];
    img.unshift(img.pop());
    setImage(img);
    setAnimate(true);
  };

  return (
    <div ref={bannerRef} style={{ backgroundImage: `url(${bannerImg})` }} className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.title}>Find, Buy and Sell NFTs across blockchains</div>
        <div className={classes.searchAndNavWrapper}>
          <Search />
        </div>
        <div className={classes.searchBottom}>
          <span>1 of 1s</span>
          <span>Collections</span>
          <span>Photographs</span>
          <span>Creators</span>
        </div>
        <Chains />
      </div>
    </div>
  );
};

export default Banner;
