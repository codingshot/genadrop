import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import wrongSvg from "../../assets/something_wrong.svg";
import home from "../../assets/home-svg.svg";
import homeWhite from "../../assets/home-white.svg";
import refresh from "../../assets/bx_refresh.svg";
import classes from "./something_wrong.module.css";
import refresh_green from "../../assets/bx_refresh_green.svg";

const SomethingWentWrong = () => {
  const [changeImage, setChangeImage] = useState(home);
  const [refreshColor, setRefreshColor] = useState(refresh);
  const history = useHistory();
  const goHome = () => {
    history.push("/");
    window.location.reload();
  };
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
        <div
          onMouseOver={(e) => setChangeImage((e.currentTarget.src = homeWhite))}
          onMouseOut={(e) => setChangeImage((e.currentTarget.src = home))}
          onClick={goHome}
          className={classes["home"]}
        >
          <img src={changeImage} alt="" />
          Take Me Home
        </div>
        <div
          onMouseOut={(e) => setRefreshColor((e.currentTarget.src = refresh))}
          onMouseOver={(e) => setRefreshColor((e.currentTarget.src = refresh_green))}
          onClick={() => window.location.reload()}
          className={classes["go-back"]}
        >
          <img src={refreshColor} alt="" />
          Refresh
        </div>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
