import React from "react";
import { useRef, useEffect, useState } from "react";
import classes from "./Banner.module.css";
import img1 from "../../../assets/banner-1.svg";
import img2 from "../../../assets/banner-2.svg";
import img3 from "../../../assets/banner-3.svg";
import bannerImg from "../../../assets/banner.png";

const Banner = () => {
  const [image, setImage] = useState([img1, img2, img3]);
  const [animate, setAnimate] = useState(false);
  const [counter, setCounter] = useState(0);
  const cardRef = useRef();

  const handleSet = () => {
    const img = [...image];
    img.unshift(img.pop());
    setImage(img);
    setAnimate(true);
  };

  useEffect(() => {
    cardRef.current.onanimationend = () => {
      setAnimate(false);
    };

    setInterval(() => {
      setCounter((c) => (c >= image.length - 1 ? 0 : c + 1));
    }, 5000);
  }, []);

  useEffect(() => {
    handleSet();
  }, [counter]);

  return (
    <div style={{ backgroundImage: `url(${bannerImg})` }} className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <div className={classes.title}>Explore Unique and Exclusive NFTs across different blockchains</div>
          <div className={classes.description}>
            The first NFT marketplace that enables creators to create their generative NFTs and embed licenses{" "}
          </div>
          <div className={classes.btn}>Explore</div>
        </div>
        <div className={`${classes.cardContainer} ${animate && classes.active}`}>
          <img src={image[0]} alt="" className={classes.cardLeft} />
          <img src={image[1]} alt="" ref={cardRef} className={classes.cardCenter} />
          <img src={image[2]} alt="" className={classes.cardRight} />
          <div className={classes.indicator}>
            <div className={`${counter === 0 && classes.active}`}></div>
            <div className={`${counter === 1 && classes.active}`}></div>
            <div className={`${counter === 2 && classes.active}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
