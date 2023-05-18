/* eslint-disable no-shadow */
import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import classes from "./Capture.module.css";
import WebcamEnable from "../webcam-enable/webcamEnable";
import DoubleWebcam from "../Camera-Modes/DoubleWebcam";
import RegularCamera from "../Camera-Modes/RegularCamera";
// mode switch icons
import { ReactComponent as IconVideo } from "../../../assets/icon-video.svg";
import { ReactComponent as IconDoubleTake } from "../../../assets/icon-dual-camera.svg";
import { ReactComponent as IconCamera } from "../../../assets/icon-camera-switch.svg";

const Capture = () => {
  const webcamRef = useRef();

  const history = useHistory();

  const pathname = history.location?.pathname.replace("/mint/", "");

  /* regular expression 
  containing some mobile devices keywords 
  to search it in details string */
  const details = navigator?.userAgent;

  const regexp = /android|iphone|kindle|ipad/i;

  const isMobileDevice = regexp.test(details);

  const [state, setState] = useState({
    toggle: false,
    // each type file
    img: "",
    faceImg: "",
    gif: "",
    video: "",
    // current file to mint
    currenFile: "",
    activeFile: "gif",
    // User or Environment camera
    webcam: "environment",
    // video size
    width: "100%",
    stickType: "",
    height: "100%",
    // genrate GIF loading status
    cameraPermission: false,
    gifGenrating: false,
    webcamCurrentType: pathname === "video" ? "Video" : pathname === "doubletake" ? "Doubletake" : "Photo",
    trackRecord: false,
    videoDuration: 0,
    imgList: [],
    loaderToggle: false,
    dualCam: pathname === "doubletake" && isMobileDevice,
    attributes: {},
    category: pathname,
  });

  const {
    toggle,
    img,
    webcam,
    gif,
    video,
    currenFile,
    activeFile,
    gifGenrating,
    stickType,
    webcamCurrentType,
    cameraPermission,
    videoDuration,
    imgList,
    faceImg,
    loaderToggle,
    dualCam,
    attributes,
  } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const modeSwitchList = [
    {
      id: 1,
      text: "Video",
      icon: <IconVideo />,
    },
    {
      id: 2,
      text: "Photo",
      icon: <IconCamera />,
    },
    {
      id: 3,
      text: "Doubletake",
      icon: <IconDoubleTake />,
    },
  ];

  useEffect(async () => {
    navigator.permissions.query({ name: "camera" }).then((permission) => {
      handleSetState({ cameraPermission: permission.state === "granted", toggle: permission.state === "granted" });
    });
  }, []);

  const displayedModes = modeSwitchList.filter((mode) => mode.text !== webcamCurrentType);

  const doubleCameraProps = {
    img,
    faceImg,
    toggle,
    webcamRef,
    handleSetState,
    webcam,
    loaderToggle,
    displayedModes,
    attributes,
  };
  const regularCameraProps = {
    img,
    imgList,
    gif,
    toggle,
    webcamRef,
    handleSetState,
    webcam,
    video,
    videoDuration,
    gifGenrating,
    stickType,
    webcamCurrentType,
    currenFile,
    activeFile,
    displayedModes,
    attributes,
  };

  const enableAccess = async () => {
    handleSetState({
      toggle: true,
    });
  };

  return (
    <div className={`${classes.container}`}>
      <WebcamEnable toggle={toggle} enableAccess={enableAccess} cameraPermission={cameraPermission} />
      {dualCam ? (
        <DoubleWebcam doubleCameraProps={doubleCameraProps} />
      ) : (
        <RegularCamera regularCameraProps={regularCameraProps} />
      )}
    </div>
  );
};

export default Capture;
