import { useState } from "react";
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
        <div className={classes.content}>
          <input disabled type="text" value={window.location.href} />
          <Copy message={window.location.href} placeholder={""} />
        </div>
        <div className={classes.shareContent}>
          <TwitterShareButton url={window.location.href}>
            <TwitterIcon className={classes.shareIcon} />
          </TwitterShareButton>
          <FacebookShareButton url={window.location.href}>
            <FacebookIcon className={classes.shareIcon} />
          </FacebookShareButton>
          <WhatsappShareButton url={window.location.href}>
            <WhatsappIcon className={classes.shareIcon} />
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  );
};

export default Share;
