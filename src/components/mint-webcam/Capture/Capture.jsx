import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./Capture.module.css";
import WebcamEnable from "../webcam-enable/webcamEnable";
import DoubleWebcam from "../Camera-Modes/DoubleWebcam";
import RegularCamera from "../Camera-Modes/RegularCamera";
import { GenContext } from "../../../gen-state/gen.context";
import { setNotification } from "../../../gen-state/gen.actions";
// mode switch icons
import { ReactComponent as IconVideo } from "../../../assets/icon-video.svg";
import { ReactComponent as IconDoubleTake } from "../../../assets/icon-dual-camera.svg";
import { ReactComponent as IconCamera } from "../../../assets/icon-camera-switch.svg";

const Capture = () => {
  const webcamRef = useRef();

  const history = useHistory();

  const pathname = history.location?.pathname.replace("/mint/", "");

  const { dispatch } = useContext(GenContext);

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
    height: "100%",
    // genrate GIF loading status
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
    webcamCurrentType,
    videoDuration,
    imgList,
    faceImg,
    loaderToggle,
    dualCam,
    attributes,
    category,
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
    webcamCurrentType,
    currenFile,
    activeFile,
    displayedModes,
    attributes,
  };

  // get current location
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    const crd = pos.coords;
    const lat = crd.latitude;
    const lon = crd.longitude;
    const API_KEY = "pk.eyJ1IjoiYmFhbTI1IiwiYSI6ImNsOG4wNzViMzAwcjAzd2xhMm52ajJoY2MifQ.kxO2vxRxoGGrvJjxnQhl5g";
    const API_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?limit=1&types=place%2Ccountry&access_token=${API_KEY}`;
    if (lat && lon) {
      if (category === "sesh" || category === "vibe") {
        axios
          .get(API_URL)
          .then((data) => {
            const address = data?.data?.features[0]?.place_name;
            handleSetState({
              toggle: true,
              attributes: {
                ...attributes,
                location: { trait_type: "location", value: address },
              },
            });
          })
          .catch((err) => console.log(err));
      }
    }
  }
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    dispatch(
      setNotification({
        message: "Location access denied",
        type: "error",
      })
    );
    history.push("/create");
  }

  const getLocation = () => navigator.geolocation.getCurrentPosition(success, error, options);

  const enableAccess = () => {
    if (category === "sesh" || category === "vibe") {
      getLocation();
    } else {
      handleSetState({
        toggle: true,
      });
    }
  };

  return (
    <div className={`${classes.container}`}>
      <WebcamEnable toggle={toggle} pathname={pathname} enableAccess={enableAccess} />
      {dualCam ? (
        <DoubleWebcam doubleCameraProps={doubleCameraProps} />
      ) : (
        <RegularCamera regularCameraProps={regularCameraProps} />
      )}
    </div>
  );
};

export default Capture;
