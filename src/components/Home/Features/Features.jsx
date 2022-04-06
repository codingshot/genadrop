import React from "react";
import Feature from "./Feature";
import classes from "./Features.module.css";

const Features = ({ data }) => {
  const { heading, headingAccent, image, description, feature } = data;
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        {heading} <span>{headingAccent}</span>
      </div>
      <div className={classes.description}>{description}</div>
      <div className={classes.main}>
        <div className={classes.featureWrapper}>
          {feature.map((f) => (
            <Feature key={f.id} item={f} />
          ))}
        </div>
        <img src={image} alt="" />
      </div>
    </div>
  );
};

export default Features;
