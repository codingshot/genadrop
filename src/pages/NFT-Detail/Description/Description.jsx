import React, { useState } from "react";
import classes from "./Description.module.css";

const Description = ({ nftDetails }) => {
  const [showMore, setShowMore] = useState(false);
  const { description } = nftDetails;
  const sentenceBreak = (str) => {
    return str?.substr(0, 210);
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Description</div>
      <div className={classes.content}>
        {showMore || description?.length <= 210 ? (
          <div>{description || "No description available."}</div>
        ) : (
          <div>
            {sentenceBreak(description)} <span onClick={() => setShowMore(true)}>show more</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;
