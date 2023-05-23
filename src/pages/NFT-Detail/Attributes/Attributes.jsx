/* eslint-disable react/no-array-index-key */
import React from "react";
import classes from "./Attributes.module.css";

const Attributes = ({ nftDetails }) => {
  const { properties } = nftDetails;

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Attributes</div>
      <div className={classes.attributes}>
        {properties?.map((p, idx) => (
          <div key={idx} className={classes.attribute}>
            <div className={classes.type}>
              <div className={classes.title}>{p.trait_type}</div>
              <div className={classes.value}>{p.value}</div>
            </div>
            <div className={classes.rarity}>
              <div className={classes.title}>Rarity</div>
              <div className={classes.value_}>1%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attributes;
