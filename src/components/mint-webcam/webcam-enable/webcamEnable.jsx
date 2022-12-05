import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./webcamEnable.module.css";
import { ReactComponent as CameraIcon } from "../../../assets/icon-camera-solid.svg";

const WebcamEnable = ({ toggle, cameraPermission, enableAccess }) => {
  const history = useHistory();

  return (
    <>
      {!cameraPermission ? (
        <div className={`${classes.container}  ${toggle && classes.deactive}`}>
          <div className={classes.popupWrapper}>
            <div className={classes.card}>
              <div className={classes.heading}>
                <CameraIcon />
                <h3>Allow camera access</h3>
                <p>Please allow us to access your web cam to take pictures</p>
              </div>

              <div className={classes.wrapper}>
                <a onClick={() => history.push("/create")}>Don’t allow</a>
                <div type="button" onClick={() => enableAccess()}>
                  Allow access
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default WebcamEnable;
