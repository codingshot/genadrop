import React, { useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { toBlob } from "html-to-image";
import { Camera } from "../Camera";
import classes from "./DoubleWebcam.module.css";
import { switchCameraToRear } from "../Capture/Capture-script";
import Hypnosis from "../Hypnosis-Loader/Hypnosis";
// icons
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setZip } from "../../../gen-state/gen.actions";

const DoubleWebcam = ({ doubleCameraProps }) => {
  const imgContainer = useRef();

  const history = useHistory();

  const { dispatch } = useContext(GenContext);

  const { img, faceImg, toggle, webcamRef, handleSetState, webcam, loaderToggle } = doubleCameraProps;

  const takePicture = () => {
    const imageSrc = webcamRef.current.takePhoto();

    handleSetState({ img: imageSrc });
    switchCameraToRear(webcam, handleSetState, webcamRef);
  };

  useEffect(() => {
    if (img && webcamRef.current) {
      handleSetState({
        loaderToggle: true,
      });
      setTimeout(() => {
        handleSetState({
          loaderToggle: false,
        });
        const imageSrc = webcamRef.current.takePhoto();
        handleSetState({ faceImg: imageSrc });
      }, 5000);
    }
  }, [img]);

  // const continueToMint = (image) => {
  //   const name = "Image";
  //   const result = getFileFromBase64(image, name, "image/png");

  //   dispatch(
  //     setZip({
  //       name,
  //       file: result,
  //     })
  //   );

  //   history.push("/mint/1of1");
  // };

  const clickHandler = () => {
    toBlob(imgContainer.current, { cacheBust: true }).then(function (blob) {
      const fileName = "Image";
      const file = new File([blob], fileName, { lastModified: new Date().getTime(), type: "image/jpg" });
      dispatch(
        setZip({
          fileName,
          file,
        })
      );

      history.push("/mint/1of1");
    });
  };
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
      <div ref={imgContainer} className={classes.combineImgs}>
        <img src={faceImg} className={classes.faceImg} alt="" />
        <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" />
      </div>
      <div className={classes.imgBtn}>
        <div className={`${classes.mintBtn}`} onClick={clickHandler}>
          Continue
        </div>
      </div>
    </div>
  ) : (
    <div className={classes.videoContainer}>
      <div className={`${classes.videoWrapper} ${img ? classes.frontCamera : ""}`}>
        {toggle && (
          <Camera
            className={img ? classes.frontCamera : ""}
            facingMode="environment"
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

        <div className={classes.uploadBtn} onClick={() => switchCameraToRear(webcam, handleSetState, webcamRef)}>
          <CameraSwitch />
        </div>
      </div>
    </div>
  );
};

export default DoubleWebcam;
