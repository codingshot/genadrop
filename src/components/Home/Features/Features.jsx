import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./Features.module.css";
import { features } from "./Feature-Script";
import linkIcon from "../../../assets/icon-arr-right-long.svg";

const Features = () => {
  useEffect(() => {
    const cards = document.getElementsByClassName("features-card");
    const offSet = 100;
    window.addEventListener("scroll", () => {
      for (const card of cards) {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop + offSet <= window.innerHeight) {
          card.children[0].style.transform = "translateX(0)";
          card.children[1].style.transform = "translateX(0)";
        } else {
          card.children[0].style.transform = "translateX(-3em)";
          card.children[1].style.transform = "translateX(3em)";
        }
      }
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        The All in One No Code Solution <br /> for your NFT Needs
      </div>
      <div className={classes.description}>
        Create, Mint & Sell forward faster with <span>no-code</span> tool that perfectly guide you from NFT Creation to
        Sale.
      </div>
      <div className={classes.wrapper}>
        {features.map((f, idx) => (
          <div key={idx} className={`${classes.featureContainer} ${idx % 2 !== 0 && classes.not} features-card`}>
            <div className={classes.content}>
              <div className={classes.fHeading}>{f.heading}</div>
              <div className={classes.fTitle}>{f.title}</div>
              <div className={classes.fDescription}>{f.description}</div>
              <Link to={f.url} className={classes.fLink}>
                <div>{f.link}</div>
                <img src={linkIcon} alt="" />
              </Link>
            </div>
            <img className={classes.image} src={f.image} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
