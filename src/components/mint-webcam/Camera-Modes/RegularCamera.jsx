import React, { useEffect, useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLongPress } from "use-long-press";
import { Camera } from "../Camera";
import classes from "./Camera.module.css";
import {
  getFileFromBase64,
  takePicture,
  switchCameraToRear,
  updateVideoSize,
  generateGif,
  capitalizeFirstLetter,
  isEmpty,
} from "../Capture/Capture-script";
import useTimer from "../Capture/useTimer";
import RecordBtn from "../Capture/RecordBtn";
import Tooltip from "../Tooltip/Tooltip";
import StickType from "../../stick-type/StickType";
// icons
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
// Context
import { GenContext } from "../../../gen-state/gen.context";
import { setZip } from "../../../gen-state/gen.actions";

const RegularCamera = ({ regularCameraProps }) => {
  // video capture
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [seshType, setSeshType] = useState(false);

  const mediaRecorderRef = useRef();
  const webcamWrapper = useRef();
  const videoRef = useRef();

  const history = useHistory();

  const { dispatch } = useContext(GenContext);

  // stopwatch, set to 8 sec
  const { seconds, start, stop } = useTimer();

  const {
    img,
    imgList,
    gif,
    toggle,
    webcamRef,
    handleSetState,
    webcam,
    video,
    videoDuration,
    stickType,
    gifGenrating,
    webcamCurrentType,
    currenFile,
    activeFile,
    displayedModes,
    attributes,
  } = regularCameraProps;

  const pathname = history.location?.pathname.replace("/mint/", "");
  const onlyCamera = pathname === "sesh" || pathname === "vibe";

  // Record Handles
  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = React.useCallback(
    (event) => {
      event.returnValue = false;
      start();
      setCapturing(true);
      handleSetState({
        imgList: [],
      });
      const stream = webcamRef.current.getStream();
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
      } catch (err1) {
        try {
          // Fallback for iOS
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/mp4;codecs:h264" });
        } catch (err2) {
          // If fallback doesn't work either. Log / process errors.
          console.error({ err1 });
          console.error({ err2 });
        }
      }
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
    },
    [webcamRef, setCapturing, mediaRecorderRef]
  );

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const type = "video/mp4";
      const blob = new Blob(recordedChunks, {
        type,
      });
      const file = new File([blob], "video.mp4", { lastModified: new Date().getTime(), type });
      generateGif(handleSetState, dispatch, imgList, videoDuration);
      handleSetState({ video: file, currenFile: file });
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    if (recordedChunks.length) {
      handleDownload();
    }
  }, [recordedChunks]);

  const handleStopCaptureClick = React.useCallback(() => {
    stop();
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const callback = () => {
    const time = seconds;
    handleSetState({
      videoDuration: time,
    });
    handleStopCaptureClick();
  };

  useEffect(() => {
    if (seconds !== 0 && webcamRef.current) {
      const imageSrc = webcamRef.current.takePhoto();
      const time = seconds;
      handleSetState({
        imgList: [...imgList, imageSrc],
        videoDuration: time,
      });
    }
  }, [seconds]);

  const bind = useLongPress(callback, {
    onStart: handleStartCaptureClick,
    onCancel: callback,
    threshold: 5000,
    captureEvent: true,
    cancelOnMovement: false,
    detect: "both",
  });

  const updpateMainBtn = (type) => {
    // picture record
    if (type === "Doubletake") {
      handleSetState({
        dualCam: true,
      });
    }
    handleSetState({
      webcamCurrentType: type,
    });
  };

  const seshProps = {
    img,
    attributes,
    activeFile,
    currenFile,
    onlyCamera,
    dispatch,
    history,
    pathname,
  };

  // proceed with the generated file to the mint page
  const continueToMint = () => {
    let name;
    let file;
    let type;
    if (img) {
      name = "Image";
      const result = getFileFromBase64(img, name, "image/png");
      file = result;
      type = "Photography";
    } else if (activeFile === "gif") {
      file = currenFile;
      name = "Short";
      type = "Shorts";
    } else {
      file = currenFile;
      name = "video";
      type = "Shorts";
    }
    if (onlyCamera) {
      type = capitalizeFirstLetter(pathname);
    }

    dispatch(
      setZip({
        name: stickType ?? name,
        file,
        type,
        ...(!isEmpty(attributes) && { attributes }),
      })
    );

    history.push("/mint/1of1");
  };

  const continueToSelectStick = () => setSeshType(true);

  // update camera on resizing
  useEffect(() => {
    updateVideoSize(webcamWrapper, handleSetState);
    window.addEventListener("resize", () => updateVideoSize(webcamWrapper, handleSetState));
  }, [webcamWrapper.current?.clientWidth]);

  useEffect(() => {}, [webcamRef, capturing]);

  // detect mobile device or a desktop
  const details = navigator?.userAgent;

  /* regular expression 
  containing some mobile devices keywords 
  to search it in details string */
  const regexp = /android|iphone|kindle|ipad/i;

  const isMobileDevice = regexp.test(details);

  return img || gif || video ? (
    <div className={classes.cameraWrapper}>
      {gifGenrating && <div className={classes.overlay} />}
      <div className={classes.cameraShot}>
        <div className={classes.closeBtn} onClick={() => history.push("/mint/1of1")}>
          <CloseIcon />
        </div>
        {gif ? (
          <img src={URL.createObjectURL(gif)} alt="camera-shot" />
        ) : video ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={URL.createObjectURL(video)} autoPlay ref={videoRef} loop />
        ) : (
          <img src={img} alt="camera-shot" />
        )}
      </div>
      {/* select smoking stick for proof of sesh */}
      {!attributes.smoking_stick && seshType && img && (
        <StickType
          handleContinueToMint={continueToMint}
          seshProps={seshProps}
          handleSetState={handleSetState}
          attributes={attributes}
        />
      )}
      {/*  */}
      <div className={classes.imgBtn}>
        <div
          className={classes.mintBtn}
          onClick={pathname === "sesh" ? continueToSelectStick : continueToMint}
          attributes={attributes}
        >
          Continue
        </div>
        <p
          className={classes.mintBtn}
          onClick={() => {
            const clearAttributes = {
              location: attributes.location,
            };
            handleSetState({
              img: "",
              gif: "",
              video: "",
              activeFile: "gif",
              attributes: clearAttributes,
            });
          }}
        >
          Retake
        </p>
      </div>
    </div>
  ) : (
    <div className={classes.videoContainer}>
      <div className={classes.videoWrapper} ref={webcamWrapper}>
        {toggle ? (
          <Camera
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
        ) : (
          <div className={classes.videoOFF} />
        )}{" "}
      </div>
      <div className={classes.closeBtn} onClick={() => history.push("/create")}>
        <CloseIcon />
      </div>
      {isMobileDevice && (
        <div className={classes.sideSwitch} onClick={() => switchCameraToRear(webcam, handleSetState, webcamRef)}>
          <CameraSwitch />
        </div>
      )}
      <div className={classes.btnWrapper}>
        {/* switch mode button */}
        <div
          onClick={() => updpateMainBtn(displayedModes[0].text)}
          className={classes.switchBtn}
          key={displayedModes[0].id}
        >
          {displayedModes[0].icon}
          <p>{displayedModes[0].text}</p>
        </div>

        {/* main button */}
        {webcamCurrentType === "Photo" ? (
          <div onClick={() => takePicture(webcamRef, handleSetState)} className={classes.mainBtn}>
            <IconCapture className={classes.captureBtn} />
            <p>{webcamCurrentType}</p>
          </div>
        ) : (
          <div {...bind()} className={classes.mainBtn}>
            {!seconds && <Tooltip />}
            <RecordBtn seconds={seconds} webcamCurrentType={webcamCurrentType} />
            <p>{webcamCurrentType}</p>
          </div>
        )}
        {/* switch mode button */}
        {isMobileDevice && (
          <div
            onClick={() => updpateMainBtn(displayedModes[1].text)}
            className={classes.switchBtn}
            key={displayedModes[1].id}
          >
            {displayedModes[1].icon}
            <p>{displayedModes[1].text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegularCamera;
