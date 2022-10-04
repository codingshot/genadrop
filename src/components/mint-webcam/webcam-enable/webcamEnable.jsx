import React from "react";
import { useHistory } from "react-router-dom";
import style from "./webcamEnable.module.css";
import { ReactComponent as CameraIcon } from "../../../assets/icon-camera-solid.svg";

const WebcamEnable = ({ toggle, pathname, enableAccess }) => {
  const history = useHistory();

  const enableLocation = pathname === "vibe" || pathname === "sesh";
  return (
    <div className={`${style.container}  ${toggle && style.deactive}`}>
      <div className={style.popupWrapper}>
        <div className={style.card}>
          <div className={style.heading}>
            <CameraIcon />
            <h3>{enableLocation ? "Allow camera & Location access" : "Allow camera access"}</h3>
            <p>
              {enableLocation
                ? "Please allow us to access your web cam and Location to take pictures"
                : "Please allow us to access your web cam to take pictures"}
            </p>
          </div>

          <div className={style.wrapper}>
            <a onClick={() => history.push("/mint/create")}>Don’t allow</a>
            <div type="button" onClick={() => enableAccess()}>
              Allow access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamEnable;
