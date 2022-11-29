import React, { useCallback, useState, useEffect } from "react";
import classes from "./ipfsImage.module.css";

const IpfsImage = ({ ipfsLink }) => {
  const [image, setImage] = useState("");
  const getImage = useCallback(async () => {
    try {
      const link = ipfsLink.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImage(link);
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
        <img alt="" src={image} />
      </div>
    </div>
  );
};

export default IpfsImage;
