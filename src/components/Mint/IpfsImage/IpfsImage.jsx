/* eslint-disable jsx-a11y/media-has-caption */
import React, { useCallback, useState, useEffect } from "react";
import classes from "./ipfsImage.module.css";

const IpfsImage = ({ ipfsLink, type }) => {
  const [file, setFile] = useState("");

  const getImage = useCallback(async () => {
    try {
      const link = ipfsLink.replace("ipfs://", "https://ipfs.io/ipfs/");
      setFile(link);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getImage();
  }, []);
  return (
    <div className={classes.container}>
      <div>
        {type === "Audio" ? (
          <audio src={file} className={classes.singleVideo} controls muted />
        ) : type === "Video" ? (
          <video src={file} alt="" className={classes.singleVideo} controls />
        ) : (
          <img src={file} alt="" className={classes.singleImage} />
        )}
      </div>
    </div>
  );
};

export default IpfsImage;
