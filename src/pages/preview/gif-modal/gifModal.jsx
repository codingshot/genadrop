/* eslint-disable react/no-array-index-key */
import React from "react";
import GifCard from "../gif-card/gifCard";
import classes from "../preview.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { addAllGifs, addToCollection } from "../preview-script";

const GifModal = ({ modalProps }) => {
  const { handleSetState, gifs, collectionName, toggleGuide } = modalProps;

  return (
    <div
      onClick={() => handleSetState({ toggleGuide: false })}
      className={`${classes.modelContainer} ${toggleGuide && classes.modelActive}`}
    >
      <div className={classes.guideContainer}>
        <CloseIcon className={classes.closeIcon} onClick={() => handleSetState({ toggleGuide: false })} />
        <div className={`${classes.imgContainer}`}>
          <div className={`${classes.preview} ${classes.modelPreview}`}>
            {gifs.length > 0
              ? gifs.map((asset, index) => {
                  return <GifCard key={index} asset={{ ...asset, index }} gifCardProps={modalProps} />;
                })
              : ""}
          </div>
          <div className={classes.gifAllBtn}>
            <p
              onClick={() =>
                handleSetState({
                  toggleGuide: false,
                  gifs: [],
                })
              }
            >
              Delete all
            </p>
            <div
              onClick={() =>
                gifs.length > 1 ? addAllGifs({ ...modalProps }) : addToCollection({ ...modalProps, gif: gifs[0] })
              }
            >
              Add all to {collectionName || "collection"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifModal;
