import React, { useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Camera } from "../Camera";
import classes from "./DoubleWebcam.module.css";
import { switchCameraToRear, getFileFromBase64 } from "../Capture/Capture-script";
import Hypnosis from "../Hypnosis-Loader/Hypnosis";
// icons
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setZip, setNotification, setLoader } from "../../../gen-state/gen.actions";

const DoubleWebcam = ({ doubleCameraProps }) => {
  const imgContainer = useRef();
  const frontCamera = useRef();
  const rearCamera = useRef();

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

  const continueToMint = (image) => {
    const name = "Image";
    const result = getFileFromBase64(image, name, "image/png");

    dispatch(
      setZip({
        name,
        file: result,
      })
    );

    history.push("/mint/1of1");
  };
  // function roundedImage(ctx, x, y, width, height, radius) {
  //   ctx.beginPath();
  //   ctx.moveTo(x + radius, y);
  //   ctx.lineTo(x + width - radius, y);
  //   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  //   ctx.lineTo(x + width, y + height - radius);
  //   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  //   ctx.lineTo(x + radius, y + height);
  //   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  //   ctx.lineTo(x, y + radius);
  //   ctx.quadraticCurveTo(x, y, x + radius, y);
  //   ctx.closePath();
  // }

  // const imageSrc = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/157293/i1.jpg";

  // document.addEventListener("DOMContentLoaded", () => {
  //   // round corner canvas' reference
  //   const roundCornerCanvas = document.getElementById("round-corner");
  //   const roundCornerCtx = roundCornerCanvas.getContext("2d");

  //   // circle canvas' reference
  //   const circleCanvas = document.getElementById("circle");
  //   const circleCtx = circleCanvas.getContext("2d");

  //   const img = new Image();

  //   img.onload = function () {
  //     // draw image with round corner
  //     roundCornerCtx.save();
  //     roundedImage(roundCornerCtx, 20, 20, 260, 260, 10);
  //     roundCornerCtx.strokeStyle = "#2465D3";
  //     roundCornerCtx.stroke();
  //     roundCornerCtx.clip();
  //     roundCornerCtx.drawImage(img, 20, 20, 260, 260);
  //     roundCornerCtx.restore();

  //     // draw image with circle shape clip
  //     circleCtx.save();
  //     circleCtx.beginPath();
  //     circleCtx.arc(150, 150, 130, 0, Math.PI * 2, false);
  //     circleCtx.strokeStyle = "#2465D3";
  //     circleCtx.stroke();
  //     circleCtx.clip();
  //     circleCtx.drawImage(img, 0, 0, 300, 300);
  //     circleCtx.restore();
  //   };

  //   img.src = imageSrc;
  // });

  const combineImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img1 = new Image();
    const img2 = new Image();

    img1.onload = function () {
      canvas.width = rearCamera.current.clientWidth;
      canvas.height = rearCamera.current.clientHeight;
      img2.src = faceImg;
    };
    img2.onload = function () {
      // drawImage(image, dx, dy, dWidth, dHeight)
      context.drawImage(img1, 0, 0, rearCamera.current.clientWidth, rearCamera.current.clientHeight);
      context.drawImage(img2, 16, 16, frontCamera.current.clientWidth, frontCamera.current.clientHeight);
      continueToMint(canvas.toDataURL());
    };

    img1.src = img;
  };
  const clickHandler = () => {
    try {
      combineImage();
    } catch (err) {
      dispatch(
        setNotification({
          message: err,
          type: "warning",
        })
      );
      console.log(err);
    }
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
        <img src={faceImg} className={classes.faceImg} alt="camera-shot" ref={frontCamera} />
        <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" ref={rearCamera} />
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
