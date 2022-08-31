import React from "react";
import classes from "./Orgs.module.css";
import { ReactComponent as OrgsIcon } from "../../../assets/icon-orgs.svg";
import { ReactComponent as LinkIcon } from "../../../assets/icon-arr-right-long.svg";
import { Link } from "react-router-dom";

const Orgs = () => (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.heading}>
          Backed by the <span>Web3’s</span> <span>Best Orgs</span>
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

      <OrgsIcon className={classes.orgsIcon} />
    </div>
  </div>
);

export default Orgs;
