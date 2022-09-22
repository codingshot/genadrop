import React, { useRef, useState } from "react";

import classes from "./Capture.module.css";
import WebcamEnable from "../webcam-enable/webcamEnable";
import DoubleWebcam from "../DoubleWebcam/DoubleWebcam";
import RegularCamera from "../Regular-Camera/RegularCamera";
// mode switch icons
import { ReactComponent as IconVideo } from "../../../assets/icon-video.svg";
import { ReactComponent as IconDoubleTake } from "../../../assets/icon-dual-camera.svg";
import { ReactComponent as IconCamera } from "../../../assets/icon-camera-switch.svg";

const Capture = () => {
  const webcamRef = useRef();

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
    height: "100%",
    // genrate GIF loading status
    gifGenrating: false,
    webcamCurrentType: "Photo",
    trackRecord: false,
    videoDuration: 0,
    imgList: [],
    loaderToggle: false,
    dualCam: false,
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
    webcamCurrentType,
    videoDuration,
    imgList,
    faceImg,
    loaderToggle,
    dualCam,
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

  const displayedModes = modeSwitchList.filter((mode) => mode.text !== webcamCurrentType);

  const doubleCameraProps = { img, faceImg, toggle, webcamRef, handleSetState, webcam, loaderToggle, displayedModes };
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
    webcamCurrentType,
    currenFile,
    activeFile,
    displayedModes,
  };
  return (
    <div className={`${classes.container}`}>
      <WebcamEnable
        toggle={toggle}
        getVideo={() =>
          handleSetState({
            toggle: true,
          })
        }
      />
      {dualCam ? (
        <DoubleWebcam doubleCameraProps={doubleCameraProps} />
      ) : (
        <RegularCamera regularCameraProps={regularCameraProps} />
      )}
    </div>
  );
};

export default Capture;
