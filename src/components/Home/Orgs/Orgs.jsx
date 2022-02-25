import React from 'react';
import classes from './Orgs.module.css';
import org1 from "../../../assets/org1.svg";
import org2 from "../../../assets/org2.svg";
import org3 from "../../../assets/org3.svg";
import org4 from "../../../assets/org4.svg";
import box from "../../../assets/box.svg";
import ball from "../../../assets/ball.svg";


const Orgs = () => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Backed by the Web3's <span>Best Orgs</span></div>
      <div className={classes.description}>
        From the leading blockchains, creative groups, and DAOs, GenaDrop is supported by the industry’s best.
      </div>
      <div className={classes.orgs}>
        <img className={classes.org} onClick={() => window.open("https://celocommunityfund.org/", "_blank")} src={org4} alt="" />
        <img className={classes.org} onClick={() => window.open("https://near.foundation/", "_blank")} src={org3} alt="" />
        <img className={classes.org} onClick={() => window.open("https://www.algorand.com/", "_blank")} src={org2} alt="" />
        <img className={classes.org} onClick={() => window.open("https://www.minorityprogrammers.com/", "_blank")} src={org1} alt="" />
      </div>
      <div className={classes.bgIcons}>
        <img src={box} alt="" />
        <img src={ball} alt="" />
      </div>
    </div>
  )
}

export default Orgs;