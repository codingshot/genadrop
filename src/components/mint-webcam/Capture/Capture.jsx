import React, { useRef, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLongPress } from "use-long-press";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import Webcam from "react-webcam";
import { Camera } from "./Camera";
import classes from "./Capture.module.css";
import useTimer from "./useTimer";
import WebcamEnable from "../webcam-enable/webcamEnable";
// icons
import { ReactComponent as IconCapture } from "../../../assets/capture-btn.svg";
import { ReactComponent as CameraSwitch } from "../../../assets/camera-switch.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/arrow-left-stretched.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { setZip, setLoader, setNotification } from "../../../gen-state/gen.actions";

// record button
const RecordBtn = ({ seconds }) => (
  <div className={classes.RecordBtnWrapper}>
    <CircularProgressbar
      value={seconds / 500}
      maxValue={1}
      strokeWidth={12}
      styles={buildStyles({
        // Rotation of path and trail, in number of turns (0-1)
        rotation: 0.25,

        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
        strokeLinecap: "round",

        // Text size
        textSize: "16px",

        // How long animation takes to go from one percentage to another, in seconds
        pathTransitionDuration: 0.5,

        // Colors
        pathColor: "#FF3236",
        trailColor: "#ffffff",
      })}
    />
    <div className={classes.recordBtn} />
  </div>
);

const Capture = () => {
  const history = useHistory();

  const webcamRef = useRef();
  const mediaRecorderRef = useRef();
  const webcamWrapper = useRef();

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
  });
  // video capture
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const {
    toggle,
    img,
    webcam,
    width,
    height,
    gif,
    video,
    currenFile,
    activeFile,
    gifGenrating,
    webcamCurrentType,
    trackRecord,
    videoDuration,
  } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  const { dispatch } = useContext(GenContext);
  // update the video to fit different screen
  const isLandscape = height <= width;
  const ratio = isLandscape ? width / height : height / width;
  const videoConstraints = {
    facingMode: webcam,
    width,
    height,
    // ...(ratio && { ratio }),
  };
  const updateVideoSize = () => {
    const newWidth = webcamWrapper.current?.clientWidth;
    const newHeight = webcamWrapper.current?.clientHeight;
    handleSetState({ height: newHeight, width: newWidth });
  };
  useEffect(() => {
    updateVideoSize();
    window.addEventListener("resize", updateVideoSize);
  }, [webcamWrapper.current?.clientWidth]);

  useEffect(() => {}, [webcamRef, capturing]);

  // switch camera from front to rear for mobile view
  const switchCameraToRear = () => {
    const webcamStatus = webcam === "user" ? "environment" : "user";
    handleSetState({ webcam: webcamStatus });
    webcamRef.current.switchCamera();
  };

  // enable webcam
  const getVideo = () => {
    handleSetState({
      toggle: true,
    });
  };
  const cancel = () => {
    history.push("/mint/1of1");
  };

  // Picture Handler
  const takePicture = () => {
    const imageSrc = webcamRef.current.takePhoto();
    console.log(imageSrc);
    handleSetState({ img: imageSrc });
  };
  const downloadImg = () => {
    const ImageBase64 = img.split("data:image/png;base64,")[1];
    const a = document.createElement("a"); // Create <a>
    a.href = `data:image/png;base64,${ImageBase64}`; // Image Base64 Goes here
    a.download = "Image.png"; // File name Here
    a.click(); // Downloaded file
  };
  function getFileFromBytes(string64, fileName, type) {
    // const trimmedString = string64.split(",")[1];
    // const imageContent = atob(trimmedString);
    const buffer = new ArrayBuffer(string64.length);
    const view = new Uint8Array(buffer);

    for (let n = 0; n < string64.length; n++) {
      view[n] = string64.charCodeAt(n);
    }
    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
  }
  function getFileFromBase64(string64, fileName, type) {
    const trimmedString = string64.split(",")[1];
    const imageContent = atob(trimmedString);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);
    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
  }

  // Genrate GIF
  async function getBase64(file) {
    // console.log(duration);
    dispatch(setLoader("Generating GIF"));
    handleSetState({
      gifGenrating: true,
    });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      axios
        .post("https://video-to-gif-converter.herokuapp.com/test", {
          url: reader.result,
          duration: videoDuration / 100,
        })
        .then((res) => {
          const gifFile = getFileFromBytes(res.data.data, "Image.gif", "image/gif");
          handleSetState({ gif: gifFile, currenFile: gifFile });

          dispatch(setLoader(""));
          dispatch(
            setNotification({
              message: "GIF generated successfully",
              type: "success",
            })
          );
          handleSetState({
            gifGenrating: false,
          });
          return res.data.data;
        })
        .catch(() => {
          dispatch(setLoader(""));
          dispatch(
            setNotification({
              message: `Something Went Wrong, Please Try Again`,
              type: "error",
            })
          );
        });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

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
      // mediaRecorderRef.current = new MediaRecorder(webcamRef.current.getStream(), {
      //   mimeType: "video/webm",
      // });
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
      getBase64(file);
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

  // file type switch
  // useEffect(() => {
  //   if (activeFile === "gif") {
  //     if (gif) {
  //       handleSetState({ currenFile: gif });
  //     } else {
  //       getBase64(currenFile);s
  //     }
  //   } else if (activeFile === "mp4") {
  //     handleSetState({
  //       currenFile: video,
  //     });
  //   }
  // }, [activeFile]);
  return (
    <div className={`${classes.container}`}>
      <WebcamEnable toggle={toggle} getVideo={getVideo} />

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
            <video src={URL.createObjectURL(video)} autoPlay className={`${classes.cameraShot}`} loop />
          ) : (
            <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" />
          )}
          <div className={classes.imgBtn}>
            {/* {!img && (
              <div className={classes.typeSelcet}>
                <div
                  onClick={() => handleSetState({ activeFile: "gif" })}
                  className={activeFile === "gif" && classes.active}
                >
                  <div className={classes.rdaioBtn}>
                    <div />
                  </div>
                  <p>GIF</p>
                </div>
                <div
                  onClick={() => handleSetState({ activeFile: "mp4" })}
                  className={activeFile === "mp4" && classes.active}
                >
                  <div className={classes.rdaioBtn}>
                    <div />
                  </div>
                  <p>MP4</p>
                </div>
              </div>
            )} */}
            {/* <a onClick={downloadImg}>Download photo</a> */}
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
              // <Webcam
              //   ref={webcamRef}
              //   audio={false}
              //   screenshotFormat="image/png"
              //   style={{
              //     objectFit: "cover",
              //   }}
              //   minScreenshotHeight={videoConstraints.width}
              //   minScreenshotWidth={videoConstraints.height}
              //   width={videoConstraints.width}
              //   height={videoConstraints.height}
              //   videoConstraints={videoConstraints}
              // />
              <div className={classes.videoOFF} />
            )}
            <div className={classes.enableContainer}> </div>
          </div>
          <div className={classes.closeBtn} onClick={cancel}>
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
              <div onClick={takePicture} className={`${classes.captureBtn} ${classes.active}`}>
                <IconCapture />
              </div>
            ) : (
              <div {...bind()} className={`${classes.holdBtn} ${classes.active}`}>
                <RecordBtn seconds={seconds} webcamCurrentType={webcamCurrentType} />
              </div>
              // <div
              //   onClick={takePicture}
              //   className={`${classes.holdBtn} ${classes.active} ${trackRecord ? classes.recording : ""}`}
              // >
              //   <RecordBtn seconds={seconds} />
              // </div>
            )}
            <div className={classes.uploadBtn}>
              <CameraSwitch onClick={() => switchCameraToRear()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Capture;
