import React, { useRef, useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useLongPress } from "use-long-press";
import Webcam from "react-webcam";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
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

const Capture = () => {
  const history = useHistory();

  const webcamRef = useRef();
  const mediaRecorderRef = useRef();
  const webcamWrapper = useRef();

  const [state, setState] = useState({
    toggle: false,
    img: "",
    gif: "",
    video: "",
    currenFile: "",
    activeFile: "mp4",
    // User/Selfie/forward camera
    webcam: "environment",
    // video size
    width: "100%",
    height: "100%",
    // genrate GIF loading status
    gifGenrating: false,
  });
  // video capture
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [capturing, setCapturing] = useState(false);

  const { toggle, img, webcam, width, height, gif, video, currenFile, activeFile, gifGenrating } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };
  const { dispatch } = useContext(GenContext);

  // update the video to fit different screen
  const aspectRatio = height >= width ? width / height : height / width;
  const videoConstraints = {
    facingMode: webcam,
    width,
    height,
    ...(aspectRatio && { aspectRatio }),
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
    const imageSrc = webcamRef.current.getScreenshot();
    handleSetState({ img: imageSrc });
  };
  const downloadImg = () => {
    const ImageBase64 = img.split("data:image/png;base64,")[1];
    const a = document.createElement("a"); // Create <a>
    a.href = `data:image/png;base64,${ImageBase64}`; // Image Base64 Goes here
    a.download = "Image.png"; // File name Here
    a.click(); // Downloaded file
  };
  function getFileFromBase64(string64, fileName, type) {
    console.log(string64);
    const trimmedString = string64.split(",")[1];
    console.log(trimmedString);
    const imageContent = atob(trimmedString);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
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

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
    start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  // Genrate GIF
  function getBase64(file) {
    dispatch(setLoader("Genrating GIF"));
    handleSetState({
      gifGenrating: true,
    });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      axios.post("https://video-to-gif-converter.herokuapp.com/", { url: reader.result }).then((res) => {
        const gifFile = getFileFromBase64(res.data.data, "Image.gif", "image/gif");
        console.log(file);
        handleSetState({ gif: gifFile });

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
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
  // file type switch
  useEffect(() => {
    if (activeFile === "gif") {
      if (gif) {
        handleSetState({ currenFile: gif });
      } else {
        const gifBase64 = getBase64(currenFile);
      }
    } else if (activeFile === "mp4") {
      handleSetState({
        currenFile: video,
      });
    }
  }, [activeFile]);
  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const type = "video/mp4";
      const blob = new Blob(recordedChunks, {
        type,
      });
      const file = new File([blob], "video.mp4", { lastModified: new Date().getTime(), type });

      const url = URL.createObjectURL(blob);
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
    mediaRecorderRef.current.stop();
    setCapturing(false);
    stop();
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const callback = useCallback(() => {
    handleStopCaptureClick();
  }, []);
  const bind = useLongPress(callback, {
    onStart: handleStartCaptureClick,
    onCancel: handleStopCaptureClick,
    threshold: 8000,
    captureEvent: true,
    cancelOnMovement: false,
    detect: "both",
  });

  const continueToMint = () => {
    let name;
    let file;
    if (img) {
      name = "Image.png";
      const result = getFileFromBase64(img, name, "image/png");
      file = result;
    } else if (activeFile === "gif") {
      file = currenFile;
      name = "GIF.gif";
    } else {
      file = currenFile;
      name = "video.mp4";
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
      <WebcamEnable toggle={toggle} getVideo={getVideo} />

      {img || gif || video ? (
        <div
          className={classes.cameraWrapper}
          // className={(!img || !gif) && classes.none}
        >
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
            <video src={URL.createObjectURL(video)} autoPlay className={`${classes.cameraShot}`} />
          ) : (
            <img className={`${classes.cameraShot}`} src={img} alt="camera-shot" />
          )}
          <div className={classes.imgBtn}>
            {!img && (
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
            )}
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
              <Webcam
                ref={webcamRef}
                audio={false}
                height="100%"
                screenshotFormat="image/png"
                style={{
                  textAlign: "center",
                  height: "100%",
                  width: "100%",
                  objectFit: "fill",
                }}
                width="100%"
                videoConstraints={videoConstraints}
                forceScreenshotSourceSize
              />
            ) : (
              <div className={classes.videoOFF} />
            )}
            <div className={classes.enableContainer}> </div>
          </div>
          <div className={classes.closeBtn} onClick={cancel}>
            <CloseIcon />
          </div>
          <div className={toggle ? classes.btnWrapper : classes.inactiveBtnWrapper}>
            <div {...bind()} className={classes.holdBtn}>
              <div className={classes.cancelBtn}>
                <CircularProgressbar
                  value={seconds / 796}
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
            </div>
            {/* <div onClick={handleStopCaptureClick} className={classes.cancelBtn} style={{ left: "70%" }}>
            stop
          </div> */}
            {/* <div onClick={handleDownload} className={classes.cancelBtn} style={{ left: "90%" }}>
              donwload
            </div> */}
            <div onClick={takePicture} className={classes.captureBtn}>
              <IconCapture />
            </div>

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
