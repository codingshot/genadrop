import React from "react";
import { useHistory } from "react-router-dom";
import style from "./webcamEnable.module.css";
import { ReactComponent as CameraIcon } from "../../../assets/icon-camera-solid.svg";

const WebcamEnable = ({ toggle, getVideo }) => {
  const history = useHistory();

  return (
    <div className={`${style.container}  ${toggle && style.deactive}`}>
      <div className={style.popupWrapper}>
        <div className={style.card}>
          <div className={style.heading}>
            <CameraIcon />
            <h3>Allow camera access</h3>
            <p>Please allow us to access your web cam to take pictures</p>
          </div>

          <div className={style.wrapper}>
            <a onClick={() => history.push("/mint/1of1")}>Don’t allow</a>
            <div type="button" onClick={() => getVideo()}>
              Allow access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamEnable;
