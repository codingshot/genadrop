import classes from "./upload-overlay.module.css";
import uploadIcon from "../../../assets/icon-mint-upload.svg";

const UploadOverlay = () => {
  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <img src={uploadIcon} alt="" />
        <p>Upload file</p>
      </div>
    </div>
  );
};

export default UploadOverlay;
