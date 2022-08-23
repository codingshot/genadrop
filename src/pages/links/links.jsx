import React, { useState, useEffect } from "react";
import classes from "./links.module.css";
import { ReactComponent as Share } from "../../assets/share.svg";
import links from "./links-script";

const Links = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const shareHanlder = async () => {
    await navigator.share({
      url: "",
      title: `💧GenaDrop💧`,
    });
  };
  return (
    <div className={classes.pageOverlay}>
      <div className={classes.container}>
        <div className={classes.bg}>
          <div />
        </div>
        <div className={`${classes.topBar} ${scrollY > 30 ? classes.active : ""}`}>
          <div className={classes.topLogo}>
            <img src="/assets/linktree/logo.png" layout="fill" alt="logo" />
          </div>
          <div className={classes.headerTop}>💧GenaDrop💧</div>
          <button className={classes.shareBtn} onClick={shareHanlder} type="button">
            <Share />
          </button>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.header}>
            <div className={classes.logo}>
              <img src="/assets/linktree/logo.png" layout="fill" alt="logo" />
            </div>
            <div className={classes.title}>💧GenaDrop💧</div>
            <div className={classes.description}>
              {" "}
              The no-code , multi-chain generative art nft creator, minter, & marketplace
            </div>
          </div>
          <div className={classes.links}>
            {links.map((link) => (
              <a href={link.url} target="_blank" className={classes.link} key={link.title} rel="noreferrer">
                <img src={link.img} alt={link.title} />
                <div>{link.title}</div>
              </a>
            ))}
          </div>

          {/* <div className={classes.copyright}>© Copyright by {new Date().getFullYear()}&nbsp; Banyan Collective</div> */}
        </div>
      </div>
    </div>
  );
};

export default Links;
