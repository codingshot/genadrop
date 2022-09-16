import React, { useRef, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLongPress } from "use-long-press";
import { Camera } from "./Camera";
import classes from "./Capture.module.css";
import useTimer from "./useTimer";
import WebcamEnable from "../webcam-enable/webcamEnable";
import RecordBtn from "./RecordBtn";
import { getFileFromBase64, takePicture, switchCameraToRear, updateVideoSize, generateGif } from "./Capture-script";
// icons
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setZip } from "../../../gen-state/gen.actions";

const Capture = () => {
  const history = useHistory();

  const webcamRef = useRef();
  const mediaRecorderRef = useRef();
  const webcamWrapper = useRef();
  // const canvasRef = useRef();
  const videoRef = useRef();

  const [state, setState] = useState({
    toggle: false,
    // each type file
    img: "",
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
    webcamCurrentType: "picture",
    trackRecord: false,
    videoDuration: 0,
    imgList: [],
  });
  // video capture
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [, setNumberOfCameras] = useState(0);
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
  } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  const { dispatch } = useContext(GenContext);

  useEffect(() => {
    updateVideoSize(webcamWrapper, handleSetState);
    window.addEventListener("resize", () => updateVideoSize(webcamWrapper, handleSetState));
  }, [webcamWrapper.current?.clientWidth]);

  useEffect(() => {}, [webcamRef, capturing]);

  // stopwatch, set to 8 sec
  const { seconds, start, stop } = useTimer();

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

  const updpateMainBtn = () => {
    if (webcamCurrentType === "picture") {
      handleSetState({
        webcamCurrentType: "record",
      });
    } else {
      handleSetState({
        webcamCurrentType: "picture",
      });
    }
  };

  const continueToMint = () => {
    let name;
    let file;
    if (img) {
      name = "Image";
      const result = getFileFromBase64(img, name, "image/png");
      file = result;
    } else if (activeFile === "gif") {
      file = currenFile;
      name = "Short";
    } else {
      file = currenFile;
      name = "video";
    }
    dispatch(
      setZip({
        name,
        file,
      })
    );

    history.push("/mint/1of1");
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

      {img || gif || video ? (
        <div className={classes.cameraWrapper}>
          <div
            onClick={() => {
              handleSetState({
                img: "",
                gif: "",
                video: "",
                activeFile: "mp4",
              });
            }}
            className={classes.retake}
          >
            <ArrowLeft />
          </div>

          {gif ? (
            <img className={`${classes.cameraShot}`} src={URL.createObjectURL(gif)} alt="camera-shot" />
          ) : video ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={URL.createObjectURL(video)} autoPlay className={`${classes.cameraShot}`} ref={videoRef} loop />
          ) : (
            <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" />
          )}
          <div className={classes.imgBtn}>
            <div className={`${classes.mintBtn} ${gifGenrating && classes.disabled}`} onClick={continueToMint}>
              Continue
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.videoContainer}>
          <div className={classes.videoWrapper} ref={webcamWrapper}>
            {toggle ? (
              <Camera
                ref={webcamRef}
                aspectRatio="cover"
                numberOfCamerasCallback={setNumberOfCameras}
                errorMessages={{
                  noCameraAccessible:
                    "No camera device accessible. Please connect your camera or try a different browser.",
                  permissionDenied: "Permission denied. Please refresh and give camera permission.",
                  switchCamera:
                    "It is not possible to switch camera to different one because there is only one video device accessible.",
                  canvas: "Canvas is not supported.",
                }}
              />
            ) : (
              <div className={classes.videoOFF} />
            )}
            <div className={classes.enableContainer}> </div>
          </div>
          <div className={classes.closeBtn} onClick={() => history.push("/mint/1of1")}>
            <CloseIcon />
          </div>
          <div className={classes.btnWrapper}>
            {webcamCurrentType !== "picture" ? (
              <div onClick={updpateMainBtn} className={classes.holdBtn}>
                <IconCapture />
              </div>
            ) : (
              <div onClick={updpateMainBtn} className={classes.holdBtn}>
                <RecordBtn seconds={seconds} />
              </div>
            )}
            {webcamCurrentType === "picture" ? (
              <div
                onClick={() => takePicture(webcamRef, handleSetState)}
                className={`${classes.captureBtn} ${classes.active}`}
              >
                <IconCapture />
              </div>
            ) : (
              <div {...bind()} className={`${classes.holdBtn} ${classes.active}`}>
                <RecordBtn seconds={seconds} webcamCurrentType={webcamCurrentType} />
              </div>
            )}
            <div className={classes.uploadBtn}>
              <CameraSwitch onClick={() => switchCameraToRear(webcam, handleSetState, webcamRef)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Capture;
