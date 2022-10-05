import React, { useState } from "react";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import classes from "./Share.module.css";
import { ReactComponent as TwitterIcon } from "../../../assets/twitter.svg";
import { ReactComponent as FacebookIcon } from "../../../assets/facebook.svg";
import { ReactComponent as WhatsappIcon } from "../../../assets/whatsapp.svg";
import Copy from "../../../components/copy/copy";

const Share = ({ share, setShare }) => {
  const [click, setClick] = useState(true);
  const handleClose = () => {
    if (click) {
      setShare(false);
    }
  };

  return (
    <div onClick={handleClose} className={`${classes.container} ${share && classes.active}`}>
      <div onMouseEnter={() => setClick(false)} onMouseLeave={() => setClick(true)} className={classes.wrapper}>
        <div className={classes.shareContent}>
          <div className={classes.point}>
            <Copy message={window.location.href} placeholder="" />
            <span>Copy to clipboard</span>
          </div>
          <TwitterShareButton url={window.location.href} className={classes.point}>
            <TwitterIcon className={classes.shareIcon} /> <span>Share on Twitter</span>
          </TwitterShareButton>
          <WhatsappShareButton url={window.location.href} className={classes.point}>
            <WhatsappIcon className={classes.shareIcon} /> <span>Share on Whatsapp</span>
          </WhatsappShareButton>
          <FacebookShareButton url={window.location.href} className={classes.point}>
            <FacebookIcon className={classes.shareIcon} /> <span>Share on Facebook</span>
          </FacebookShareButton>
        </div>
      </div>
    </div>
  );
};

export default Share;
