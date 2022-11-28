import React from "react";
import classes from "./mintIpfs.module.css";

const MintIpfs = () => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>Mint Using IPFS</h1>
        <h6 className={classes.subTitle}>Mint your NFT directly using your IPFS Link</h6>
      </div>
      <div>
        <span>Enter IPFS Link</span>
        {/* <div></div> */}
      </div>
    </div>
  );
};

export default MintIpfs;
