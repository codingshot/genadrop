import React from "react";
import classes from "./Orgs.module.css";
import { ReactComponent as Org1 } from "../../../assets/org1.svg";
import { ReactComponent as Org2 } from "../../../assets/org2.svg";
import { ReactComponent as Org3 } from "../../../assets/org3.svg";
import { ReactComponent as Org4 } from "../../../assets/org4.svg";
import { ReactComponent as Box } from "../../../assets/box.svg";
import { ReactComponent as Ball } from "../../../assets/ball.svg";

const Orgs = () => (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      <div className={classes.heading}>
        Backed by the Web3&apos;s <span>Best Orgs</span>
      </div>
      <div className={classes.description}>
        From the leading blockchains, creative groups, and DAOs, GenaDrop is supported by the industry’s best.
      </div>
      <div className={classes.orgs}>
        <Org4
          className={classes.org}
          onClick={() => window.open("https://celocommunityfund.org/", "_blank")}
          alt="org-logo"
        />
        <Org3
          className={classes.org}
          onClick={() => window.open("https://near.foundation/", "_blank")}
          alt="org-logo"
        />
        <Org2
          className={classes.org}
          onClick={() => window.open("https://www.algorand.com/", "_blank")}
          alt="org-logo"
        />
        <Org1
          className={classes.org}
          onClick={() => window.open("https://www.minorityprogrammers.com/", "_blank")}
          alt="org-logo"
        />
      </div>
    </div>
  </div>
);

export default Orgs;
