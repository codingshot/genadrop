/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
import React, { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import wrongSvg from "../../assets/something_wrong.svg";
import classes from "./something_wrong.module.css";

const SomethingWentWrong = () => {
  const history = useHistory();
  const goHome = () => {
    history.push("/");
    window.location.reload();
  };

  useLayoutEffect(() => {
    let hideFooter = document.getElementById("hide-footer");
    if (hideFooter) {
      hideFooter.style.display = "none";
    }
  }, []);

  return (
    <div className={classes["container"]}>
      <div className={classes["not-found"]}>
        <img src={wrongSvg} alt="" />
        <h1>Oops something went wrong</h1>
        <div className={classes["text"]}>
          <span>We are working to fix it, click the refresh button to reload page.</span>
        </div>
      </div>
      <div className={classes["button-container"]}>
        <div onClick={goHome} className={classes["home"]}>
          Take Me Home
        </div>
        <div onClick={() => window.location.reload()} className={classes["go-back"]}>
          Refresh
        </div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
