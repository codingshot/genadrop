import classes from "./upload-overlay.module.css";
import { ReactComponent as UploadIcon } from "../../../assets/icon-mint-upload.svg";

const UploadOverlay = () => {
  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <UploadIcon alt="" />
        <p>Upload file</p>
      </div>
    </div>
  );
};

export default UploadOverlay;
