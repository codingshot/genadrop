import React, { useContext } from "react";
import { GenContext } from "../../gen-state/gen.context";
import classes from "./Loader.module.css";
import { ReactComponent as LoaderIcon } from "../../assets/icon-loading-dark.svg";

const Loader = () => {
  const { loaderMessage } = useContext(GenContext);
  return (
    <div className={`${classes.container} ${loaderMessage && classes.active}`}>
      <LoaderIcon className={classes.icon} alt="" />
      <pre className={classes.message}>{loaderMessage}</pre>
    </div>
  );
};

export default Loader;
