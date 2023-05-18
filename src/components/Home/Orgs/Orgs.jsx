import { Link } from "react-router-dom";
import React from "react";
import classes from "./Orgs.module.css";
import { ReactComponent as LinkIcon } from "../../../assets/icon-arr-right-long.svg";
import mpLogo from "../../../assets/logo-mp.png";
import celoLogo from "../../../assets/logo-celo.png";
import algoLogo from "../../../assets/logo-algo.png";
import nearLogo from "../../../assets/logo-near.png";
import mpIcon from "../../../assets/logo-polygon-icon.png";
import celoIcon from "../../../assets/logo-celo-icon.png";
import algoIcon from "../../../assets/logo-algo-icon.png";
import nearIcon from "../../../assets/logo-near-icon.png";

const Orgs = () => (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.heading}>
          <span>Backed by the</span> <span className={classes.accent}>Web3’s</span>{" "}
          <span className={classes.accent}>Best Orgs</span>
        </div>
        <div className={classes.description}>
          From the leading blockchains, creative groups, and DAOs, GenaDrop is supported by the industry’s best. Want to
          learn more about GenaDrop?
        </div>
        <Link to="/docs" className={classes.link}>
          <div className={classes.btn}>Read the Docs</div>
          <LinkIcon className={classes.linkIcon} />
        </Link>
      </div>
      <div className={classes.orgs}>
        <a
          href="https://celocommunityfund.org/"
          target="_blank"
          rel="noreferrer"
          className={`${classes.org} ${classes.celo}`}
        >
          <img className={classes.logo} src={celoLogo} alt="" />
          <img className={classes.icon} src={celoIcon} alt="" />
        </a>
        <a
          href="https://near.foundation/"
          target="_blank"
          rel="noreferrer"
          className={`${classes.org} ${classes.near}`}
        >
          <img className={classes.logo} src={nearLogo} alt="" />
          <img className={classes.icon} src={nearIcon} alt="" />
        </a>
        <a
          href="https://www.minorityprogrammers.com/"
          target="_blank"
          rel="noreferrer"
          className={`${classes.org} ${classes.mp}`}
        >
          <img className={classes.logo} src={mpLogo} alt="" />
          <img className={classes.icon} src={mpIcon} alt="" />
        </a>
        <a
          href="https://www.algorand.com/"
          target="_blank"
          rel="noreferrer"
          className={`${classes.org} ${classes.algo}`}
        >
          <img className={classes.logo} src={algoLogo} alt="" />
          <img className={classes.icon} src={algoIcon} alt="" />
        </a>
      </div>
    </div>
  </div>
);

export default Orgs;
