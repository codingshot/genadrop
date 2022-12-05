import React from "react";
import classes from "./ProfileImgOverlay.module.css";
import { updateZip } from "../collection-single/collection-single-script";

const ProfileImgOverlay = ({ toggleGuide, file, handleSetState, collectionProfile, zip, handleSetFileState }) => {
  const selectHandler = (f) => {
    handleSetState({ collectionProfile: f });
  };
  const saveHandler = async () => {
    await updateZip(zip, collectionProfile.name, handleSetFileState);
    handleSetState({ toggleGuide: false, collectionProfile: file[0], profileSelected: true });
  };
  return (
    <div className={`${classes.modelContainer} ${toggleGuide ? classes.modelActive : ""}`}>
      <div className={classes.guideContainer}>
        <div className={classes.imgContainer}>
          {file?.slice(0, 6).map((f) => (
            <div
              key={f.name}
              className={collectionProfile.name === f.name && classes.active}
              onClick={() => selectHandler(f)}
            >
              <img src={URL.createObjectURL(f)} alt="" />
            </div>
          ))}
        </div>
        <div
          onClick={() => handleSetState({ previewSelectMode: true, toggleGuide: false, preview: true })}
          className={classes.viewALlBtn}
        >
          View all
        </div>
        <div className={classes.line} />
        <div className={classes.buttonConatiner}>
          <p onClick={() => handleSetState({ toggleGuide: false })}>Cancel</p>
          <div onClick={saveHandler}>Save</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImgOverlay;
