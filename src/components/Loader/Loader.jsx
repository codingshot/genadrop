import React, { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Loader.module.css";
import loaderIcon from "../../assets/icon-loading-dark.svg";

const Loader = () => {
  const { loaderMessage } = useContext(GenContext);
  return (
    <div className={`${classes.container} ${loaderMessage && classes.active}`}>
      <img className={classes.icon} src={loaderIcon} alt="" />
      <pre className={classes.message}>{loaderMessage}</pre>
    </div>
  );
};

export default Loader;
