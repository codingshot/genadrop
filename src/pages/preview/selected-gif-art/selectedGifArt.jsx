/* eslint-disable react/no-array-index-key */
import React from "react";
import { addGif } from "../preview-script";
import classes from "./selectedGifArt.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";

const SelectedGifArt = ({ selectedProps }) => {
  const { gifImages, gifShow } = selectedProps;

  return (
    <div className={classes.galleryGif}>
      <div className={classes.galleryGifLine} />
      <div className={classes.galleryGifInfo}>
        <p>Select arts from collection</p>
      </div>
      <div className={classes.galleryGifslides}>
        {gifImages.map((img, idx) => (
          <div key={idx}>
            {gifShow && (
              <div onClick={() => addGif({ ...selectedProps, asset: img })} className={classes.iconClose}>
                <CloseIcon className={classes.closeIcon} />
              </div>
            )}
            <img src={img.image} alt="gifIMG" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedGifArt;
