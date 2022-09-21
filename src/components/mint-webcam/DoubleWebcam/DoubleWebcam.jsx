import React, { useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { toSvg } from "html-to-image";
import mergeImages from "merge-images";
import { Canvg } from "canvg";
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
  // const covertSvgtoPng = (svg) => {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   // Read the SVG string using the fromString method
  //   // of Canvg
  //   const v = Canvg.fromString(ctx, svg);

  //   // Start drawing the SVG on the canvas
  //   v.start();

  //   // Convert the Canvas to an image
  //   const img = canvas.toDataURL("img/png");
  //   return img;
  // };

  function loadImage(src) {
    const image = new Image();
    image.onload = function () {
      image.src = src;
    };
    image.src = src;
    return image;
  }
  const combineImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img1 = new Image();
    const img2 = new Image();

    img1.onload = function () {
      canvas.width = img1.width;
      canvas.height = img1.height;
      img2.src = faceImg;
    };
    img2.onload = function () {
      // drawImage(image, dx, dy, dWidth, dHeight)
      context.drawImage(img1, 0, 0);
      context.drawImage(img2, 16, 16, frontCamera.current.clientWidth, frontCamera.current.clientHeight);
      continueToMint(canvas.toDataURL());
    };

    img1.src = img;
  };
  const clickHandler = () => {
    try {
      // mergeImages([
      //   { src: img, x: 0, y: 0 },
      //   { src: faceImg, x: 32, y: 0 },
      // ]).then((b64) => console.log(b64));
      // dispatch(setLoader(`Loading`));
      // toSvg(imgContainer.current, { cacheBust: true }).then(function (svg) {
      // const image = new Image();
      // image.src = svg;
      // const canvas = document.createElement("canvas");
      // image.onload = function () {
      //   canvas.width = image.width;
      //   canvas.height = image.height;
      //   canvas.getContext("2d").drawImage(image, 0, 0);
      //   continueToMint(canvas.toDataURL("image/png"));
      //   dispatch(setLoader(``));
      // };
      // });
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
