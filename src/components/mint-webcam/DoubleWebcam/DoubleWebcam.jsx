import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { Camera } from "../Camera";
import classes from "./DoubleWebcam.module.css";
import { switchCameraToRear } from "../Capture/Capture-script";
import Hypnosis from "../Hypnosis-Loader/Hypnosis";
// icons
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";

const DoubleWebcam = ({ doubleCameraProps }) => {
  const history = useHistory();

  const { img, faceImg, toggle, webcamRef, handleSetState, webcam, loaderToggle } = doubleCameraProps;

  const takePicture = () => {
    const imageSrc = webcamRef.current.takePhoto();

    handleSetState({ img: imageSrc });
    switchCameraToRear(webcam, handleSetState, webcamRef);
  };

  useEffect(() => {
    if (img) {
      handleSetState({
        loaderToggle: true,
      });
      setTimeout(() => {
        handleSetState({
          loaderToggle: false,
        });
        const imageSrc = webcamRef.current.takePhoto();
        handleSetState({ faceImg: imageSrc });
      }, 2000);
    }
  }, [img]);

  return img && faceImg ? (
    <div className={classes.cameraWrapper}>
      <div
        onClick={() => {
          handleSetState({
            img: "",
            faceImg: "",
            gif: "",
            video: "",
            activeFile: "gif",
          });
        }}
        className={classes.retake}
      >
        <ArrowLeft />
      </div>

      <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" />
      <img src={faceImg} classNam={classes.frontImage} alt="" />
      <div className={classes.imgBtn}>
        <div className={`${classes.mintBtn} `}>Continue</div>
      </div>
    </div>
  ) : (
    <div className={classes.videoContainer}>
      <div className={`${classes.videoWrapper} ${img ? classes.frontCamera : ""}`}>
        {toggle && (
          <Camera
            className={img ? classes.frontCamera : ""}
            ref={webcamRef}
            aspectRatio="cover"
            errorMessages={{
              noCameraAccessible: "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied: "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
          />
        )}

        {/* {img && <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" />} */}
        {loaderToggle && (
          <div className={classes.loader}>
            <Hypnosis width="4rem" height="4rem" />
            <p>Don't move and keep smiling</p>
          </div>
        )}

        <div className={`${classes.videoOFF} ${toggle ? classes.disabled : ""}`} />
      </div>
      <div className={classes.closeBtn} onClick={() => history.push("/mint/1of1")}>
        <CloseIcon />
      </div>
      <div className={classes.btnWrapper}>
        <div
          onClick={() => takePicture(webcamRef, handleSetState)}
          className={`${classes.captureBtn} ${classes.active}`}
        >
          <IconCapture />
        </div>

        <div className={classes.uploadBtn}>
          <CameraSwitch />
        </div>
      </div>
    </div>
  );
};

export default DoubleWebcam;
