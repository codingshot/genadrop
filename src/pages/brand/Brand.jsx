import React from "react";
import classes from "./Brand.module.css";

const Brand = () => {
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        GenaDrop <span> Brand Kit</span>
      </div>
      <div className={classes.descripton}>
        Download our assets if you want to create anything with our brand name on it. These files will help us define
        and build a consistent brand presence and experience across the world.
      </div>
    </div>
  );
};

export default Brand;
